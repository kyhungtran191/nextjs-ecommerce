import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
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
import { formatDate } from "@/utils/helper";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import { Input } from "@/components/ui/input";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/router";
import { debounce, identity, omit, pickBy } from "lodash";
import { usePathname } from "next/navigation";
import PaginationCustom from "@/components/PaginationCustom";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import instanceAxios from "@/configs/axiosInstance";
import { ResponseData } from "@/@types/message.type";
import { TUser } from "@/@types/user.type";
import { toast } from "react-toastify";

import { TProductAdmin } from "@/@types/product.type";
import { getAllProductAdmin } from "@/services/product.services";
import { ProductAPI } from "@/apis/product.api";
import EditAddProductDialog from "./components/CreateEditProduct";
import Image from "next/image";
import ProductDefaultImage from "../../../../public/default_product.jpg";
import FilterProductType from "./components/FilterProductType";
import FilterProductStatus from "./components/FilterProductStatus";

export default function ProductPage() {
  const [products, setProducts] = useState<TProductAdmin[] | []>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<undefined | string>(undefined);
  const [pageSize, setPageSize] = useState<number>(1);

  const router = useRouter();
  const pathname = usePathname();
  const params = { ...router.query };

  const queryConfig = pickBy(
    {
      limit: params.limit || 8,
      page: params.page || 1,
      search: params.search,
      status: params.status,
      productType: params.productType,
    },
    identity
  );

  const data = useQuery({
    queryKey: ["products_admin", queryConfig],
    queryFn: () => getAllProductAdmin(queryConfig),
    onSuccess: (data) => {
      const productsData = data?.data.data?.products || [];
      setProducts(productsData ? productsData : []);
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
            className="flex cursor-pointer text-center"
          >
            Product Name
            <ArrowUpDown className="w-4 h-4 ml-2" />
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
              src={row.original.image || ProductDefaultImage}
            ></Image>
            <div>{row.original.name}</div>
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
            Product Type
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return <div className="">{row.original.type.name}</div>;
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
      cell: ({ row }: { row: any }) => {
        return <div className="">${row.original.price}</div>;
      },
    },
    {
      accessorKey: "countInStock",
      header: ({ column }: { column: any }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex cursor-pointer"
          >
            Quantity
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return <div className=" ">{row.original.countInStock}</div>;
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
            Created At
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        return <div className=" ">{formatDate(row.original.createdAt)}</div>;
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
          <div
            className={`${
              row.original.status == 1
                ? "bg-green-300/40 text-green-500"
                : "bg-red-300/40 text-red-500"
            } font-semibold max-w-[80px] p-2 rounded-lg text-center`}
          >
            {row.original.status === 1 ? "Public" : "Private"}
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
                <DropdownMenuItem
                  onSelect={() => {
                    handleDeleteSingleProduct(row.original._id);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  <span>Delete Product</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setEditProduct(row.original._id);
                    setOpenDialog(true);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  <span>Edit Product</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products,
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
        let productIds = Object.keys(rowSelection);
        await instanceAxios
          .delete<ResponseData<TUser>>(`${ProductAPI.ADMIN}/delete-many`, {
            data: {
              productIds,
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

  const handleDeleteSingleProduct = (id: string) => {
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
          .delete<ResponseData<TProductAdmin>>(`${ProductAPI.ADMIN}/${id}`)
          .then(() => {
            data.refetch();
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

  const rowSelectLength = Object.keys(rowSelection).length;
  return (
    <>
      {data.isLoading && <ComponentsLoading></ComponentsLoading>}
      {!data.isLoading && (
        <div className="">
          {/* Product Type Grid */}
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
            <EditAddProductDialog
              setOpenDialog={setOpenDialog}
              open={openDialog}
              refetch={data.refetch}
              idProduct={editProduct}
              setEditProduct={setEditProduct}
            ></EditAddProductDialog>
          </div>

          <div className="my-4 grid grid-cols-12 gap-2 items-center">
            <FilterProductType queryConfig={queryConfig}></FilterProductType>
            <FilterProductStatus
              queryConfig={queryConfig}
            ></FilterProductStatus>
            <Button
              className={`ml-auto ${rowSelectLength > 0 ? "block" : "hidden"} `}
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
      )}
    </>
  );
}
ProductPage.authGuard = true;
ProductPage.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
