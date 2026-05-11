"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeLogo from "@/components/branding/ThemeLogo";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../modules/authentication/firebase";
import { isAuthenticated, saveRedirectPath, syncFirebaseUser, useAuth } from "@/components/auth/useAuth";
import ThemeToggle from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const desktopLink =
  "shrink-0 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-accent/80 hover:text-foreground";

const mobileItem =
  "block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-foreground transition hover:bg-accent/80";

const Navbar = () => {
  const router = useRouter();
  const { authenticated, checkingAuth, logout } = useAuth();
  const [userLabel, setUserLabel] = useState("");
  const [redirectingTo, setRedirectingTo] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const goProtected = (path) => {
    setRedirectingTo(path);

    if (!isAuthenticated()) {
      saveRedirectPath(path);
      router.push("/login");
      return;
    }

    router.push(path);
  };

  const goProtectedFromMenu = (path) => {
    setMenuOpen(false);
    goProtected(path);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex w-full min-w-0 items-center justify-between gap-2 border-b border-border/80 bg-background/85 px-3 py-2.5 shadow-fv-soft backdrop-blur-[var(--fv-header-blur)] supports-[backdrop-filter]:bg-background/70 sm:gap-3 sm:px-5 sm:py-3">
        <div className="min-w-0 shrink-0">
          <ThemeLogo priority />
        </div>

        {/* Desktop — center links */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex md:gap-6">
          <Link href="/" className={desktopLink}>
            Home
          </Link>
          <Link href="/#features" className={desktopLink}>
            Features
          </Link>
          <button
            type="button"
            disabled={redirectingTo === "/diagram-editor"}
            onClick={() => goProtected("/diagram-editor")}
            className={cn(desktopLink, "disabled:cursor-wait disabled:opacity-50")}
          >
            Diagram Tool
          </button>
        </div>

        {/* Desktop — auth + theme */}
        <div className="hidden min-w-0 shrink-0 items-center justify-end gap-2 md:flex md:gap-3">
          {checkingAuth ? (
            <span className="text-sm text-muted-foreground">Checking...</span>
          ) : !authenticated ? (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent/80 hover:text-foreground lg:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-fv-soft transition hover:bg-primary/90 lg:px-4"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              {userLabel && (
                <span className="hidden max-w-[7rem] truncate text-sm text-muted-foreground xl:inline xl:max-w-[10rem]">{userLabel}</span>
              )}
              <button
                type="button"
                disabled={redirectingTo === "/dashboard"}
                onClick={() => goProtected("/dashboard")}
                className="rounded-lg px-3 py-2 text-sm font-medium text-primary transition hover:bg-accent/80 hover:text-foreground disabled:cursor-wait disabled:opacity-50"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-destructive/25 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                Logout
              </button>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile — compact CTA + menu */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          {!authenticated && !checkingAuth ? (
            <Link
              href="/register"
              onClick={closeMenu}
              className="rounded-lg bg-primary px-2.5 py-2 text-xs font-medium text-primary-foreground shadow-fv-soft transition hover:bg-primary/90 sm:text-sm"
            >
              Get started
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-fv-soft transition hover:bg-accent/80"
            aria-expanded={menuOpen}
            aria-controls="fv-site-mobile-nav"
            aria-label="Open menu"
          >
            <Menu className="size-5 shrink-0" aria-hidden />
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <>
          <div
            role="presentation"
            className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
            aria-hidden
          />
          <div
            id="fv-site-mobile-nav"
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(22rem,92vw)] flex-col border-l border-border bg-card shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold text-foreground">Menu</span>
              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4 pb-8" aria-label="Mobile navigation">
              <Link href="/" className={mobileItem} onClick={closeMenu}>
                Home
              </Link>
              <Link href="/#features" className={mobileItem} onClick={closeMenu}>
                Features
              </Link>
              <button
                type="button"
                disabled={redirectingTo === "/diagram-editor"}
                className={cn(mobileItem, "text-left disabled:opacity-50")}
                onClick={() => goProtectedFromMenu("/diagram-editor")}
              >
                Diagram Tool
              </button>

              <div className="my-4 border-t border-border" />

              {checkingAuth ? (
                <p className="px-4 text-sm text-muted-foreground">Checking session…</p>
              ) : !authenticated ? (
                <>
                  <Link href="/login" className={mobileItem} onClick={closeMenu}>
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={cn(mobileItem, "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
                    onClick={closeMenu}
                  >
                    Get started
                  </Link>
                </>
              ) : (
                <>
                  {userLabel ? (
                    <p className="truncate px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{userLabel}</p>
                  ) : null}
                  <button
                    type="button"
                    disabled={redirectingTo === "/dashboard"}
                    className={cn(mobileItem, "text-left disabled:opacity-50")}
                    onClick={() => goProtectedFromMenu("/dashboard")}
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    className={cn(mobileItem, "text-left text-destructive hover:bg-destructive/10")}
                    onClick={() => {
                      closeMenu();
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Navbar;
