'use client';

import { Suspense } from 'react';
import DiagramEditor from '@/modules/diagrameditor/DiagramEditor';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#0A0A10]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="text-gray-400">Loading editor...</p>
      </div>
    </div>
  );
}

export default function DiagramEditorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div>
        <DiagramEditor />
      </div>
    </Suspense>
  );
}
