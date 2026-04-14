import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo-dark.png";
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
      {/* Left - Logo */}
      <div className="flex items-center gap-2 font-semibold text-lg">
        <Image src={logo} height={50} width={50} alt="FeatureVault logo"/>
      </div>

      {/* Center - Links */}
      <div className="flex gap-6 text-gray-700">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <Link href="#features" className="hover:text-black">
          Features
        </Link>
        <Link href="/diagram-editor" className="hover:text-black">
          Diagram Tool
        </Link>
      </div>

      {/* Right - Signup + Profile */}
      <div className="flex items-center gap-4">
        <Link
          href="/register"
          className="border px-4 py-1 rounded-md hover:bg-gray-100"
        >
          Signup
        </Link>

        {/* <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          👤
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
