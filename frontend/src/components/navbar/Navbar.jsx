import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
      
      {/* Left - Logo */}
      <div className="flex items-center gap-2 font-semibold text-lg">
        <span>📦</span>
        <span>FeatureVault</span>
      </div>

      {/* Center - Links */}
      <div className="flex gap-6 text-gray-700">
        <a href="#" className="hover:text-black">Home</a>
        <a href="#" className="hover:text-black">Features</a>
        <a href="#" className="hover:text-black">Diagram Tool</a>
      </div>

      {/* Right - Signup + Profile */}
      <div className="flex items-center gap-4">
        <button className="border px-4 py-1 rounded-md hover:bg-gray-100">
          Signup
        </button>

        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          👤
        </div>
      </div>

    </nav>
  );
};

export default Navbar;