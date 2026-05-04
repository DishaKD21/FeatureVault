"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DocumentSection from "@/components/dashboard/DocumentSection";
import DiagramSection from "@/components/dashboard/DiagramSection";
import { getAllDocuments, deleteDocument, exportDocument } from "@/lib/documentationApi";
import {
  deleteDiagram,
  downloadDiagramPng,
  getAllDiagrams,
} from "@/lib/diagramApi";

const DashboardView = () => {
  const [docs, setDocs] = useState([]);
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingDoc, setDownloadingDoc] = useState(null);
  const [downloadingDiagram, setDownloadingDiagram] = useState(null);
  const [deletingDiagram, setDeletingDiagram] = useState(null);
  const [documentPage, setDocumentPage] = useState(1);
  const [diagramPage, setDiagramPage] = useState(1);

  const standaloneDiagrams = useMemo(
    () => diagrams.filter((diagram) => diagram.documentId === null),
    [diagrams],
  );

  const fetchDashboardData = async () => {
    try {
      const [documentsResponse, diagramsResponse] = await Promise.all([
        getAllDocuments(),
        getAllDiagrams(),
      ]);

      setDocs(documentsResponse.data || []);
      setDiagrams(diagramsResponse.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteDocument = async (id) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(id);
        fetchDashboardData();
      } catch (error) {
        alert("Failed to delete document");
      }
    }
  };

  const handleDownloadDocument = async (id, name) => {
    setDownloadingDoc(id);
    const filename = name || "document";
    try {
      await exportDocument(id, filename);
    } finally {
      setDownloadingDoc(null);
    }
  };

  const handleDownloadDiagram = async (diagram) => {
    setDownloadingDiagram(diagram._id);
    try {
      await downloadDiagramPng(diagram.image, `diagram-${diagram._id}`);
    } catch (error) {
      alert("Failed to download diagram: " + error.message);
    } finally {
      setDownloadingDiagram(null);
    }
  };

  const handleDeleteDiagram = async (id) => {
    if (!confirm("Are you sure you want to delete this diagram?")) return;

    setDeletingDiagram(id);
    try {
      await deleteDiagram(id);
      await fetchDashboardData();
    } catch (error) {
      alert("Failed to delete diagram");
    } finally {
      setDeletingDiagram(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 flex items-center justify-between rounded-xl bg-white px-6 py-3 shadow-md">
        <h1 className="text-xl font-semibold">FeatureVault</h1>
        <div className="flex gap-6">
          <Link href="/" className="cursor-pointer hover:text-blue-500">
            Home
          </Link>
          <Link href="/#features" className="cursor-pointer hover:text-blue-500">
            Features
          </Link>
          <Link href="/diagram-editor" className="cursor-pointer hover:text-blue-500">
            Diagram Tool
          </Link>
        </div>
      </div>

      <div className="mb-6 flex justify-center">
        <Link
          href="/create-doc"
          className="rounded-lg border px-6 py-2 transition hover:bg-blue-500 hover:text-white"
        >
          Create New Documentation
        </Link>
      </div>

      {loading ? (
        <div className="py-10 text-center">Loading dashboard...</div>
      ) : (
        <>
          <DocumentSection
            docs={docs}
            page={documentPage}
            setPage={setDocumentPage}
            downloading={downloadingDoc}
            onDownload={handleDownloadDocument}
            onDelete={handleDeleteDocument}
          />

          <DiagramSection
            diagrams={standaloneDiagrams}
            page={diagramPage}
            setPage={setDiagramPage}
            downloading={downloadingDiagram}
            deleting={deletingDiagram}
            onDownload={handleDownloadDiagram}
            onDelete={handleDeleteDiagram}
          />
        </>
      )}
    </div>
  );
};

export default DashboardView;
