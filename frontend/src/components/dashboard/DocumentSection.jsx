"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Pagination } from "@mantine/core";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 6;

function StatusBadge({ status }) {
  const isDraft = status === "draft";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        isDraft
          ? "border border-border bg-muted/60 text-foreground"
          : "border border-primary/25 bg-primary/10 text-primary",
      )}
    >
      {isDraft ? "Draft" : "Completed"}
    </span>
  );
}

function DocumentTable({ title, count, rows, emptyMessage, downloading, onDownload, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-fv-soft">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/25 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground ring-1 ring-border">
            {count}
          </span>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground sm:px-5">{emptyMessage}</p>
      ) : (
        <div className="fv-scrollbar overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/15">
                <th className="px-4 py-3 font-medium text-muted-foreground sm:px-5">Document</th>
                <th className="px-4 py-3 font-medium text-muted-foreground sm:px-5">Status</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell sm:px-5">Created</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground sm:px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((doc) => {
                const docName = doc.feature?.featureName || "Untitled Document";
                const isEditable = doc.status === "draft";
                const created = new Date(doc.createdAt || Date.now()).toLocaleDateString();

                return (
                  <tr
                    key={doc._id}
                    className="border-b border-border/80 transition-colors last:border-0 hover:bg-muted/20"
                  >
                    <td className="max-w-[200px] px-4 py-3 font-medium text-foreground sm:max-w-none sm:px-5">
                      <span className="line-clamp-2">{docName}</span>
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell sm:px-5">{created}</td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg border-border/80"
                          disabled={downloading === doc._id}
                          onClick={() => onDownload(doc._id, docName)}
                        >
                          {downloading === doc._id ? (
                            <>
                              <Loader2 className="mr-1 size-3.5 animate-spin" />
                              …
                            </>
                          ) : (
                            "Download"
                          )}
                        </Button>
                        {isEditable && (
                          <Button variant="outline" size="sm" className="h-8 rounded-lg border-border/80" asChild>
                            <Link href={`/create-doc?id=${doc._id}`}>Edit</Link>
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete(doc._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PaginationStrip({ page, onChange, totalPages }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center rounded-xl border border-border bg-card/50 px-4 py-3">
      <Pagination
        value={page}
        onChange={onChange}
        total={totalPages}
        size="sm"
        color="teal"
        style={{
          "--pagination-active-bg": "var(--primary)",
          "--pagination-active-color": "var(--primary-foreground)",
        }}
        styles={{
          control: {
            borderColor: "var(--border)",
            backgroundColor: "var(--card)",
            color: "var(--foreground)",
          },
        }}
      />
    </div>
  );
}

export default function DocumentSection({
  docs,
  draftPage,
  setDraftPage,
  completedPage,
  setCompletedPage,
  downloading,
  onDownload,
  onDelete,
}) {
  const allDrafts = useMemo(() => docs.filter((d) => d.status === "draft"), [docs]);
  const allCompleted = useMemo(() => docs.filter((d) => d.status === "completed"), [docs]);

  const draftTotalPages = Math.max(1, Math.ceil(allDrafts.length / ITEMS_PER_PAGE));
  const completedTotalPages = Math.max(1, Math.ceil(allCompleted.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (draftPage > draftTotalPages) setDraftPage(draftTotalPages);
  }, [draftPage, draftTotalPages, setDraftPage]);

  useEffect(() => {
    if (completedPage > completedTotalPages) setCompletedPage(completedTotalPages);
  }, [completedPage, completedTotalPages, setCompletedPage]);

  const draftRows = useMemo(
    () => allDrafts.slice((draftPage - 1) * ITEMS_PER_PAGE, draftPage * ITEMS_PER_PAGE),
    [allDrafts, draftPage],
  );

  const completedRows = useMemo(
    () => allCompleted.slice((completedPage - 1) * ITEMS_PER_PAGE, completedPage * ITEMS_PER_PAGE),
    [allCompleted, completedPage],
  );

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Documents</h2>

      {docs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/10 px-6 py-14 text-center">
          <p className="text-sm text-muted-foreground">No documents yet.</p>
          <Button asChild className="mt-4 rounded-xl" variant="secondary">
            <Link href="/create-doc">Create documentation</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-10 space-y-3">
            <DocumentTable
              title="Drafts"
              count={allDrafts.length}
              rows={draftRows}
              emptyMessage={allDrafts.length === 0 ? "No drafts." : "No drafts on this page."}
              downloading={downloading}
              onDownload={onDownload}
              onDelete={onDelete}
            />
            <PaginationStrip page={draftPage} onChange={setDraftPage} totalPages={draftTotalPages} />
          </div>

          <div className="mb-10 space-y-3">
            <DocumentTable
              title="Completed"
              count={allCompleted.length}
              rows={completedRows}
              emptyMessage={allCompleted.length === 0 ? "No completed documents." : "No completed documents on this page."}
              downloading={downloading}
              onDownload={onDownload}
              onDelete={onDelete}
            />
            <PaginationStrip page={completedPage} onChange={setCompletedPage} totalPages={completedTotalPages} />
          </div>
        </>
      )}
    </section>
  );
}
