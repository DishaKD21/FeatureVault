'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Sidebar from './sidebar';

/* ─── ID generator ─── */
let id = 0;
const getId = () => `node_${id++}`;

/* ─── Center position offset for click-to-add ─── */
const NODE_DEFAULTS = {
  default: { width: 160, height: 40, label: 'Rectangle' },
  input: { width: 160, height: 40, label: 'Input' },
  output: { width: 160, height: 40, label: 'Output' },
  group: { width: 200, height: 150, label: 'Group' },
  annotation: { width: 180, height: 40, label: 'Note' },
};

function Playground() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [mode, setMode] = useState('select'); // 'select' | 'add-node' | 'add-edge'
  const [addNodeType, setAddNodeType] = useState('default');
  const [addNodeLabel, setAddNodeLabel] = useState('Rectangle');
  const [edgeSourceNode, setEdgeSourceNode] = useState(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  /* ─── Selected counts ─── */
  const selectedCount = useMemo(() => ({
    nodes: nodes.filter((n) => n.selected).length,
    edges: edges.filter((e) => e.selected).length,
  }), [nodes, edges]);

  /* ─── Connect handler (normal drag-connect) ─── */
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
            style: { stroke: '#6366f1', strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );

  /* ─── Drag-and-drop from sidebar (in select mode) ─── */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow-label');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: type === 'annotation' || type === 'group' ? 'default' : type,
        position,
        data: { label: label || NODE_DEFAULTS[type]?.label || 'Node' },
        ...(type === 'group' ? { style: { width: 200, height: 150, backgroundColor: 'rgba(240,240,255,0.5)', border: '1px dashed #6366f1' } } : {}),
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  /* ─── Click on canvas → add node (in add-node mode) ─── */
  const onPaneClick = useCallback(
    (event) => {
      if (mode === 'add-node') {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = {
          id: getId(),
          type: addNodeType === 'annotation' || addNodeType === 'group' ? 'default' : addNodeType,
          position,
          data: { label: addNodeLabel },
          ...(addNodeType === 'group' ? { style: { width: 200, height: 150, backgroundColor: 'rgba(240,240,255,0.5)', border: '1px dashed #6366f1' } } : {}),
        };

        setNodes((nds) => [...nds, newNode]);
      }

      if (mode === 'add-edge') {
        // If clicking on empty canvas during edge mode, reset source
        setEdgeSourceNode(null);
      }
    },
    [mode, addNodeType, addNodeLabel, screenToFlowPosition, setNodes]
  );

  /* ─── Click node → edge source/target (in add-edge mode) ─── */
  const onNodeClick = useCallback(
    (_event, node) => {
      if (mode !== 'add-edge') return;

      if (!edgeSourceNode) {
        // First click — set source
        setEdgeSourceNode(node.id);
        // Highlight the source node
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, style: { ...n.style, boxShadow: '0 0 0 2px #6366f1', borderRadius: '8px' } }
              : n
          )
        );
      } else if (edgeSourceNode !== node.id) {
        // Second click — create edge
        const newEdge = {
          id: `edge_${edgeSourceNode}_${node.id}`,
          source: edgeSourceNode,
          target: node.id,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
          style: { stroke: '#6366f1', strokeWidth: 2 },
        };
        setEdges((eds) => addEdge(newEdge, eds));

        // Remove highlight from source
        setNodes((nds) =>
          nds.map((n) => {
            const { boxShadow, ...rest } = n.style || {};
            return n.id === edgeSourceNode ? { ...n, style: rest } : n;
          })
        );
        setEdgeSourceNode(null);
      }
    },
    [mode, edgeSourceNode, setEdges, setNodes]
  );

  /* ─── Sidebar: click to add node (sets type, then next canvas click places it) ─── */
  const handleSidebarAddNode = useCallback(
    (type, label) => {
      setAddNodeType(type);
      setAddNodeLabel(label || NODE_DEFAULTS[type]?.label || 'Node');
    },
    []
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
      // Delete / Backspace → remove selected
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected();
      }
      // Escape → back to select mode
      if (e.key === 'Escape') {
        setMode('select');
        setEdgeSourceNode(null);
        // Clear any source highlight
        setNodes((nds) =>
          nds.map((n) => {
            const { boxShadow, ...rest } = n.style || {};
            return { ...n, style: rest };
          })
        );
      }
      // Ctrl+A → select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        handleSelectAll();
      }
    },
    [handleDeleteSelected, handleSelectAll, setNodes]
  );

  /* ─── Mode change: reset edge source ─── */
  const handleModeChange = useCallback(
    (newMode) => {
      setMode(newMode);
      setEdgeSourceNode(null);
      // Clear any source highlight
      setNodes((nds) =>
        nds.map((n) => {
          const { boxShadow, ...rest } = n.style || {};
          return { ...n, style: rest };
        })
      );
    },
    [setNodes]
  );

  /* ─── Cursor style based on mode ─── */
  const cursorClass = mode === 'add-node' ? 'cursor-crosshair' : mode === 'add-edge' ? 'cursor-pointer' : '';

  return (
    <div
      className="flex w-screen h-screen bg-gray-50"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {/* Canvas */}
      <div className={`flex-1 relative ${cursorClass}`} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          fitView
          snapToGrid
          snapGrid={[16, 16]}
          deleteKeyCode={['Delete', 'Backspace']}
          multiSelectionKeyCode="Shift"
          selectionOnDrag={mode === 'select'}
          panOnDrag={mode === 'select' ? [1] : false}
          selectNodesOnDrag={mode === 'select'}
          connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
            style: { stroke: '#6366f1', strokeWidth: 2 },
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#d1d5db"
          />
          <Controls
            showInteractive={false}
            className="!rounded-xl !border !border-gray-200 !shadow-md !bg-white"
          />
          <MiniMap
            nodeStrokeColor="#6366f1"
            nodeColor="#e0e7ff"
            maskColor="rgba(255,255,255,0.85)"
            className="!rounded-xl !border !border-gray-200 !shadow-md !bg-white/90"
            style={{ height: 90, width: 130 }}
          />
        </ReactFlow>

        {/* Mode indicator pill */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 text-[12px] font-medium text-gray-600">
          <span className={`w-2 h-2 rounded-full ${mode === 'select' ? 'bg-gray-400' : mode === 'add-node' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
          {mode === 'select' && 'Select Mode'}
          {mode === 'add-node' && `Adding: ${addNodeLabel}`}
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

      {/* Sidebar */}
      <Sidebar
        mode={mode}
        setMode={handleModeChange}
        onAddNode={handleSidebarAddNode}
        onDeleteSelected={handleDeleteSelected}
        onSelectAll={handleSelectAll}
        onFitView={handleFitView}
        selectedCount={selectedCount}
        edgeSourceNode={edgeSourceNode}
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