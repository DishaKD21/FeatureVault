'use client';

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Sidebar from './sidebar';
import { saveDiagram, loadDiagram } from '@/lib/diagramStore';
import { postDiagram } from '@/lib/diagramApi';

/* ─── ID generator ─── */
let id = 0;
const getId = () => `node_${id++}`;

/* ═══════════════════════════════════════
   CUSTOM EDITABLE NODE
   ═══════════════════════════════════════ */
function EditableNode({ id, data, selected }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(data.label || '');
  const inputRef = useRef(null);

  const nodeType = data.nodeType || 'default';
  const fontSize = data.fontSize || 14;
  const fontWeight = data.fontWeight || 'normal';
  const fontStyle = data.fontStyle || 'normal';
  const textDecoration = data.textDecoration || 'none';
  const textAlign = data.textAlign || 'center';
  const color = data.color || '#1f2937';
  const bgColor = data.bgColor || '#ffffff';

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    setEditing(false);
    if (data.onLabelChange) {
      data.onLabelChange(id, text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setText(data.label || '');
      setEditing(false);
    }
    // Prevent ReactFlow from capturing these keys
    e.stopPropagation();
  };

  return (
    <div
      style={{
        backgroundColor: bgColor,
        minWidth: 120,
        minHeight: 40,
        borderRadius: 8,
        border: selected ? '2px solid #6366f1' : '1px solid #e5e7eb',
        boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Handles */}
      {nodeType !== 'input' && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: '#6366f1', width: 8, height: 8, border: '2px solid white' }}
        />
      )}

      <div
        onDoubleClick={handleDoubleClick}
        style={{
          padding: '10px 16px',
          fontSize: `${fontSize}px`,
          fontWeight,
          fontStyle,
          textDecoration,
          textAlign,
          color,
          cursor: editing ? 'text' : 'default',
          minHeight: 20,
        }}
      >
        {editing ? (
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{
              width: '100%',
              minWidth: 80,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: `${fontSize}px`,
              fontWeight,
              fontStyle,
              textDecoration,
              textAlign,
              color,
              fontFamily: 'inherit',
              lineHeight: '1.4',
              padding: 0,
              margin: 0,
            }}
          />
        ) : (
          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {text || <span style={{ color: '#d1d5db' }}>Double-click to type...</span>}
          </span>
        )}
      </div>

      {nodeType !== 'output' && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: '#6366f1', width: 8, height: 8, border: '2px solid white' }}
        />
      )}
    </div>
  );
}

/* ─── Node type registry ─── */
const nodeTypes = { editable: EditableNode };

/* ─── Line style to strokeDasharray ─── */
const LINE_DASH = {
  solid: undefined,
  dashed: '8 4',
  dotted: '2 3',
};

/* ═══════════════════════════════════════
   PLAYGROUND
   ═══════════════════════════════════════ */
function Playground() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [mode, setMode] = useState('select');
  const [edgeSourceNode, setEdgeSourceNode] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const router = useRouter();

  /* ─── Load existing diagram on mount ─── */
  useEffect(() => {
    const saved = loadDiagram();
    if (saved?.diagramJson) {
      const { nodes: savedNodes = [], edges: savedEdges = [] } = saved.diagramJson;
      // Restore id counter to avoid collisions
      const maxId = savedNodes.reduce((max, n) => {
        const num = parseInt(n.id.replace('node_', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, -1);
      id = maxId + 1;
      setNodes(savedNodes);
      setEdges(savedEdges);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Save diagram handler ─── */
  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      // 1. Capture PNG from only the diagram canvas (no sidebar, controls, minimap)
      let diagramImageDataUrl = null;
      try {
        // Find the ReactFlow viewport element (contains only nodes and edges, no UI)
        const viewport = reactFlowWrapper.current?.querySelector('.react-flow__viewport');
        if (viewport) {
          diagramImageDataUrl = await toPng(viewport, {
            backgroundColor: '#f9fafb',
            pixelRatio: 2,
            cacheBust: true,
          });
        }
      } catch (imgErr) {
        console.warn('[DiagramEditor] PNG export failed, continuing without image:', imgErr);
      }

      // 2. Serialize current graph
      const diagramJson = { nodes, edges };

      // 3. Persist locally (localStorage bridge)
      saveDiagram({ diagramJson, diagramImageDataUrl });

      // 4. Sync to backend (non-blocking stub — won't block navigation on failure)
      postDiagram({ diagramJson, diagramImage: diagramImageDataUrl });

      // 5. Navigate back
      router.push('/create-doc');
    } catch (err) {
      console.error('[DiagramEditor] Save failed:', err);
      setIsSaving(false);
    }
  }, [nodes, edges, isSaving, router]);

  /* ─── Edge style state ─── */
  const [edgeType, setEdgeType] = useState('smoothstep');
  const [edgeLineStyle, setEdgeLineStyle] = useState('solid');
  const [edgeAnimated, setEdgeAnimated] = useState(true);
  const [edgeColor, setEdgeColor] = useState('#6366f1');

  /* ─── Selected counts ─── */
  const selectedCount = useMemo(() => ({
    nodes: nodes.filter((n) => n.selected).length,
    edges: edges.filter((e) => e.selected).length,
  }), [nodes, edges]);

  /* ─── Get selected node data for formatting toolbar ─── */
  const selectedNode = useMemo(() => {
    const sel = nodes.find((n) => n.selected);
    return sel || null;
  }, [nodes]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    return {
      fontSize: selectedNode.data.fontSize || 14,
      fontWeight: selectedNode.data.fontWeight || 'normal',
      fontStyle: selectedNode.data.fontStyle || 'normal',
      textDecoration: selectedNode.data.textDecoration || 'none',
      textAlign: selectedNode.data.textAlign || 'center',
      color: selectedNode.data.color || '#1f2937',
      bgColor: selectedNode.data.bgColor || '#ffffff',
    };
  }, [selectedNode]);

  /* ─── Label change callback ─── */
  const onLabelChange = useCallback(
    (nodeId, newLabel) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n
        )
      );
    },
    [setNodes]
  );

  /* ─── Inject callbacks into node data ─── */
  const nodesWithCallbacks = useMemo(
    () => nodes.map((n) => ({ ...n, data: { ...n.data, onLabelChange } })),
    [nodes, onLabelChange]
  );

  /* ─── Build edge style options ─── */
  const buildEdgeStyle = useCallback(() => ({
    type: edgeType === 'bezier' ? 'default' : edgeType,
    animated: edgeAnimated,
    markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
    style: {
      stroke: edgeColor,
      strokeWidth: 2,
      strokeDasharray: LINE_DASH[edgeLineStyle],
    },
  }), [edgeType, edgeLineStyle, edgeAnimated, edgeColor]);

  /* ─── Connect handler ─── */
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, ...buildEdgeStyle() }, eds));
    },
    [setEdges, buildEdgeStyle]
  );

  /* ─── Drag-drop from sidebar ─── */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: 'editable',
        position,
        data: {
          label: '',
          nodeType: type,
          onLabelChange,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes, onLabelChange]
  );

  /* ─── Pane click ─── */
  const onPaneClick = useCallback(
    () => {
      if (mode === 'add-edge') {
        // Reset source on empty click
        setEdgeSourceNode(null);
        setNodes((nds) =>
          nds.map((n) => {
            const { boxShadow, ...rest } = n.style || {};
            return { ...n, style: rest };
          })
        );
      }
    },
    [mode, setNodes]
  );

  /* ─── Node click for edge mode ─── */
  const onNodeClick = useCallback(
    (_event, node) => {
      if (mode !== 'add-edge') return;

      if (!edgeSourceNode) {
        setEdgeSourceNode(node.id);
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, style: { ...n.style, boxShadow: '0 0 0 3px #6366f1' } }
              : n
          )
        );
      } else if (edgeSourceNode !== node.id) {
        const newEdge = {
          id: `edge_${edgeSourceNode}_${node.id}_${Date.now()}`,
          source: edgeSourceNode,
          target: node.id,
          ...buildEdgeStyle(),
        };
        setEdges((eds) => addEdge(newEdge, eds));

        setNodes((nds) =>
          nds.map((n) => {
            const { boxShadow, ...rest } = n.style || {};
            return n.id === edgeSourceNode ? { ...n, style: rest } : n;
          })
        );
        setEdgeSourceNode(null);
      }
    },
    [mode, edgeSourceNode, setEdges, setNodes, buildEdgeStyle]
  );

  /* ─── Update node text style ─── */
  const handleUpdateNodeStyle = useCallback(
    (styleUpdates) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (!n.selected) return n;
          const updatedData = { ...n.data, ...styleUpdates };
          return { ...n, data: updatedData };
        })
      );
    },
    [setNodes]
  );

  /* ─── Delete selected ─── */
  const handleDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
  }, [setNodes, setEdges]);

  /* ─── Select all ─── */
  const handleSelectAll = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: true })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: true })));
  }, [setNodes, setEdges]);

  /* ─── Fit view ─── */
  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 300 });
  }, [fitView]);

  /* ─── Keyboard shortcuts ─── */
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Don't delete while editing text
        if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') return;
        handleDeleteSelected();
      }
      if (e.key === 'Escape') {
        setMode('select');
        setEdgeSourceNode(null);
        setNodes((nds) =>
          nds.map((n) => {
            const { boxShadow, ...rest } = n.style || {};
            return { ...n, style: rest };
          })
        );
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        handleSelectAll();
      }
    },
    [handleDeleteSelected, handleSelectAll, setNodes]
  );

  /* ─── Mode change ─── */
  const handleModeChange = useCallback(
    (newMode) => {
      setMode(newMode);
      setEdgeSourceNode(null);
      setNodes((nds) =>
        nds.map((n) => {
          const { boxShadow, ...rest } = n.style || {};
          return { ...n, style: rest };
        })
      );
    },
    [setNodes]
  );

  const cursorClass = mode === 'add-edge' ? 'cursor-pointer' : '';

  return (
    <div className="flex w-screen h-screen bg-gray-50" onKeyDown={onKeyDown} tabIndex={0}>
      <div className={`flex-1 relative ${cursorClass}`} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodesWithCallbacks}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[16, 16]}
          deleteKeyCode={['Delete', 'Backspace']}
          multiSelectionKeyCode="Shift"
          selectionOnDrag={mode === 'select'}
          panOnDrag={mode === 'select' ? [1] : false}
          selectNodesOnDrag={mode === 'select'}
          connectionLineStyle={{ stroke: edgeColor, strokeWidth: 2 }}
          defaultEdgeOptions={buildEdgeStyle()}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d1d5db" />
          <Controls showInteractive={false} className="rounded-xl! border! border-gray-200! shadow-md! bg-white!" />
          <MiniMap
            nodeStrokeColor="#6366f1"
            nodeColor="#e0e7ff"
            maskColor="rgba(255,255,255,0.85)"
            className="rounded-xl! border! border-gray-200! shadow-md! bg-white/90!"
            style={{ height: 90, width: 130 }}
          />
        </ReactFlow>

        {/* Mode indicator */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 text-[12px] font-medium text-gray-600">
          <span className={`w-2 h-2 rounded-full ${mode === 'select' ? 'bg-gray-400' : 'bg-emerald-500'}`} />
          {mode === 'select' && 'Select Mode'}
          {mode === 'add-edge' && (edgeSourceNode ? 'Click target node...' : 'Click source node...')}
          {mode !== 'select' && (
            <button
              onClick={() => handleModeChange('select')}
              className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <Sidebar
        mode={mode}
        setMode={handleModeChange}
        onDeleteSelected={handleDeleteSelected}
        onSelectAll={handleSelectAll}
        onFitView={handleFitView}
        onSave={handleSave}
        isSaving={isSaving}
        selectedCount={selectedCount}
        edgeSourceNode={edgeSourceNode}
        edgeType={edgeType}
        setEdgeType={setEdgeType}
        edgeLineStyle={edgeLineStyle}
        setEdgeLineStyle={setEdgeLineStyle}
        edgeAnimated={edgeAnimated}
        setEdgeAnimated={setEdgeAnimated}
        edgeColor={edgeColor}
        setEdgeColor={setEdgeColor}
        selectedNodeData={selectedNodeData}
        onUpdateNodeStyle={handleUpdateNodeStyle}
      />
    </div>
  );
}

export default function DiagramEditor() {
  return (
    <ReactFlowProvider>
      <Playground />
    </ReactFlowProvider>
  );
}