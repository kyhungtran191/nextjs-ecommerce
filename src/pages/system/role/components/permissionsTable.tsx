import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LIST_DATA_PERMISSIONS } from "@/configs/permission";
import { Checkbox } from "@/components/ui/checkbox";

type TProps = {
  permissions: string[];
  setPermissions: () => void;
};

export default function PermissionTable({
  permissions,
  setPermissions,
}: TProps) {
  const columns = [
    {
      id: "all",
      header: () => <div className="flex items-center gap-2">All</div>,
      cell: ({ row }: { row: any }) => {
        return (
          !row.original.isHideAll && (
            <Checkbox value={row.original.value}></Checkbox>
          )
        );
      },
      enableSorting: false,
      enableHiding: false,
      minSize: 50,
      maxSize: 50,
    },
    {
      id: "name",
      header: () => <p className="">Name</p>,
      cell: ({ row }: { row: any }) => {
        return (
          <p
            className={`${
              row.original.isParent ? "text-purple" : ""
            } font-semibold ${!row.original.isParent ? "pl-10" : ""}`}
          >
            {row.original.name}
          </p>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "view",
      header: () => <p>View</p>,
      cell: ({ row }: { row: any }) => {
        return (
          !(row.original.isHideView || row.original.isParent) && (
            <Checkbox
              value={row.original.value}
              className="text-center"
            ></Checkbox>
          )
        );
      },
      enableSorting: false,
      enableHiding: false,
      minSize: 50,
      maxSize: 50,
    },
    {
      id: "create",
      header: () => <p>Create</p>,
      cell: ({ row }: { row: any }) => {
        return (
          !(row.original.isHideCreate || row.original.isParent) && (
            <Checkbox value={row.original.value}></Checkbox>
          )
        );
      },
      enableSorting: false,
      enableHiding: false,
      minSize: 50,
      maxSize: 50,
    },
    {
      id: "edit",
      header: () => <p>Edit</p>,
      cell: ({ row }: { row: any }) => {
        return (
          !(row.original.isHideUpdate || row.original.isParent) && (
            <Checkbox value={row.original.value}></Checkbox>
          )
        );
      },
      enableSorting: false,
      enableHiding: false,
      minSize: 50,
      maxSize: 50,
    },
    {
      id: "delete",
      header: () => <p>Delete</p>,
      cell: ({ row }: { row: any }) => {
        return (
          !(row.original.isHideDelete || row.original.isParent) && (
            <Checkbox value={row.original.value}></Checkbox>
          )
        );
      },
      enableSorting: false,
      enableHiding: false,
      minSize: 50,
      maxSize: 50,
    },
  ];
  const permissionTable = useReactTable({
    data: LIST_DATA_PERMISSIONS,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="h-[700px] overflow-y-auto p-4">
      <Table className="border">
        <TableHeader>
          {permissionTable.getHeaderGroups().map((headerGroup) => (
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
          {permissionTable?.getRowModel()?.rows?.length ? (
            permissionTable?.getRowModel()?.rows?.map((row) => (
              <TableRow
                key={row.id}
                // data-state={row.getIsSelected() && "selected"}
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
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
