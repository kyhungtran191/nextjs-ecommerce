import { TItemOrderProductMe, TItemProductMe } from "@/@types/order.type";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import PaginationCustom from "@/components/PaginationCustom";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ORDER_STATUS } from "@/constants/order";
import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import FilterOrderStatus from "@/pages/me/orders/components/FilterOrderStatus";
import { getAllOrders, updateStatusOrders } from "@/services/order.services";
import { Icon } from "@iconify/react/dist/iconify.js";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cloneDeep, debounce, identity, omit, pickBy } from "lodash";
import {
  ArrowUpDown,
  DoorClosedIcon,
  EllipsisVertical,
  Pencil,
  User,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function OrderPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<TItemOrderProductMe[] | []>([]);
  const params = { ...router.query };
  const queryConfig = pickBy(
    {
      limit: params.limit || 8,
      page: params.page || 1,
      search: params.search,
      status: params.status,
    },
    identity
  );

  const queryClient = new QueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders-admin", queryConfig],
    queryFn: () => getAllOrders(queryConfig),
  });

  useEffect(() => {
    if (data?.data?.data) {
      setOrders(data?.data?.data?.orders);
    }
  }, [data]);

  const { mutate: update } = useMutation({
    mutationFn: (data: { id: string; body: { status: number } }) =>
      updateStatusOrders(data?.id, data?.body),
  });

  const handleChangeStatus = (id: string, value: number) => {
    update(
      { id, body: { status: value } },
      {
        onSuccess: (data) => {
          const responseData = data?.data?.data;
          let newArr = cloneDeep(orders);
          newArr = newArr.map((item) => {
            if (item._id === responseData?._id) {
              return { ...responseData };
            }
            return item;
          });
          setOrders(newArr);
          toast.success(`update status order-${id} successfully!`);
        },
      }
    );
  };

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

  const columns = [
    {
      accessorKey: "Products",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            Products
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex items-center gap-1 flex-wrap">
            {row.original.orderItems.map((item: TItemProductMe) => (
              <Image
                key={item?.name}
                src={item?.image}
                alt={item?.name}
                width={0}
                height={0}
                className="w-[60px] h-[60px] rounded-lg shrink-0 object-cover"
              ></Image>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "Shipping Information",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            Shipping Information
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <div className="text-sm text-slate-600 font-medium max-w-[200px]">
            {(row.original as TItemOrderProductMe)?.shippingAddress?.fullName} -{" "}
            {(row.original as TItemOrderProductMe)?.shippingAddress?.phone} -{" "}
            {(row.original as TItemOrderProductMe)?.shippingAddress?.address} -{" "}
            {""}
            {(row.original as TItemOrderProductMe)?.shippingAddress?.city?.name}
          </div>
        );
      },
    },

    {
      accessorKey: "Total Price",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer justify-center"
          >
            Total Price
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <div className="text-sm text-slate-600 font-medium max-w-[200px] text-center">
            {(row.original as TItemOrderProductMe)?.totalPrice}$
          </div>
        );
      },
    },

    {
      accessorKey: "Status",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer justify-center"
          >
            Status
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return (
          <div
            className={`${
              row?.original?.status === 3
                ? "text-red-500 bg-red-400/50"
                : "text-purple bg-purple/50"
            } font-bold rounded-lg text-center py-3 px-2 max-w-[200px] mx-auto`}
          >
            {ORDER_STATUS[row?.original?.status]?.label}
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
            <DropdownMenuContent className="w-56 font-semibold">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => handleChangeStatus(row.original._id, 3)}
                  disabled={row.original.status > 1}
                  className="cursor-pointer"
                >
                  <DoorClosedIcon className="w-4 h-4 mr-2" />
                  <span>Cancel Order</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleChangeStatus(row.original._id, 0)}
                  className="cursor-pointer"
                  disabled={row.original.status === 3}
                >
                  <Pencil className="w-4 h-4 mr-2 " />
                  <span>Change to Wait For Payment</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleChangeStatus(row.original._id, 1)}
                  className="cursor-pointer"
                  disabled={row.original.status === 3}
                >
                  <Pencil className="w-4 h-4 mr-2 cursor-pointer" />
                  <span>Change to wait for delivery</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleChangeStatus(row.original._id, 2)}
                  className="cursor-pointer"
                  disabled={row.original.status === 3}
                >
                  <Pencil className="w-4 h-4 mr-2 cursor-pointer" />
                  <span>Change to Done</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row._id,
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
      </div>

      <div className="my-4 grid grid-cols-12 gap-2 items-center">
        {/* Filter here */}
        <FilterOrderStatus queryConfig={queryConfig}></FilterOrderStatus>
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
                {isLoading ? (
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
        pathname={router.pathname}
        queryConfig={queryConfig}
        totalPage={data?.data?.data?.totalPage as number}
      ></PaginationCustom>
    </div>
  );
}
OrderPage.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);

OrderPage.authGuard = true;
