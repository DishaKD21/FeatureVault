import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="flex flex-col items-center text-center px-6 py-16 bg-gray-50">
      
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-semibold mb-4">
        Create Smooth and fast feature documentation
      </h1>

      {/* Subtext */}
      <p className="text-gray-600 max-w-2xl mb-6">
        Quickly build structured feature documentation, create system diagrams
        with our built-in design editor, and organize technical details in one
        place. Export ready-to-use documentation instantly.
      </p>

      {/* Button */}
      <Link
        href="/create-doc"
        className="border px-6 py-2 rounded-lg hover:bg-gray-100 mb-10 inline-block"
      >
        Create Documentation
      </Link>

      {/* Placeholder Box */}
      <div className="w-full max-w-3xl h-64 border-2 border-dashed border-green-400 rounded-2xl bg-green-50 flex items-center justify-center">
        <span className="text-green-500">Diagram / Preview Area</span>
      </div>

    </section>
  );
};

export default Hero;