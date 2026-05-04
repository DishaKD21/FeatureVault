"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../../../public/logo-dark.png";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../modules/authentication/firebase";
import { isAuthenticated, saveRedirectPath, syncFirebaseUser, useAuth } from "@/components/auth/useAuth";

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
    <nav className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
      <div className="flex cursor-pointer items-center gap-2 text-lg font-semibold">
        <Link href="/">
          <Image src={logo} height={40} width={160} alt="FeatureVault logo" className="h-10 w-auto object-contain" priority />
        </Link>
      </div>

      <div className="flex items-center gap-6 text-gray-700">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <Link href="/#features" className="hover:text-black">
          Features
        </Link>
        <button
          type="button"
          disabled={redirectingTo === "/diagram-editor"}
          onClick={() => goProtected("/diagram-editor")}
          className="hover:text-black disabled:cursor-wait disabled:text-gray-400"
        >
          Diagram Tool
        </button>
      </div>

      <div className="flex items-center gap-4">
        {checkingAuth ? (
          <span className="text-sm text-gray-500">Checking...</span>
        ) : !authenticated ? (
          <>
            <Link href="/login" className="rounded-md px-4 py-1 hover:bg-gray-100">
              Login
            </Link>
            <Link href="/register" className="rounded-md border px-4 py-1 hover:bg-gray-100">
              Signup
            </Link>
          </>
        ) : (
          <>
            {userLabel && <span className="text-sm text-gray-500">{userLabel}</span>}
            <button
              type="button"
              disabled={redirectingTo === "/dashboard"}
              onClick={() => goProtected("/dashboard")}
              className="font-medium text-blue-600 hover:text-black disabled:cursor-wait disabled:text-gray-400"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-500 transition-colors hover:bg-red-50"
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
