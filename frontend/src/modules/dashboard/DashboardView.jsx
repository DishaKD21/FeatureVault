"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllDocuments, deleteDocument, exportDocument } from "@/lib/documentationApi";

const DashboardView = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  const fetchDocs = async () => {
    try {
      const response = await getAllDocuments();
      setDocs(response.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(id);
        fetchDocs();
      } catch (error) {
        alert("Failed to delete document");
      }
    }
  };

  const handleDownload = async (id, name) => {
    setDownloading(id);
    const filename = name || "document";
    try {
      await exportDocument(id, filename);
    } finally {
      setDownloading(null);
    }
  };

  const editableDocs = docs.filter(doc => doc.status === "draft");
  const createdDocs = docs.filter(doc => doc.status === "completed");

  // Reusable card for both draft and completed docs
  const DocCard = ({ doc, showDownload = true }) => {
    const docName = doc.feature?.featureName || "Untitled Document";
    return (
      <div
        key={doc._id}
        className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-3"
      >
        <div>
          <p className="font-medium">{docName}</p>
          <p className="text-xs text-gray-400">
            {doc.status === "draft" ? "Draft" : "Completed"} · {new Date(doc.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {/* Download dropdown */}
          {showDownload && (
            <div className="relative group">
              <button
                className="px-3 py-1 border rounded hover:bg-gray-200 flex items-center gap-1"
                disabled={downloading === doc._id}
              >
                {downloading === doc._id ? "Downloading..." : "Download ▾"}
              </button>

              <div className="absolute hidden group-hover:flex flex-col bg-white border rounded shadow-md right-0 mt-1 z-10">
                <button
                  onClick={() => handleDownload(doc._id, docName)}
                  className="px-4 py-2 hover:bg-gray-100 text-left whitespace-nowrap text-sm"
                >
                  📄 Download as DOCX
                </button>
              </div>
            </div>
          )}

          <Link href={`/create-doc?id=${doc._id}`}>
            <button className="px-3 py-1 border rounded hover:bg-gray-200">
              Edit
            </button>
          </Link>

          <button
            onClick={() => handleDelete(doc._id)}
            className="px-3 py-1 border rounded hover:bg-red-400 hover:text-white"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white shadow-md rounded-xl px-6 py-3 mb-6">
        <h1 className="text-xl font-semibold">FeatureVault</h1>
        <div className="flex gap-6">
          <Link href="/" className="cursor-pointer hover:text-blue-500">Home</Link>
          <Link href="/#features" className="cursor-pointer hover:text-blue-500">Features</Link>
          <Link href="/diagram-editor" className="cursor-pointer hover:text-blue-500">Diagram Tool</Link>
        </div>
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

      {loading ? (
        <div className="text-center py-10">Loading documents...</div>
      ) : (
        <>
          {/* Editable Section */}
          <div className="mb-10">
            <h2 className="mb-3 text-lg font-medium">Editable (Drafts)</h2>
            {editableDocs.length === 0 && <p className="text-gray-500">No drafts available.</p>}
            {editableDocs.map((doc) => (
              <DocCard key={doc._id} doc={doc} showDownload={true} />
            ))}
          </div>

          {/* Created By You Section */}
          <div>
            <h2 className="mb-3 text-lg font-medium">Created by You (Completed)</h2>
            {createdDocs.length === 0 && <p className="text-gray-500">No completed documents.</p>}
            {createdDocs.map((doc) => (
              <DocCard key={doc._id} doc={doc} showDownload={true} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardView;