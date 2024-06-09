import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TUser } from "@/@types/user.type";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowUpDown,
  EllipsisVertical,
  Pencil,
  Trash2,
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
import { formatDate, toFullName } from "@/utils/helper";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import { Input } from "@/components/ui/input";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/router";
import { debounce, identity, omit, pickBy } from "lodash";
import { usePathname } from "next/navigation";
import PaginationCustom from "@/components/PaginationCustom";
import { City } from "@/@types/city.type";
import { getAllCities } from "@/services/city.services";
import EditAddCityDialog from "./components/EditAddCityDialog";
import Swal from "sweetalert2";
import instanceAxios from "@/configs/axiosInstance";
import { CityAPI } from "@/apis/city.api";
import { ResponseData } from "@/@types/message.type";
import { toast } from "react-toastify";
export default function CityPage() {
  const [cities, setCities] = useState<City[] | []>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editCity, setEditCity] = useState<undefined | string>(undefined);
  const [pageSize, setPageSize] = useState<number>(1);
  const [status, setStatus] = useState<number>(1);
  const queryClient = useQueryClient();
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
    queryKey: ["cities", queryConfig],
    queryFn: () => getAllCities(queryConfig),
    onSuccess: (data) => {
      const cities = data?.data.data?.cities || [];
      setCities(cities);
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

  const handleDeleteSingleCity = (id: string) => {
    console.log(id);
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
        await instanceAxios
          .delete<ResponseData<City>>(`${CityAPI.CITY}/${id}`)
          .then(() => {
            queryClient.invalidateQueries(["cities"]);
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          })
          .catch((err: any) => {
            let errMsg = err.response.data.message;
            toast.error(errMsg);
          });
      }
    });
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
      accessorKey: "name",
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
      accessorKey: "createdAt",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            Created Date
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return <div className="">{formatDate(row.original.createdAt)}</div>;
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
                <DropdownMenuItem
                  onSelect={() => {
                    setEditCity(row.original._id);
                    setOpenDialog(true);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  <span>Edit City</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    handleDeleteSingleCity(row.original._id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Delete City</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: cities,
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
      <div className="flex items-center gap-2 justify-end flex-wrap mt-4 mb-2">
        <Input
          placeholder="Search what you need"
          className="max-w-[500px]"
          onChange={onNameChange}
        ></Input>
        <EditAddCityDialog
          setOpenDialog={setOpenDialog}
          open={openDialog}
          idCity={editCity}
          setEditCity={setEditCity}
        ></EditAddCityDialog>
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
CityPage.authGuard = true;
CityPage.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
