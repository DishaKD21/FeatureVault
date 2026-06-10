"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import DocumentSection from "@/components/dashboard/DocumentSection";
import DiagramSection from "@/components/dashboard/DiagramSection";
import { Button } from "@/components/ui/button";
import { getAllDocuments, deleteDocument, exportDocument } from "@/lib/documentationApi";
import { deleteDiagram, downloadDiagramPng, getAllDiagrams } from "@/lib/diagramApi";

const DashboardView = () => {
  const [docs, setDocs] = useState([]);
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingDoc, setDownloadingDoc] = useState(null);
  const [downloadingDiagram, setDownloadingDiagram] = useState(null);
  const [deletingDiagram, setDeletingDiagram] = useState(null);
  const [draftPage, setDraftPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
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
    console.log("[DEBUG] handleDownloadDiagram click handler firing. Diagram:", diagram);
    setDownloadingDiagram(diagram._id);
    try {
      console.log("[DEBUG] Calling downloadDiagramPng() now...");
      await downloadDiagramPng(diagram.image, `diagram-${diagram._id}`);
      console.log("[DEBUG] downloadDiagramPng() call returned successfully.");
    } catch (error) {
      console.error("[DEBUG] Caught error in handleDownloadDiagram:", error);
      alert("Failed to download diagram: " + error.message);
    } finally {
      console.log("[DEBUG] handleDownloadDiagram complete. Resetting downloading state.");
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
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <header className="mb-8 flex flex-col gap-4 border-b border-border/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Dashboard</h1>
          </div>
          <Button asChild size="lg" className="h-11 shrink-0 rounded-xl shadow-fv-soft">
            <Link href="/create-doc" className="inline-flex items-center gap-2">
              <Plus className="size-4" />
              New documentation
            </Link>
          </Button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-20 shadow-fv-soft">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading dashboard…</p>
          </div>
        ) : (
          <>
            <DocumentSection
              docs={docs}
              draftPage={draftPage}
              setDraftPage={setDraftPage}
              completedPage={completedPage}
              setCompletedPage={setCompletedPage}
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
    </div>
  );
};

export default DashboardView;
