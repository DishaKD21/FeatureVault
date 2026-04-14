'use client';

import { Suspense } from 'react';
import DocForm from '@/modules/docform/DocForm';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
        <p className="text-gray-500">Loading document...</p>
      </div>
    </div>
  );
}

export default function CreateDocPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div>
        <DocForm />
      </div>
    </Suspense>
  );
}