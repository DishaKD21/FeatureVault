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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  return children;
}
