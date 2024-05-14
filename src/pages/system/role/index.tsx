import { Search } from "@/components/Search";
import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import { LockKeyhole, Plus, Pencil, Trash2 } from "lucide-react";
import React, { ReactNode, useState } from "react";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function RolePage() {
  // Mutation
  const [selectedRole, setSelectedRole] = useState();
  // Fetch
  const columns = [
    {
      id: "name",
      header: () => <p className="">Name</p>,
      cell: ({ row }: { row: any }) => {
        return <p className="">{row.original.name}</p>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "action",
      header: () => <p className="text-center">Action</p>,
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex items-center gap-3 font-base justify-center">
            <LockKeyhole
              className="font-normal cursor-pointer flex-shrink-0"
              width={20}
              height={20}
            ></LockKeyhole>
            <Pencil
              className="font-normal cursor-pointer flex-shrink-0"
              width={20}
              height={20}
            ></Pencil>
            <Trash2
              className="font-normal cursor-pointer flex-shrink-0"
              width={20}
              height={20}
            ></Trash2>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
  const data = [{ name: "Role 1", action: "1" }];

  //   Permission Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* Table Role  */}
      <div>
        <div className="flex items-center gap-2">
          <Search className="flex-shrink-0"></Search>
          {/* Add Role Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-white bg-purple cursor-pointer">
                <Plus></Plus>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center">Add new Role</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Label htmlFor="name">Role Name</Label>
                <Input id="name" className="col-span-3" />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-purple text-white">
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Table className="border mt-5">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Table Permissions */}
      <div></div>
    </div>
  );
}

RolePage.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
