# prepare_prompts.py
# PURPOSE: Convert raw diagram JSON into input/output training pairs for Flan-T5
# RUN ON: VS Code on your local PC
# INPUT:  raw_diagrams.json (output of script 1)
# OUTPUT: training_data.json (upload this to Google Colab)

import json

# ─────────────────────────────────────────────
# STEP 1: Load the extracted diagram data
# ─────────────────────────────────────────────
with open("raw_diagrams.json", "r", encoding="utf-8") as f:
    diagrams = json.load(f)

print(f"Loaded {len(diagrams)} diagrams")


# ─────────────────────────────────────────────
# STEP 2: Build a node lookup map (id → label)
# This helps us resolve source/target IDs in edges to human-readable labels
# ─────────────────────────────────────────────
def build_node_map(nodes):
    return {node["id"]: node["label"] for node in nodes}


# ─────────────────────────────────────────────
# STEP 3: Generate explanation from diagram data (rule-based)
# This creates the TARGET (output) text for training
# Since you don't have manual explanations yet, we generate them
# from the node labels and edge connections automatically
# ─────────────────────────────────────────────
def generate_explanation(nodes, edges, node_map):
    lines = []

    # Find start node (nodeType = input)
    start_nodes = [n for n in nodes if n["nodeType"] == "input"]
    end_nodes = [n for n in nodes if n["nodeType"] == "output"]
    middle_nodes = [n for n in nodes if n["nodeType"] == "default"]

    # Opening sentence
    if start_nodes:
        start_label = start_nodes[0]["label"].replace("\n", " ").strip()
        lines.append(f"The flow begins at '{start_label}'.")

    # Describe each step in flow order using edges
    # Build adjacency: source_label → target_label
    flow_steps = []
    for edge in edges:
        src_label = (
            node_map.get(edge["source"], edge["source"]).replace("\n", " ").strip()
        )
        tgt_label = (
            node_map.get(edge["target"], edge["target"]).replace("\n", " ").strip()
        )
        connector = f"via '{edge['label']}'" if edge.get("label") else "which leads to"

        # Shorten very long labels for flow description
        src_short = src_label[:80] + "..." if len(src_label) > 80 else src_label
        tgt_short = tgt_label[:80] + "..." if len(tgt_label) > 80 else tgt_label

        flow_steps.append(f"'{src_short}' {connector} '{tgt_short}'.")

    if flow_steps:
        lines.append(
            "The sequence of steps is as follows: " + " Then, ".join(flow_steps)
        )

    # Describe each middle node's details
    for node in middle_nodes:
        label = node["label"].replace("\n", " ").strip()
        if len(label) > 40:  # only describe if it has real content
            lines.append(f"Key step: {label[:300]}.")

    # Closing sentence
    if end_nodes:
        end_label = end_nodes[0]["label"].replace("\n", " ").strip()
        lines.append(f"The process concludes with: {end_label[:200]}.")

    return " ".join(lines)


# ─────────────────────────────────────────────
# STEP 4: Build the input prompt for Flan-T5
# This is what you FEED to the model
# ─────────────────────────────────────────────
def build_input_prompt(nodes, edges, node_map):
    # Describe nodes
    node_descriptions = []
    for node in nodes:
        label = node["label"].replace("\n", " ").strip()
        node_descriptions.append(f"[{node['nodeType'].upper()}] {label}")

    # Describe edges (connections)
    edge_descriptions = []
    for edge in edges:
        src = node_map.get(edge["source"], "?").replace("\n", " ").strip()[:60]
        tgt = node_map.get(edge["target"], "?").replace("\n", " ").strip()[:60]
        edge_descriptions.append(f"{src} → {tgt}")

    nodes_text = " | ".join(node_descriptions)
    edges_text = " | ".join(edge_descriptions)

    prompt = (
        f"Explain the following software architecture diagram. "
        f"Nodes: {nodes_text}. "
        f"Connections: {edges_text}."
    )
    return prompt


# ─────────────────────────────────────────────
# STEP 5: Process all diagrams and create training pairs
# ─────────────────────────────────────────────
training_data = []
skipped = 0

for diagram in diagrams:
    nodes = diagram.get("nodes", [])
    edges = diagram.get("edges", [])

    # Skip diagrams with no nodes
    if len(nodes) < 2:
        skipped += 1
        continue

    node_map = build_node_map(nodes)

    input_text = build_input_prompt(nodes, edges, node_map)
    output_text = generate_explanation(nodes, edges, node_map)

    training_data.append(
        {
            "diagram_id": diagram["id"],
            "input_text": input_text,
            "target_text": output_text,
        }
    )

# ─────────────────────────────────────────────
# STEP 6: Save training data
# ─────────────────────────────────────────────
with open("training_data.json", "w", encoding="utf-8") as f:
    json.dump(training_data, f, indent=2, ensure_ascii=False)

print(f"\n Done! Created {len(training_data)} training pairs")
print(f"   Skipped: {skipped} diagrams (too few nodes)")
print(f"\n Sample prompt:")
print(f"INPUT:  {training_data[0]['input_text'][:300]}...")
print(f"OUTPUT: {training_data[0]['target_text'][:300]}...")
print(f"\n Upload 'training_data.json' to Google Colab to train the model")
