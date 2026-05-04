"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/modules/authentication/firebase";
import API_URL from "@/config";

export const TOKEN_KEY = "token";
export const USER_KEY = "user";
export const REDIRECT_KEY = "redirectAfterLogin";
const API_BASE = `${API_URL}/api`;

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(TOKEN_KEY);
}

export function getAuthToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAuthHeaders(extraHeaders = {}) {
  const token = getAuthToken();
  const { Authorization, authorization, ...rest } = extraHeaders;
  const authHeader = Authorization || authorization || `Bearer ${token}`;
  return {
    ...rest,
    Authorization: authHeader,
  };
}

export async function syncFirebaseUser(firebaseUser) {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    const token = await firebaseUser.getIdToken(true);
    localStorage.setItem(TOKEN_KEY, token);

    const response = await fetch(`${API_BASE}/auth/firebase`, {
      method: "POST",
      headers: getAuthHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to sync authenticated user:", response.status, errorText);
      return null;
    }

    const user = await response.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("auth-changed"));

    return user;
  } catch (error) {
    console.error("Failed to sync authenticated user:", error);
    return null;
  }
}

export function saveRedirectPath(path) {
  if (typeof window === "undefined" || !path) return;
  localStorage.setItem(REDIRECT_KEY, path);
}

export function getRedirectAfterLogin() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REDIRECT_KEY);
}

export function clearRedirectAfterLogin() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REDIRECT_KEY);
}

export function getPostAuthRedirect() {
  const redirectPath = getRedirectAfterLogin();
  if (redirectPath) {
    clearRedirectAfterLogin();
    return redirectPath;
  }
  return "/dashboard";
}

export function useAuth() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const refreshAuth = useCallback(() => {
    setAuthenticated(isAuthenticated());
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    refreshAuth();

    const handleStorage = (event) => {
      if (!event || event.key === TOKEN_KEY) refreshAuth();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-changed", refreshAuth);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-changed", refreshAuth);
    };
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    clearRedirectAfterLogin();
    window.dispatchEvent(new Event("auth-changed"));

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase sign out failed:", error);
    }

    router.push("/");
  }, [router]);

  return { authenticated, checkingAuth, logout, refreshAuth };
}
