'use client';

import React from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function Playground() {
  return (
    <div className="w-screen h-screen">
      <ReactFlow nodes={[]} edges={[]}>
        
        {/* Background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#d1d5db"
        />

        {/* Zoom Controls */}
        <Controls className="!bg-white !shadow-lg !rounded-lg" />

      </ReactFlow>
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