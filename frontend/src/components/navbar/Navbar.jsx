"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo-dark.png";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../modules/authentication/firebase";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
      {/* Left - Logo */}
      <div className="flex items-center gap-2 font-semibold text-lg cursor-pointer">
        <Link href="/">
          <Image src={logo} height={40} width={160} alt="FeatureVault logo" className="h-10 w-auto object-contain" priority />
        </Link>
      </div>

      {/* Center - Links */}
      <div className="flex gap-6 text-gray-700 items-center">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <Link href="/#features" className="hover:text-black">
          Features
        </Link>
        <Link href="/diagram-editor" className="hover:text-black">
          Diagram Tool
        </Link>
        {user && (
          <>
            <Link href="/dashboard" className="hover:text-black font-medium text-blue-600">
              Dashboard
            </Link>
            <Link href="/create-doc" className="bg-black text-white px-4 py-1 rounded-md hover:bg-gray-800">
              Create Doc
            </Link>
          </>
        )}
      </div>

      {/* Right - Signup + Profile */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link href="/login" className="px-4 py-1 rounded-md hover:bg-gray-100">
              Login
            </Link>
            <Link
              href="/register"
              className="border px-4 py-1 rounded-md hover:bg-gray-100"
            >
              Signup
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user.displayName || user.email?.split("@")[0]}</span>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg overflow-hidden border">
                {user.photoURL ? <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" /> : "👤"}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
