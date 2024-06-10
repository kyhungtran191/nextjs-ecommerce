import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import { getAllUser } from "@/services/user.services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";
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
import { debounce, identity, omit, pickBy } from "lodash";
import { usePathname } from "next/navigation";
import PaginationCustom from "@/components/PaginationCustom";
import FilterRole from "./components/FilterRole";
import FilterUserType from "./components/FilterUserType";
import { useQueryCities } from "@/query/useQueryCity";
import FilterCity from "./components/FilterCity";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import instanceAxios from "@/configs/axiosInstance";
import { ResponseData } from "@/@types/message.type";
import { TUser } from "@/@types/user.type";
import { UserAPI } from "@/apis/user.api";
import { toast } from "react-toastify";
type TTableData = {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
  avatar?: string;
  city?: string;
  status?: number;
  userType?: number;
  addresses?: any[];
};

export default function UserPage() {
  const [users, setUsers] = useState<TTableData[] | []>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [roleOptions, setRoleOptions] = useState<OptionType[] | []>([]);
  const [cityOptions, setCityOptions] = useState<OptionType[] | []>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<undefined | string>(undefined);
  const [pageSize, setPageSize] = useState<number>(1);

  const router = useRouter();
  const pathname = usePathname();
  const params = { ...router.query };

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
      setUsers(
        userData
          ? userData.map((user) => {
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
          : []
      );
      setPageSize(Number(data?.data.data?.totalPage));
    },
  });

  // Search
  const onNameChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = event.target.value;
      if (searchValue) {
        router.replace({
          query: { ...queryConfig, search: searchValue, page: 1 },
        });
      } else {
        router.replace({
          query: omit(queryConfig, ["search"]),
        });
      }
    },
    300
  );
  const roleData = useQueryRole();
  const cityData = useQueryCities();
  // Optimize Role
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

  useEffect(() => {
    if (!cityData.data) return;
    const { cities } = cityData.data.data.data || {};
    if (cities) {
      setCityOptions(
        cities.map((city) => ({
          label: city.name,
          value: city._id,
        }))
      );
    }
  }, [cityData.data]);

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
  const queryClient = useQueryClient();
  const table = useReactTable({
    data: users,
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
  // Delete All Handler
  const handleDeleteAll = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let userIds = Object.keys(rowSelection);
        console.log(JSON.stringify(userIds));
        await instanceAxios
          .post<ResponseData<TUser>>(`${UserAPI.USER}/delete-many`, {
            userIds: userIds,
          })
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            data.refetch();
          })
          .catch((err: any) => {
            let errMsg = err.response.data.message;
            toast.error(errMsg);
          });
      }
    });
  };
  const rowSelectLength = Object.keys(rowSelection).length;
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
          refetch={data.refetch}
          idUser={editUser}
          setEditUser={setEditUser}
        ></EditAddUserDialog>
      </div>

      <div className="my-4 grid grid-cols-12 gap-2 items-center">
        <FilterRole
          queryConfig={queryConfig}
          roleOptions={roleOptions}
        ></FilterRole>
        <FilterUserType queryConfig={queryConfig}></FilterUserType>
        <FilterCity
          queryConfig={queryConfig}
          cityOptions={cityOptions}
        ></FilterCity>
        <Button
          className={`col-span-3 ${rowSelectLength > 0 ? "block" : "hidden"}`}
          onClick={handleDeleteAll}
        >
          Delete
        </Button>
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
