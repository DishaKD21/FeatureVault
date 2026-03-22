import React from "react";
import Link from "next/link";

const DashboardView = () => {
  const editableDocs = [
    { id: 1, name: "Feature API Docs" },
    { id: 2, name: "System Design Flow" },
  ];

  const createdDocs = [
    { id: 1, name: "User Auth Module" },
    { id: 2, name: "Payment Integration" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white shadow-md rounded-xl px-6 py-3 mb-6">
        <h1 className="text-xl font-semibold">FeatureVault</h1>
        <div className="flex gap-6">
          <p className="cursor-pointer hover:text-blue-500">Home</p>
          <p className="cursor-pointer hover:text-blue-500">Features</p>
          <p className="cursor-pointer hover:text-blue-500">Diagram Tool</p>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>

      {/* Create Button */}
      <div className="flex justify-center mb-6">
        <Link
          href="/create-doc"
          className="px-6 py-2 border rounded-lg hover:bg-blue-500 hover:text-white transition"
        >
          Create New Documentation
        </Link>
      </div>

      {/* Editable Section */}
      <div className="mb-10">
        <h2 className="mb-3 text-lg font-medium">Editable</h2>

        {editableDocs.map((doc) => (
          <div
            key={doc.id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-3"
          >
            <p>{doc.name}</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-200">
                Edit
              </button>
              <button className="px-3 py-1 border rounded hover:bg-red-400 hover:text-white">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Created By You Section */}
      <div>
        <h2 className="mb-3 text-lg font-medium">Created by You</h2>

        {createdDocs.map((doc) => (
          <div
            key={doc.id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-3"
          >
            <p>{doc.name}</p>

            <div className="flex gap-2 items-center">
              {/* Download dropdown */}
              <div className="relative group">
                <button className="px-3 py-1 border rounded hover:bg-gray-200">
                  Download
                </button>

                <div className="absolute hidden group-hover:flex flex-col bg-white border rounded shadow-md right-0 mt-1">
                  <button className="px-3 py-1 hover:bg-gray-100">
                    as PDF
                  </button>
                  <button className="px-3 py-1 hover:bg-gray-100">
                    as DOC
                  </button>
                </div>
              </div>

              <button className="px-3 py-1 border rounded hover:bg-gray-200">
                Edit
              </button>

              <button className="px-3 py-1 border rounded hover:bg-red-400 hover:text-white">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;