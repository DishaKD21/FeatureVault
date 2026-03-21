"use client";

import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

ModuleRegistry.registerModules([AllCommunityModule]);

const UserStoryTable = () => {
  const [gridApi, setGridApi] = useState(null);
  const [newColumnName, setNewColumnName] = useState("");

  //  Start with 1 column + 1 row
  const [columnDefs, setColumnDefs] = useState([
    { field: "col1", headerName: "Column 1", editable: true },
  ]);

  const [rowData, setRowData] = useState([
    { col1: "" },
  ]);

  const [selectedColumn, setSelectedColumn] = useState(null);

  //  Add Column
  const addColumn = () => {
    if (!newColumnName) return;

    const field = newColumnName;

    setColumnDefs((prev) => [
      ...prev,
      {
        field,
        headerName: field,
        editable: true,
      },
    ]);

    setRowData((prev) =>
      prev.map((row) => ({ ...row, [field]: "" }))
    );

    setNewColumnName("");
  };

  //  Add Row
  const addRow = () => {
    const newRow = {};
    columnDefs.forEach((col) => {
      newRow[col.field] = "";
    });

    setRowData((prev) => [...prev, newRow]);
  };

  //  Delete Selected Column
  const deleteColumn = () => {
    if (!selectedColumn) return;

    setColumnDefs((prev) =>
      prev.filter((col) => col.field !== selectedColumn)
    );

    setRowData((prev) =>
      prev.map((row) => {
        const updated = { ...row };
        delete updated[selectedColumn];
        return updated;
      })
    );

    setSelectedColumn(null);
  };

  //  Delete Selected Row
  const deleteRow = () => {
    const selected = gridApi?.getSelectedRows();

    if (!selected?.length) return;

    setRowData((prev) =>
      prev.filter((row) => !selected.includes(row))
    );
  };

  return (
    <div className="space-y-4">

      {/* Controls */}
      <div className="flex gap-3 flex-wrap items-center">
        <Input
          placeholder="Column name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          className="w-40"
        />

        <Button onClick={addColumn}>+ Column</Button>
        <Button onClick={addRow}>+ Row</Button>

        <Button variant="destructive" onClick={deleteColumn}>
          Delete Column
        </Button>

        <Button variant="destructive" onClick={deleteRow}>
          Delete Row
        </Button>
      </div>

      {/* Grid */}
      <div
        className="ag-theme-alpine border rounded-xl"
        style={{ height: 350, width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="single"
          onGridReady={(params) => setGridApi(params.api)}

          //  Double-click to edit only
          singleClickEdit={false}
          stopEditingWhenCellsLoseFocus={true}

          // Column click selection
          onColumnClicked={(params) => {
            setSelectedColumn(params.column.colId);
          }}

          defaultColDef={{
            editable: true,
            flex: 1,
            resizable: true,
            cellStyle: {
              borderRight: "1px solid #e5e7eb",
              borderBottom: "1px solid #e5e7eb",
            },
          }}
        />
      </div>
    </div>
  );
};

export default UserStoryTable;