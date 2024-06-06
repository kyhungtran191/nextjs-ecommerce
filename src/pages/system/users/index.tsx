import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import { getAllUser, getDetailUser } from "@/services/user.services";
import { useQuery } from "@tanstack/react-query";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import {
  ArrowUpDown,
  EllipsisVertical,
  Pencil,
  User,
  UsersRound,
} from "lucide-react";
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
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import { Input } from "@/components/ui/input";
import {
  MultiSelect,
  OptionType,
  SelectedType,
} from "@/components/MultiSelect";
import { useQueryRole } from "@/query/useQueryRole";

import { Icon } from "@iconify/react/dist/iconify.js";
import EditAddUserDialog from "./components/EditAddUserDialog";
import { useRouter } from "next/router";
import { debounce, identity, isUndefined, omit, omitBy, pickBy } from "lodash";
import { usePathname } from "next/navigation";
import PaginationCustom from "@/components/PaginationCustom";
export default function UserPage() {
  const [users, setUsers] = useState<TUser[] | []>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [roleSelected, setRoleSelected] = useState<SelectedType[] | []>([]);
  const [roleOptions, setRoleOptions] = useState<OptionType[] | []>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<undefined | string>(undefined);
  const [pageSize, setPageSize] = useState<number>(1);
  const [status, setStatus] = useState<number>(1);

  const router = useRouter();
  const pathname = usePathname();
  const params = { ...router.query };
  // queryConfigRoute
  const queryConfig = pickBy(
    {
      limit: params.limit || 8,
      page: params.page || 1,
      search: params.search,
      roleId: params.roleId,
      status: params.status,
    },
    identity
  );

  const data = useQuery({
    queryKey: ["users", queryConfig],
    queryFn: () => getAllUser(queryConfig),
    onSuccess: (data) => {
      const userData = data?.data.data?.users || [];
      setUsers(userData);
      setPageSize(Number(data?.data.data?.totalPage));
    },
  });

  useEffect(() => {
    const parseMultiValue = roleSelected.map((item) => item.value).join("|");
    if (roleSelected.length > 0) {
      router.replace({
        query: { ...queryConfig, roleId: parseMultiValue, page: 1 },
      });
    } else {
      router.replace({
        query: omit(queryConfig, ["roleId"]),
      });
    }
  }, [roleSelected]);

  const roleData = useQueryRole();
  // Search
  const onNameChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = event.target.value;
      if (searchValue) {
        router.replace({
          query: { ...queryConfig, search: searchValue },
        });
      } else {
        router.replace({
          query: omit(queryConfig, ["search"]),
        });
      }
    },
    300
  );

  useEffect(() => {
    if (!roleData.data) return;
    const { roles } = roleData.data.data.data || {};
    if (roles) {
      setRoleOptions(
        roles.map((role) => ({
          label: role.name,
          value: role._id,
        }))
      );
    }
  }, [roleData.data]);

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
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            Full Name
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            Email
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
    },

    {
      accessorKey: "role",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            Role
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            Phone Number
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
    },
    {
      accessorKey: "city",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            City
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
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
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            User Type
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
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
                <DropdownMenuItem
                  onSelect={() => {
                    setEditUser(row.original._id);
                    setOpenDialog(true);
                  }}
                >
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
    getRowId: (row) => row._id,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="">
      <div className="grid grid-cols-4 gap-3 items-center">
        <div className="p-4  h-[150px] rounded-lg text-black flex items-center justify-center gap-2 border shadow-md">
          <span className="text-lg">123</span>
          <UsersRound></UsersRound>
        </div>
        <div className="p-4  h-[150px] rounded-lg text-black flex items-center justify-center gap-2 border shadow-md">
          <span className="text-lg">123</span>
          <Icon icon="logos:facebook" width={24} height={24} />
        </div>
        <div className="p-4  h-[150px] rounded-lg text-black flex items-center justify-center gap-2 border shadow-md">
          <span className="text-lg">123</span>
          <Icon icon="devicon:google" width={24} height={24} />
        </div>
        <div className="p-4  h-[150px] rounded-lg text-black flex items-center justify-center gap-2 border shadow-md">
          <span className="text-lg">123</span>
          <Icon icon="logos:google-gmail" />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end flex-wrap mt-4 mb-2">
        <Input
          placeholder="Search what you need"
          className="max-w-[500px]"
          onChange={onNameChange}
        ></Input>
        <EditAddUserDialog
          setOpenDialog={setOpenDialog}
          open={openDialog}
          roles={roleOptions}
          idUser={editUser}
          setEditUser={setEditUser}
        ></EditAddUserDialog>
      </div>

      <div className="my-4 grid grid-cols-12 gap-2 items-center">
        <MultiSelect
          options={roleOptions}
          onChange={setRoleSelected}
          selected={roleSelected}
          name="Role"
          classNameWrapper="col-span-3"
        ></MultiSelect>
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
                {data.isLoading ? (
                  <ComponentsLoading></ComponentsLoading>
                ) : (
                  "No results. "
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PaginationCustom
      className="mt-3"
        pathname={pathname}
        queryConfig={queryConfig}
        totalPage={pageSize}
      ></PaginationCustom>
    </div>
  );
}
UserPage.authGuard = true;
UserPage.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
