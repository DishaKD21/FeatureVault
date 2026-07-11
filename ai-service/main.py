import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "featurevault")
DIAGRAM_COLLECTION = os.getenv("DIAGRAM_COLLECTION", os.getenv("COLLECTION_NAME", "diagrams"))
DOCUMENT_COLLECTION = os.getenv("DOCUMENT_COLLECTION", "documentations")
MODEL_PATH = os.getenv(
    "MODEL_PATH",
    str(Path(__file__).resolve().parent / "Finetuned_Model" / "diagram-explainer-final"),
)

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is not set")

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
diagram_collection = db[DIAGRAM_COLLECTION]
document_collection = db[DOCUMENT_COLLECTION]

app = FastAPI()

print(f"Loading AI model from: {MODEL_PATH}", flush=True)
print("Loading tokenizer...", flush=True)
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
print("Tokenizer loaded.", flush=True)
print("Loading model...", flush=True)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH)
print("Model loaded.", flush=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()
print("AI service is ready.", flush=True)


class GenerateRequest(BaseModel):
    input_text: str | None = None
    documentId: str | None = None
    diagramId: str | None = None


def normalize_label(value):
    return str(value or "").replace("\n", " ").strip()


def build_node_map(nodes):
    return {node.get("id", ""): normalize_label(node.get("data", {}).get("label", "")) for node in nodes}


def extract_labels(nodes):
    labels = []
    for node in nodes:
        label = normalize_label(node.get("data", {}).get("label", ""))
        if label:
            labels.append(label)
    return labels


def build_input_prompt(nodes, edges):
    node_map = build_node_map(nodes)

    node_descriptions = []
    for node in nodes:
        label = normalize_label(node.get("data", {}).get("label", ""))
        node_type = node.get("data", {}).get("nodeType", "default")
        if label:
            node_descriptions.append(f"[{node_type.upper()}] {label}")

    edge_descriptions = []
    for edge in edges:
        src = normalize_label(node_map.get(edge.get("source", ""), "?"))[:60]
        tgt = normalize_label(node_map.get(edge.get("target", ""), "?"))[:60]
        edge_descriptions.append(f"{src} -> {tgt}")

    nodes_text = " | ".join(node_descriptions)
    edges_text = " | ".join(edge_descriptions)

    prompt = (
        "Explain the following software architecture diagram. "
        f"Nodes: {nodes_text}. "
        f"Connections: {edges_text}."
    )

    return prompt


def generate_explanation(input_text: str):
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True, max_length=512)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.inference_mode():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=256,
            num_beams=4,
            early_stopping=True,
        )

    return tokenizer.decode(output_ids[0], skip_special_tokens=True)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/generate")
def generate(payload: GenerateRequest):
    if payload.input_text:
        explanation = generate_explanation(payload.input_text)
        return {"explanation": explanation}

    if not payload.documentId or not payload.diagramId:
        raise HTTPException(status_code=400, detail="input_text or documentId and diagramId are required")

    try:
        document_id = ObjectId(payload.documentId)
        diagram_id = ObjectId(payload.diagramId)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid documentId or diagramId") from exc

    document = document_collection.find_one({"_id": document_id})
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    diagram = diagram_collection.find_one({"_id": diagram_id, "documentId": document_id})
    if not diagram:
        raise HTTPException(status_code=404, detail="Diagram not found")

    diagram_json = diagram.get("json") or {}
    nodes = diagram_json.get("nodes", []) or []
    edges = diagram_json.get("edges", []) or []

    if len(nodes) < 2:
        raise HTTPException(status_code=400, detail="Diagram does not have enough nodes")

    _ = extract_labels(nodes)
    prompt = build_input_prompt(nodes, edges)
    explanation = generate_explanation(prompt)

    diagram_collection.update_one(
        {"_id": diagram_id},
        {"$set": {"explanation": explanation}},
    )

    return {"success": True, "explanation": explanation}
