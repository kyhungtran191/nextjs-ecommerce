import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import { getAllUser } from "@/services/user.services";
import { useQuery } from "@tanstack/react-query";
import React, { ReactNode, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TUser } from "@/@types/user.type";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, EllipsisVertical, Pencil, User } from "lucide-react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toFullName } from "@/utils/helper";
export default function UserPage() {
  const [viewUser, setViewUser] = useState({});
  const [users, setUsers] = useState<TUser[] | []>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const data = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUser(),
    staleTime: 10 * (60 * 1000),
    cacheTime: 15 * (60 * 1000),
    onSuccess: (data) => {
      const userData = data?.data.data?.users || [];
      setUsers(userData);
    },
  });
  const usersData = useMemo(
    () =>
      users
        ? users.map((user) => {
            return {
              ...user,
              role: user.role?.name,
              fullName: toFullName(
                user.lastName,
                user.middleName,
                user.firstName,
                "vi"
              ),
              type: "Default",
            };
          })
        : [],
    [users]
  );

  const handleEditUser = (user: TUser) => {
    // console.log(user);
    // if (profile.roles === Roles.Manager) {
    //   if (user.role !== Roles.Coordinator) {
    //     toast.error("You are not authorized to edit this user");
    //     return;
    //   }
    // }
  };
  const columns = [
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className=""
        />
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fullName",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Full Name
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        );
      },
    },

    {
      accessorKey: "email",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        );
      },
    },

    {
      accessorKey: "role",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone Number
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        );
      },
    },
    {
      accessorKey: "city",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            City
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            Status
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <div className="">
            {row.original.status === 1 ? "Active" : "Inactive"}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User Type
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => {}}>
                  <User className="w-4 h-4 mr-2" />
                  <span>View User</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleEditUser(row.original)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  <span>Edit user</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <UserRoundX className='w-4 h-4 mr-2' />
                  <span>Deactivate user</span>
                </DropdownMenuItem> */}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: usersData,
    columns,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="">
      <div className="grid grid-cols-4 gap-2 items-center">
        <div>1 users</div>
        <div>1 users</div>
        <div>1 users</div>
        <div>1 users</div>
      </div>
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
    </div>
  );
}
UserPage.authGuard = true;
UserPage.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
