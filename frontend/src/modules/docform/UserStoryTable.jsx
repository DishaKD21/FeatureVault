"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./UserStoryTable.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

export default function EditableTable({ onChange }) {
  const [contextMenu, setContextMenu] = useState(null);
  const [tableSize, setTableSize] = useState({ rows: 0, cols: 0 });
  const [tableCreated, setTableCreated] = useState(false);
  const wrapRef = useRef(null);
  const editor = useEditor({
    editorProps: {
      handleKeyDown(view, event) {
        if (event.key === "Enter") {
          return true;
        }

        if (event.key === "Backspace") {
          const selectedCells =
            wrapRef.current?.querySelectorAll(".selectedCell") ?? [];

          if (selectedCells.length > 0) {
            event.preventDefault();

            const rows = new Set();
            const cols = new Set();

            selectedCells.forEach((c) => {
              const row = c.closest("tr");
              const rowIdx = Array.from(row.parentElement.children).indexOf(row);
              const colIdx = Array.from(row.children).indexOf(c);
              rows.add(rowIdx);
              cols.add(colIdx);
            });

            try {
              if (cols.size === 1) {
                editor?.chain()?.focus()?.deleteColumn()?.run();
              } else if (rows.size === 1) {
                editor?.chain()?.focus()?.deleteRow()?.run();
              } else {
                editor?.chain()?.focus()?.deleteRow()?.run();
              }
            } catch (err) {
              console.error("[UserStoryTable] delete via Backspace failed", err);
            }

            return true;
          }
        }

        return false;
      },
    },
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content:"",
  });

  const getTableSize = () => {
    const table = wrapRef.current?.querySelector("table");
    if (!table) return { rows: 0, cols: 0 };

    const rows = table.querySelectorAll("tr").length;
    const cols = table.querySelector("tr")?.children.length || 0;

    return { rows, cols };
  };
  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const size = getTableSize();
      setTableSize(size);
      setTableCreated(size.rows > 0 && size.cols > 0);
    };

    editor.on("update", update);
    update();

    return () => {
      editor.off("update", update);
    };
  }, [editor]);
  const handleContextMenu = useCallback(
    (e) => {
      if (!editor) return;
      const cell = e.target.closest("td, th");
      if (!cell) return;
      e.preventDefault();

      const selectedCells =
        wrapRef.current?.querySelectorAll(".selectedCell") ?? [];
      let type = null;

      if (selectedCells.length > 0) {
        const rows = new Set();
        const cols = new Set();
        selectedCells.forEach((c) => {
          const row = c.closest("tr");
          const rowIdx = Array.from(row.parentElement.children).indexOf(row);
          const colIdx = Array.from(row.children).indexOf(c);
          rows.add(rowIdx);
          cols.add(colIdx);
        });
        if (cols.size === 1) type = "col";
        else type = "row";
      }

      setContextMenu({ x: e.clientX, y: e.clientY, type });
    },
    [editor],
  );

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const extractTableData = () => {
    const table = wrapRef.current?.querySelector("table");
    if (!table) return [];

    const rows = Array.from(table.querySelectorAll("tr"));

    if (rows.length === 0) return [];

    // HEADER
    const headers = Array.from(rows[0].children).map(
      (cell) => cell.innerText.trim() || `col${Math.random()}`,
    );

    // DATA ROWS
    const dataRows = rows.slice(1);

    return dataRows
      .map((row) => {
        const cells = Array.from(row.children);
        const obj = {};

        cells.forEach((cell, index) => {
          const key = headers[index] || `col${index + 1}`;
          obj[key] = cell.innerText.trim();
        });

        return obj;
      })
      .filter((row) => Object.values(row).some((val) => val !== ""));
  };

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const data = extractTableData();
      onChange?.(data);
      const size = getTableSize();
      setTableSize(size);
      if (size.rows === 0 || size.cols === 0) {
        setTableCreated(false);
      }
    };

    editor.on("update", update);

    return () => {
      editor.off("update", update);
    };
  }, [editor]);
   if (!editor) return null;
  return (
    <div className="nt-root">
      <div className="nt-page">
       {!tableCreated && (
  <button
    className="nt-create-table"
    onClick={() => {
      editor
        ?.chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();

      setTableCreated(true);
    }}
  >
    Create Table
  </button>
)}

        {tableCreated && (
  <div
    className="nt-table-wrap"
    ref={wrapRef}
    onContextMenu={handleContextMenu}
  >
    <div className="nt-editor">
      <EditorContent editor={editor} />
    </div>

    <button
      className="nt-add-row"
      onClick={() => editor.chain().focus().addRowAfter().run()}
    >
      + Row
    </button>

    <button
      className="nt-add-col"
      onClick={() => editor.chain().focus().addColumnAfter().run()}
    >
      + Col
    </button>
  </div>
)}
      </div>
      {contextMenu && (
        <div
          className="nt-ctx-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="nt-ctx-item"
            disabled={tableSize.rows <= 1}
            title={tableSize.rows <= 1 ? "At least 1 row required" : ""}
            onClick={() => {
              if (tableSize.rows <= 1) return;
              editor.chain().focus().deleteRow().run();
              setContextMenu(null);
            }}
          >
            Delete row
          </button>
          <div className="nt-ctx-sep" />

          <button
            className="nt-ctx-item"
            disabled={tableSize.cols <= 1}
            title={tableSize.cols <= 1 ? "At least 1 column required" : ""}
            onClick={() => {
              if (tableSize.cols <= 1) return;
              editor.chain().focus().deleteColumn().run();
              setContextMenu(null);
            }}
          >
            Delete column
          </button>
        </div>
      )}
    </div>
  );
}
