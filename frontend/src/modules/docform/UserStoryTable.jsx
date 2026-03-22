"use client";

import React, { useState } from "react";

const UserStoryTable = () => {
  const [data, setData] = useState([[""]]);
  const [activeCell, setActiveCell] = useState(null);

  const rows = data.length;
  const cols = data[0].length;

  // ➕ Row
  const addRow = (index) => {
    const newRow = Array(cols).fill("");
    const newData = [...data];
    newData.splice(index, 0, newRow);
    setData(newData);
  };

  // ➕ Column
  const addCol = (index) => {
    const newData = data.map((row) => {
      const newRow = [...row];
      newRow.splice(index, 0, "");
      return newRow;
    });
    setData(newData);
  };

  // ❌ Delete Row
  const deleteRow = (index) => {
    if (rows === 1) return;
    setData(data.filter((_, i) => i !== index));
  };

  // ❌ Delete Column
  const deleteCol = (index) => {
    if (cols === 1) return;
    const newData = data.map((row) =>
      row.filter((_, i) => i !== index)
    );
    setData(newData);
  };

  // ✏️ Cell Edit
  const handleChange = (r, c, value) => {
    const newData = [...data];
    newData[r][c] = value;
    setData(newData);
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="relative">

        <table className="border-collapse border">
          <tbody>
            {data.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className="border p-2 relative"
                    onDoubleClick={() => setActiveCell({ r, c })}
                  >
                    <input
                      value={cell}
                      onChange={(e) =>
                        handleChange(r, c, e.target.value)
                      }
                      className="w-24 h-10 text-center outline-none"
                    />

                    {/* 🎯 Controls */}
                    {activeCell?.r === r && activeCell?.c === c && (
                      <>
                        {/* Top */}
                        <button
                          onClick={() => addRow(r)}
                          className="absolute -top-5 left-1/2 -translate-x-1/2"
                        >
                          ➕
                        </button>

                        {/* Bottom */}
                        <button
                          onClick={() => addRow(r + 1)}
                          className="absolute -bottom-5 left-1/2 -translate-x-1/2"
                        >
                          ➕
                        </button>

                        {/* Left */}
                        <button
                          onClick={() => addCol(c)}
                          className="absolute left-[-20px] top-1/2 -translate-y-1/2"
                        >
                          ➕
                        </button>

                        {/* Right */}
                        <button
                          onClick={() => addCol(c + 1)}
                          className="absolute right-[-20px] top-1/2 -translate-y-1/2"
                        >
                          ➕
                        </button>

                        {/* Delete Row */}
                        <button
                          onClick={() => deleteRow(r)}
                          className="absolute -top-5 right-[-20px] text-red-500"
                        >
                          ➖
                        </button>

                        {/* Delete Column */}
                        <button
                          onClick={() => deleteCol(c)}
                          className="absolute -bottom-5 right-[-20px] text-red-500"
                        >
                          ➖
                        </button>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Debug */}
        <pre className="mt-5 text-xs bg-gray-100 p-2">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UserStoryTable;