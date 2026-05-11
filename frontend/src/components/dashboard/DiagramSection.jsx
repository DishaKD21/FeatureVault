"use client";

import { useEffect, useMemo } from "react";
import { Pagination } from "@mantine/core";
import DiagramCard from "./DiagramCard";

const ITEMS_PER_PAGE = 6;

export default function DiagramSection({
  diagrams,
  page,
  setPage,
  downloading,
  deleting,
  onDownload,
  onDelete,
}) {
  const totalPages = Math.max(1, Math.ceil(diagrams.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, setPage, totalPages]);

  const paginatedDiagrams = useMemo(
    () => diagrams.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [diagrams, page],
  );

  return (
    <section>
      <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Standalone diagrams</h2>

      {diagrams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/10 px-6 py-14 text-center text-sm text-muted-foreground">
          No standalone diagrams.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedDiagrams.map((diagram) => (
              <DiagramCard
                key={diagram._id}
                diagram={diagram}
                downloading={downloading}
                deleting={deleting}
                onDownload={onDownload}
                onDelete={onDelete}
              />
            ))}
          </div>

          {diagrams.length > ITEMS_PER_PAGE && (
            <div className="mt-6 flex justify-center rounded-xl border border-border bg-card/50 px-4 py-3">
              <Pagination
                value={page}
                onChange={setPage}
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
          )}
        </>
      )}
    </section>
  );
}
