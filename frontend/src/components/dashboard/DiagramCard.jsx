"use client";

import Link from "next/link";
import API_URL from "@/config";

const imageUrlFor = (imagePath) => {
  if (!imagePath) return null;
  return imagePath.startsWith("http")
    ? imagePath
    : `${API_URL}/${imagePath.replace(/\\/g, "/")}`;
};

export default function DiagramCard({ diagram, downloading, deleting, onDownload, onDelete }) {
  const imageUrl = imageUrlFor(diagram.image);
  const createdAt = new Date(diagram.createdAt || Date.now()).toLocaleString();
  const title = `Diagram ${diagram._id?.slice(-6) || ""}`.trim();

  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex aspect-video items-center justify-center border-b border-gray-100 bg-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} preview`}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-sm text-gray-400">No preview available</span>
        )}
      </div>

      <div className="p-4">
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">Created at {createdAt}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/diagram-editor?diagramId=${diagram._id}`}>
            <button className="rounded border px-3 py-1 text-sm hover:bg-gray-100">
              Edit
            </button>
          </Link>
          <button
            onClick={() => onDownload(diagram)}
            disabled={downloading === diagram._id || !diagram.image}
            className="rounded border px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {downloading === diagram._id ? "Downloading..." : "Download PNG"}
          </button>
          <button
            onClick={() => onDelete(diagram._id)}
            disabled={deleting === diagram._id}
            className="rounded border px-3 py-1 text-sm hover:bg-red-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting === diagram._id ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
