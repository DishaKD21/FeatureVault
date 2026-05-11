'use client';

import { Suspense } from 'react';
import DiagramEditor from '@/modules/diagrameditor/DiagramEditor';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function LoadingFallback() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading editor…</p>
      </div>
    </div>
  );
}

export default function DiagramEditorPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingFallback />}>
        <div>
          <DiagramEditor />
        </div>
      </Suspense>
    </ProtectedRoute>
  );
}
