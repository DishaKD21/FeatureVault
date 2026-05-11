"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import API_URL from "@/config";
import { Button } from "@/components/ui/button";

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
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-fv-soft transition hover:border-primary/20 hover:shadow-fv-panel">
      <div className="flex aspect-video items-center justify-center border-b border-border bg-muted/20">
        {imageUrl ? (
          <img src={imageUrl} alt={`${title} preview`} className="h-full w-full object-contain" />
        ) : (
          <span className="text-sm text-muted-foreground">No preview available</span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{createdAt}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-8 rounded-lg border-border/80" asChild>
            <Link href={`/diagram-editor?diagramId=${diagram._id}`}>Edit</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-border/80"
            disabled={downloading === diagram._id || !diagram.image}
            onClick={() => onDownload(diagram)}
          >
            {downloading === diagram._id ? (
              <>
                <Loader2 className="mr-1 size-3.5 animate-spin" />
                …
              </>
            ) : (
              "Download PNG"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10"
            disabled={deleting === diagram._id}
            onClick={() => onDelete(diagram._id)}
          >
            {deleting === diagram._id ? (
              <>
                <Loader2 className="mr-1 size-3.5 animate-spin" />
                …
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
