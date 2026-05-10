"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeLogo from "@/components/branding/ThemeLogo";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../modules/authentication/firebase";
import { isAuthenticated, saveRedirectPath, syncFirebaseUser, useAuth } from "@/components/auth/useAuth";
import ThemeToggle from "@/components/theme/theme-toggle";

const Navbar = () => {
  const router = useRouter();
  const { authenticated, checkingAuth, logout } = useAuth();
  const [userLabel, setUserLabel] = useState("");
  const [redirectingTo, setRedirectingTo] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUserLabel("");
        return;
      }

      setUserLabel(currentUser.displayName || currentUser.email?.split("@")[0] || "");

      const hasToken = typeof window !== "undefined" && localStorage.getItem("token");
      if (!hasToken) {
        await syncFirebaseUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const goProtected = (path) => {
    setRedirectingTo(path);

    if (!isAuthenticated()) {
      saveRedirectPath(path);
      router.push("/login");
      return;
    }

    router.push(path);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-border/80 bg-background/85 px-4 py-3 shadow-fv-soft backdrop-blur-[var(--fv-header-blur)] supports-[backdrop-filter]:bg-background/70 sm:gap-4 sm:px-6">
      <ThemeLogo priority />

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto text-xs text-muted-foreground sm:gap-6 sm:text-sm">
        <Link href="/" className="shrink-0 rounded-lg px-2 py-1.5 transition hover:bg-accent/80 hover:text-foreground">
          Home
        </Link>
        <Link href="/#features" className="shrink-0 rounded-lg px-2 py-1.5 transition hover:bg-accent/80 hover:text-foreground">
          Features
        </Link>
        <button
          type="button"
          disabled={redirectingTo === "/diagram-editor"}
          onClick={() => goProtected("/diagram-editor")}
          className="shrink-0 rounded-lg px-2 py-1.5 transition hover:bg-accent/80 hover:text-foreground disabled:cursor-wait disabled:opacity-50"
        >
          <span className="hidden sm:inline">Diagram Tool</span>
          <span className="sm:hidden">Diagram</span>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {checkingAuth ? (
          <span className="hidden text-sm text-muted-foreground sm:inline">Checking...</span>
        ) : !authenticated ? (
          <>
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent/80 hover:text-foreground sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-fv-soft transition hover:bg-primary/90 sm:px-4"
            >
              Get started
            </Link>
          </>
        ) : (
          <>
            {userLabel && (
              <span className="hidden max-w-[7rem] truncate text-sm text-muted-foreground lg:inline xl:max-w-[10rem]">{userLabel}</span>
            )}
            <button
              type="button"
              disabled={redirectingTo === "/dashboard"}
              onClick={() => goProtected("/dashboard")}
              className="rounded-lg px-2 py-2 text-sm font-medium text-primary transition hover:bg-accent/80 hover:text-foreground disabled:cursor-wait disabled:opacity-50 sm:px-3"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-destructive/25 px-2 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 sm:px-3"
            >
              Logout
            </button>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
