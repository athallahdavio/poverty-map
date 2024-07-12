import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronRight, ChevronLast, ChevronLeft, ChevronFirst } from "lucide-react";
import { useState } from "react";

const DataTableComponent = ({ data, columns, filtering }) => {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="">
      <table className="min-w-full bg-white border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="py-2 px-4 border-b bg-gray-100 font-medium cursor-pointer"
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {
                        { asc: "🔼", desc: "🔽" }[
                          header.column.getIsSorted() ?? null
                        ]
                      }
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 text-sm text-gray-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8 flex justify-center gap-4">
        <button
          className="p-2 bg-gray-200 rounded"
          onClick={() => table.setPageIndex(0)}
        >
          <ChevronFirst />
        </button>
        <button
          className="p-2 bg-gray-200 rounded"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          <ChevronLeft />
        </button>
        <button
          className="p-2 bg-gray-200 rounded"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <ChevronRight />
        </button>
        <button
          className="p-2 bg-gray-200 rounded"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        >
          <ChevronLast />
        </button>
      </div>
    </div>
  );
};

export default DataTableComponent;
