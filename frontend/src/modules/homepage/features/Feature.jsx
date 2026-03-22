import React from "react";

const Feature = () => {
  return (
    <section id="features" className="px-6 py-16 bg-white text-center">
      
      {/* Title */}
      <h2 className="text-3xl font-semibold mb-12">
        What You Can Do Here
      </h2>

      {/* Feature 1 */}
      <div className="flex flex-col md:flex-row items-center justify-around gap-8 mb-12">
        <div className="text-left max-w-md">
          <h3 className="font-semibold text-lg mb-2">
            Create Structured Documentation
          </h3>
          <p className="text-gray-600">
            Quickly generate structured feature documentation by filling simple
            details like feature name, description, inputs, outputs, and workflow.
          </p>
        </div>

        <div className="w-full md:w-80 h-40 border-2 border-dashed rounded-xl bg-blue-50 flex items-center justify-center">
          Box
        </div>
      </div>

      {/* Feature 2 */}
      <div className="flex flex-col md:flex-row items-center justify-around gap-8 mb-12">
        
        <div className="w-full md:w-80 h-40 border-2 border-dashed rounded-xl bg-blue-50 flex items-center justify-center">
          Box
        </div>

        <div className="text-left max-w-md">
          <h3 className="font-semibold text-lg mb-2">
            Create Design Diagrams
          </h3>
          <p className="text-gray-600">
            Use the built-in diagram editor to design system workflows and feature
            flows. Drag and connect elements easily.
          </p>
        </div>
      </div>

      {/* Feature 3 */}
      <div className="flex flex-col md:flex-row items-center justify-around gap-8 mb-12">
        <div className="text-left max-w-md">
          <h3 className="font-semibold text-lg mb-2">
            Export & Share Documentation
          </h3>
          <p className="text-gray-600">
            Export your documentation as PDF or DOC files and share it with your
            team or stakeholders instantly.
          </p>
        </div>

        <div className="w-full md:w-80 h-40 border-2 border-dashed rounded-xl bg-blue-50 flex items-center justify-center">
          Box
        </div>
      </div>

      {/* Bottom Text */}
      <h2 className="text-2xl font-semibold mt-16 mb-4">
        Build Better Feature Documentation
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        FeatureVault helps developers create structured documentation and system
        diagrams in a simple and organized way.
      </p>

    </section>
  );
};

export default Feature;