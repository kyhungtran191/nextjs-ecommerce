import { useCartStore } from "@/stores/cart.store";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function ProductTable() {
  const { cart } = useCartStore();
  console.log(cart);
  const columns = [
    {
      accessorKey: "product",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer text-center"
          >
            Product
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex items-center gap-2 flex-wrap">
            <Image
              className="w-14 h-14 rounded-sm object-cover"
              width="0"
              height="0"
              alt="product"
              src={row.original.image}
            ></Image>
            <div>{row.original.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            Price
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <div className="text-center font-semibold">{row.original.price}</div>
        );
      },
    },

    {
      accessorKey: "discount",
      header: ({ column }: { column: any }) => {
        return <div className="flex cursor-pointer">Discount(%)</div>;
      },
      cell: ({ row }: { row: any }) => {
        return (
          <div className="text-center font-semibold">
            {row.original.discount}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            Quantity
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <div className="text-center font-semibold">{row.original.amount}</div>
        );
      },
    },
    {
      accessorKey: "total",
      header: ({ column }: { column: any }) => {
        return <div className="text-center">Total</div>;
      },
      cell: ({ row }: { row: any }) => {
        console.log(row.original.amount);
        return (
          <div
            className={`font-semibold max-w-[80px] p-2 rounded-lg text-center`}
          >
            {row.original.amount * row.original.price} $
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: cart,
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table?.getRowModel()?.rows?.length ? (
          table?.getRowModel()?.rows?.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns?.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
