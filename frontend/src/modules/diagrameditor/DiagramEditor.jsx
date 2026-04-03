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
  const color = data.color || '#c4f042';
  const bgColor = data.bgColor || '#1B1B29';

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
        border: selected ? '2px solid #c4f042' : '1px solid #2A2D3E',
        boxShadow: selected ? '0 0 0 3px rgba(196, 240, 66, 0.15)' : 'shadow-lg',
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
            {text || <span style={{ color: '#4A4D60' }}>Double-click to type...</span>}
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
  const [theme, setTheme] = useState('dark');
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
  const [edgeColor, setEdgeColor] = useState('#c4f042');

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
      color: selectedNode.data.color || '#c4f042',
      bgColor: selectedNode.data.bgColor || '#1B1B29',
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
              ? { ...n, style: { ...n.style, boxShadow: '0 0 0 3px #c4f042' } }
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

  const cursorClass = mode === 'add-edge' ? 'cursor-grab' : mode === 'pan' ? 'cursor-grab active:cursor-grabbing' : '';

  return (
    <div className={`flex w-screen h-screen ${theme === 'dark' ? 'bg-[#0A0A10]' : 'bg-gray-50'}`} onKeyDown={onKeyDown} tabIndex={0}>
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
          panOnDrag={mode === 'pan' ? true : (mode === 'select' ? [1] : false)}
          selectNodesOnDrag={mode === 'select'}
          connectionLineStyle={{ stroke: edgeColor, strokeWidth: 2 }}
          defaultEdgeOptions={buildEdgeStyle()}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={theme === 'dark' ? "#2A2D3E" : "#d1d5db"} />
          <Controls showInteractive={false} className={`!rounded-xl !border !shadow-lg ${theme === 'dark' ? '!border-white/10 !bg-[#1B1B29] !fill-gray-400 [&_button:hover]:!bg-white/5' : '!border-gray-200 !bg-white !fill-gray-600 [&_button:hover]:!bg-gray-50'}`} />
          <MiniMap
            nodeStrokeColor="#c4f042"
            nodeColor={theme === 'dark' ? '#303352' : '#e0e7ff'}
            maskColor={theme === 'dark' ? "rgba(10,10,16,0.85)" : "rgba(255,255,255,0.85)"}
            className={`!rounded-xl !border !shadow-lg ${theme === 'dark' ? '!border-white/10 !bg-[#1B1B29]' : '!border-gray-200 !bg-white/90'}`}
            style={{ height: 90, width: 130 }}
          />
        </ReactFlow>

        {/* Top Right Controls */}
        <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className={`flex items-center justify-center w-11 h-11 rounded-2xl backdrop-blur-xl border transition-all ${theme === 'dark' ? 'bg-[#1B1B29]/95 border-white/5 text-gray-300 hover:text-white shadow-[0_8px_40px_rgba(0,0,0,0.2)]' : 'bg-white/95 border-gray-200 text-gray-600 hover:text-gray-900 shadow-xl'}`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all shadow-xl ${isSaving ? 'bg-emerald-500/50 text-white/70 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20 active:scale-95'}`}
          >
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
             </svg>
             {isSaving ? 'Saving...' : 'Save & Return'}
          </button>
        </div>
      </div>

      <Sidebar
        theme={theme}
        mode={mode}
        setMode={handleModeChange}
        onDeleteSelected={handleDeleteSelected}
        onSelectAll={handleSelectAll}
        onFitView={handleFitView}
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