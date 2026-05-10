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
    <nav className="flex items-center justify-between border-b border-border bg-background/80 px-6 py-3 shadow-fv-soft backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <ThemeLogo priority />

      <div className="flex items-center gap-6 text-muted-foreground">
        <Link href="/" className="transition hover:text-foreground">
          Home
        </Link>
        <Link href="/#features" className="transition hover:text-foreground">
          Features
        </Link>
        <button
          type="button"
          disabled={redirectingTo === "/diagram-editor"}
          onClick={() => goProtected("/diagram-editor")}
          className="transition hover:text-foreground disabled:cursor-wait disabled:opacity-50"
        >
          Diagram Tool
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle />
        {checkingAuth ? (
          <span className="text-sm text-muted-foreground">Checking...</span>
        ) : !authenticated ? (
          <>
            <Link href="/login" className="rounded-lg px-4 py-1.5 transition hover:bg-accent">
              Login
            </Link>
            <Link href="/register" className="rounded-lg border border-border px-4 py-1.5 transition hover:bg-accent">
              Signup
            </Link>
          </>
        ) : (
          <>
            {userLabel && <span className="hidden text-sm text-muted-foreground sm:inline">{userLabel}</span>}
            <button
              type="button"
              disabled={redirectingTo === "/dashboard"}
              onClick={() => goProtected("/dashboard")}
              className="font-medium text-primary transition hover:text-foreground disabled:cursor-wait disabled:opacity-50"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-destructive/25 px-3 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
