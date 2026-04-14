# extract_diagrams.py
# PURPOSE: Connect to MongoDB Atlas and extract diagram JSON data
# RUN ON: VS Code on your local PC
# OUTPUT: raw_diagrams.json

import json
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# ─────────────────────────────────────────────
# STEP 1: Load environment variables from .env
# ─────────────────────────────────────────────
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

if not MONGO_URI or not DATABASE_NAME or not COLLECTION_NAME:
    raise ValueError(" Missing environment variables. Check your .env file.")

print(f" Database : {DATABASE_NAME}")
print(f" Collection: {COLLECTION_NAME}")

# ─────────────────────────────────────────────
# STEP 2: Connect to MongoDB Atlas
# ─────────────────────────────────────────────
print("\nConnecting to MongoDB Atlas...")
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

# ─────────────────────────────────────────────
# STEP 3: Fetch all diagrams
# ─────────────────────────────────────────────
diagrams = list(collection.find({}))
print(f" Found {len(diagrams)} diagrams")

# ─────────────────────────────────────────────
# STEP 4: Extract only the relevant fields
# We need: _id, nodes (id + label + nodeType), edges (source + target + label)
# ─────────────────────────────────────────────
extracted = []

for diagram in diagrams:
    try:
        diagram_id = str(diagram["_id"])
        nodes = diagram.get("json", {}).get("nodes", [])
        edges = diagram.get("json", {}).get("edges", [])

        # Extract only useful node fields
        clean_nodes = []
        for node in nodes:
            label = node.get("data", {}).get("label", "").strip()
            node_type = node.get("data", {}).get("nodeType", "default")
            node_id = node.get("id", "")

            if label:  # skip nodes with empty labels
                clean_nodes.append(
                    {
                        "id": node_id,
                        "label": label,
                        "nodeType": node_type,  # input / default / output
                    }
                )

        # Extract only useful edge fields
        clean_edges = []
        for edge in edges:
            source = edge.get("source", "")
            target = edge.get("target", "")
            edge_label = edge.get("label", "")

            clean_edges.append(
                {"source": source, "target": target, "label": edge_label}
            )

        extracted.append({"id": diagram_id, "nodes": clean_nodes, "edges": clean_edges})

    except Exception as e:
        print(f"  Skipping diagram {diagram.get('_id', '?')} due to error: {e}")
        continue

# ─────────────────────────────────────────────
# STEP 5: Save to JSON file
# ─────────────────────────────────────────────
with open("raw_diagrams.json", "w", encoding="utf-8") as f:
    json.dump(extracted, f, indent=2, ensure_ascii=False)

print(f"\n Done! Saved {len(extracted)} diagrams to raw_diagrams.json")
client.close()
