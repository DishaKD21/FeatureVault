'use client';

import { Suspense } from 'react';
import DocForm from '@/modules/docform/DocForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading document...</p>
      </div>
    </div>
  );
}

export default function CreateDocPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingFallback />}>
        <div>
          <DocForm />
        </div>
      </Suspense>
    </ProtectedRoute>
  );
}
