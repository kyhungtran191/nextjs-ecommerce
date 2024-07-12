import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
import { formatDate } from "@/utils/helper";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { debounce, identity, omit, pickBy } from "lodash";
import { usePathname } from "next/navigation";
import PaginationCustom from "@/components/PaginationCustom";
import { City } from "@/@types/city.type";
import Swal from "sweetalert2";
import instanceAxios from "@/configs/axiosInstance";
import { ResponseData } from "@/@types/message.type";
import { toast } from "react-toastify";
import EditAddDeliveryDialog from "./components/EditAddDeliveryDialog";
import { TDelivery } from "@/@types/delivery.type";
import { getAllDelivery } from "@/services/delivery.services";
import { DELIVERYAPI } from "@/apis/delivery.api";
import { Button } from "@/components/ui/button";
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

export default function DeliveryPage() {
  const [delivery, setDelivery] = useState<TDelivery[] | []>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editDelivery, setEditDelivery] = useState<undefined | string>(
    undefined
  );
  const [pageSize, setPageSize] = useState<number>(1);
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
    queryKey: ["delivery-type", queryConfig],
    queryFn: () => getAllDelivery(queryConfig),
    onSuccess: (data) => {
      const deliveryTypes = data?.data.data?.deliveryTypes || [];
      console.log(data);
      setDelivery(deliveryTypes);
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
        const deliveryTypeIds = Object.keys(rowSelection);
        await instanceAxios
          .delete<ResponseData<City>>(`${DELIVERYAPI.DELIVERY}/delete-many`, {
            data: {
              deliveryTypeIds,
            },
          })
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            data.refetch();
            setRowSelection([]);
          })
          .catch((err: any) => {
            let errMsg = err.response.data.message;
            toast.error(errMsg);
          });
      }
    });
  };

  const handleDeleteSingleCity = (id: string) => {
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
          .delete<ResponseData<City>>(`${DELIVERYAPI.DELIVERY}/${id}`)
          .then(() => {
            queryClient.invalidateQueries(["delivery-type"]);
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
            Delivery Name
            <ArrowUpDown className="w-4 h-4 ml-2" />
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
                    setEditDelivery(row.original._id);
                    setOpenDialog(true);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  <span>Edit Delivery</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    handleDeleteSingleCity(row.original._id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Delete Delivery</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: delivery,
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
        <EditAddDeliveryDialog
          setOpenDialog={setOpenDialog}
          open={openDialog}
          idDelivery={editDelivery}
          setEditDelivery={setEditDelivery}
        ></EditAddDeliveryDialog>
      </div>
      <Button
        className={`ml-auto my-4 min-w-[100px] ${
          Object.keys(rowSelection).length > 0 ? "block" : "hidden"
        }`}
        onClick={handleDeleteAll}
      >
        Delete
      </Button>
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

DeliveryPage.authGuard = true;
DeliveryPage.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
