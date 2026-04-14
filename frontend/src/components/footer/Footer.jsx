"use client";
import  Link  from "next/link";
import React from "react";
import logo from "../../../public/logo-dark.png"
import Image from "next/image";
const Footer = () => {
  return (
    <div className="w-full flex justify-center items-center bg-white py-10">
      <div className="w-[90%] max-w-6xl border border-black rounded-2xl p-8">
         
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between text-center md:text-left gap-8">
          
          {/* Left */}
          <div className="flex-1">
           <Image src={logo} alt="FeatureVault logo" width={150} height={40} className="h-auto w-auto" />
            <p className="text-gray-700">
              Create structured feature documentation and system diagrams
              quickly and efficiently.
            </p>
          </div>

          {/* Middle */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3 border-b border-black inline-block">
              Quick Links
            </h3>
            <ul className="mt-2 space-y-1 text-gray-700 flex flex-col">
              <Link href="#features">Features</Link >
              <Link href="/create-doc">Create Documentation</Link >
              <Link href="/diagram-editor">Diagram Tool</Link >
              <Link href="/feedback">Feedback</Link >
            </ul>
          </div>

          {/* Right */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3 border-b border-black inline-block">
              Contact Us
            </h3>
            <p className="text-gray-700">+91-908122243091</p>
            <p className="text-gray-700">support@featurevault.com</p>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-black mt-8 pt-4 text-center text-gray-700">
          ©2026 FeatureVault. All Rights Reserved.
        </div>

      </div>
    </div>
  );
};
export default Footer;