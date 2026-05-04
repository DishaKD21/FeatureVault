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
      <h2 className="mb-3 text-lg font-medium">Your Diagrams</h2>

      {diagrams.length === 0 ? (
        <p className="text-gray-500">No standalone diagrams available</p>
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
            <div className="mt-5 flex justify-center">
              <Pagination value={page} onChange={setPage} total={totalPages} />
            </div>
          )}
        </>
      )}
    </section>
  );
}
