"use client";
import Link from "next/link";
import React, { useState } from "react";
import ThemeLogo from "@/components/branding/ThemeLogo";
import { useRouter } from "next/navigation";
import { isAuthenticated, saveRedirectPath } from "@/components/auth/useAuth";

const Footer = () => {
  const router = useRouter();
  const [redirectingTo, setRedirectingTo] = useState("");

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
    <div className="flex w-full items-center justify-center bg-background py-10">
      <div className="w-[90%] max-w-6xl rounded-2xl border border-border bg-card p-8 shadow-fv-soft">
         
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between text-center md:text-left gap-8">
          
          {/* Left */}
          <div className="flex-1">
           <ThemeLogo className="mb-2" imgClassName="h-9" />
            <p className="text-muted-foreground">
              Create structured feature documentation and system diagrams
              quickly and efficiently.
            </p>
          </div>

          {/* Middle */}
          <div className="flex-1">
            <h3 className="mb-3 inline-block border-b border-border text-lg font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="mt-2 flex flex-col space-y-1 text-muted-foreground">
              <Link href="#features" className="transition hover:text-foreground">
                Features
              </Link>
              <button
                type="button"
                disabled={redirectingTo === "/create-doc"}
                onClick={() => goProtected("/create-doc")}
                className="text-left transition hover:text-foreground disabled:cursor-wait disabled:opacity-50"
              >
                Create Documentation
              </button>
              <button
                type="button"
                disabled={redirectingTo === "/diagram-editor"}
                onClick={() => goProtected("/diagram-editor")}
                className="text-left transition hover:text-foreground disabled:cursor-wait disabled:opacity-50"
              >
                Diagram Tool
              </button>
              <Link href="/feedback" className="transition hover:text-foreground">
                Feedback
              </Link>
            </ul>
          </div>

          {/* Right */}
          <div className="flex-1">
            <h3 className="mb-3 inline-block border-b border-border text-lg font-semibold text-foreground">
              Contact Us
            </h3>
            <p className="text-muted-foreground">+91-908122243091</p>
            <p className="text-muted-foreground">support@featurevault.com</p>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-border pt-4 text-center text-muted-foreground">
          ©2026 FeatureVault. All Rights Reserved.
        </div>

      </div>
    </div>
  );
};
export default Footer;
