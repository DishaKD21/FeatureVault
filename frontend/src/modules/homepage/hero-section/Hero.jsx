"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, saveRedirectPath } from "@/components/auth/useAuth";

const Hero = () => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const handleCreateDocumentation = () => {
    setRedirecting(true);

    if (!isAuthenticated()) {
      saveRedirectPath("/create-doc");
      router.push("/login");
      return;
    }

    router.push("/create-doc");
  };

  return (
    <section className="flex flex-col items-center bg-gray-50 px-6 py-16 text-center">
      <h1 className="mb-4 text-3xl font-semibold md:text-4xl">
        Create Smooth and fast feature documentation
      </h1>

      <p className="mb-6 max-w-2xl text-gray-600">
        Quickly build structured feature documentation, create system diagrams
        with our built-in design editor, and organize technical details in one
        place. Export ready-to-use documentation instantly.
      </p>

      <button
        type="button"
        disabled={redirecting}
        onClick={handleCreateDocumentation}
        className="mb-10 inline-block rounded-lg border px-6 py-2 hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60"
      >
        {redirecting ? "Redirecting..." : "Create Documentation"}
      </button>

      <div className="flex h-64 w-full max-w-3xl items-center justify-center rounded-2xl border-2 border-dashed border-green-400 bg-green-50">
        <span className="text-green-500">Diagram / Preview Area</span>
      </div>
    </section>
  );
};

export default Hero;
