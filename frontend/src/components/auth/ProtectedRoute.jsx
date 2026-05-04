"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated, saveRedirectPath } from "./useAuth";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const authed = isAuthenticated();

  useEffect(() => {
    if (authed) return;

    const currentPath = `${window.location.pathname}${window.location.search}`;
    saveRedirectPath(currentPath);
    router.replace("/login");
  }, [authed, pathname, router]);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-gray-800" />
          <p className="text-gray-500">Checking access...</p>
        </div>
      </div>
    );
  }

  return children;
}
