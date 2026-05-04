"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Pagination } from "@mantine/core";

const ITEMS_PER_PAGE = 6;

export default function DocumentSection({
  docs,
  page,
  setPage,
  downloading,
  onDownload,
  onDelete,
}) {
  const totalPages = Math.max(1, Math.ceil(docs.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, setPage, totalPages]);

  const paginatedDocs = useMemo(
    () => docs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [docs, page],
  );

  const editableDocs = paginatedDocs.filter((doc) => doc.status === "draft");
  const createdDocs = paginatedDocs.filter((doc) => doc.status === "completed");

  const DocCard = ({ doc, showDownload = true }) => {
    const docName = doc.feature?.featureName || "Untitled Document";
    const isEditable = doc.status === "draft";
    const isCompleted = doc.status === "completed";

    return (
      <div
        key={doc._id}
        className={`mb-3 flex items-center justify-between rounded-lg border p-4 shadow ${
          isCompleted
            ? "border-gray-200 bg-gray-50 text-gray-700"
            : "border-transparent bg-white"
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{docName}</p>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {isEditable ? "Draft" : "Completed"} - {new Date(doc.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {showDownload && (
            <div className="group relative">
              <button
                className="flex items-center gap-1 rounded border px-3 py-1 hover:bg-gray-200"
                disabled={downloading === doc._id}
              >
                {downloading === doc._id ? "Downloading..." : "Download"}
              </button>

              <div className="absolute right-0 z-10 mt-1 hidden flex-col rounded border bg-white shadow-md group-hover:flex">
                <button
                  onClick={() => onDownload(doc._id, docName)}
                  className="whitespace-nowrap px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Download as DOCX
                </button>
              </div>
            </div>
          )}

          {isEditable && (
            <Link href={`/create-doc?id=${doc._id}`}>
              <button className="rounded border px-3 py-1 hover:bg-gray-200">
                Edit
              </button>
            </Link>
          )}

          <button
            onClick={() => onDelete(doc._id)}
            className="rounded border px-3 py-1 hover:bg-red-400 hover:text-white"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-medium">Documents</h2>

      {docs.length === 0 ? (
        <p className="text-gray-500">No documents created yet</p>
      ) : (
        <>
      <div className="mb-8">
        <h3 className="mb-3 text-base font-medium">Editable (Drafts)</h3>
        {editableDocs.length === 0 && <p className="text-gray-500">No drafts available.</p>}
        {editableDocs.map((doc) => (
          <DocCard key={doc._id} doc={doc} showDownload />
        ))}
      </div>

      <div>
        <h3 className="mb-3 text-base font-medium">Created by You (Completed)</h3>
        {createdDocs.length === 0 && <p className="text-gray-500">No completed documents.</p>}
        {createdDocs.map((doc) => (
          <DocCard key={doc._id} doc={doc} showDownload />
        ))}
      </div>

      {docs.length > ITEMS_PER_PAGE && (
        <div className="mt-5 flex justify-center">
          <Pagination value={page} onChange={setPage} total={totalPages} />
        </div>
      )}
        </>
      )}
    </section>
  );
}
