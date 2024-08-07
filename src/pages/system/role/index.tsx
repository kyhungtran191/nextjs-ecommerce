import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Search } from "@/components/Search";
import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import { LockKeyhole, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import PermissionTable from "./components/permissionsTable";
import { PERMISSIONS } from "@/configs/permission";
import { getAllValueOfObject } from "@/utils/helper";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import { usePermission } from "@/hooks/usePermissions";
import { useQueryRole } from "@/query/useQueryRole";
import Swal from "sweetalert2";
import instanceAxios from "@/configs/axiosInstance";
import { ResponseData } from "@/@types/message.type";
import { RoleAPI } from "@/apis/role.api";
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
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRole,
  getAllRole,
  getDetailRole,
  updateRole,
} from "@/services/role.services";

type RoleData = {
  _id: string;
  name: string;
  permissions: string[];
};

export default function RolePage() {
  const queryClient = useQueryClient();
  const [selectedRow, setSelectedRow] = useState<RoleData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [roleData, setRoleData] = useState<RoleData[]>([]);
  const [isEdit, setIsEdit] = useState("");
  const [permissions, setPermissions] = useState<string[]>([
    "MANAGE_PRODUCT.PRODUCT.VIEW",
    "MANAGE_PRODUCT.PRODUCT.CREATE",
    "MANAGE_PRODUCT.PRODUCT.UPDATE",
  ]);

  const schema = yup.object().shape({
    role_name: yup.string().required("This field is required"),
  });
  // Default use of usePermissions
  const { CREATE, DELETE, UPDATE, VIEW } = usePermission(
    "PERMISSIONS.SYSTEM.ROLE",
    ["CREATE", "VIEW", "UPDATE", "DELETE"]
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const roleQueryData = useQueryRole();

  const queryDetailRole = useQuery({
    queryKey: ["role_detail", selectedRow?._id],
    queryFn: () => getDetailRole(selectedRow?._id as string),
    enabled: Boolean(selectedRow),
  });

  // Update Role
  const updateRoleMutation = useMutation({
    mutationFn: (body: { name?: string; permissions?: string[]; id: string }) =>
      updateRole(body),
  });
  // Create Role
  const createRoleMutation = useMutation({
    mutationFn: (body: { name: string }) => createRole(body),
  });

  const handleEdit = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: RoleData) => {
      e.stopPropagation();
      setSelectedRow(row);
      reset({ role_name: row?.name });
      setIsEdit(row._id);
      setOpenDialog(true);
    },
    [reset]
  );

  const handleForm = useCallback(
    (data: { role_name: string }) => {
      if (isEdit) {
        updateRoleMutation.mutate(
          { name: data.role_name, id: isEdit },
          {
            onSuccess(data) {
              toast.success(data.data.message);
              queryClient.invalidateQueries(["roles"]);
              reset({ role_name: "" });
              setIsEdit("");
              setOpenDialog(false);
            },
            onError(data: any) {
              toast.error(data.response.data.message);
            },
          }
        );
      } else {
        createRoleMutation.mutate(
          { name: data.role_name },
          {
            onSuccess(data) {
              toast.success(data.data.message);
              queryClient.invalidateQueries(["roles"]);
              reset({ role_name: "" });
              setOpenDialog(false);
            },
            onError(data: any) {
              toast.error(data.response.data.message);
            },
          }
        );
      }
    },
    [isEdit, reset, queryClient, updateRoleMutation, createRoleMutation]
  );

  // Handle checkAllPermissions

  // Update Permission
  const handleUpdatePermissions = () => {
    updateRoleMutation.mutate(
      { permissions, id: selectedRow?._id as string },
      {
        onSuccess(data) {
          toast.success(data.data.message);
        },
        onError(data: any) {
          toast.error(data.response.data.message);
        },
      }
    );
  };

  useEffect(() => {
    const permissionsData = queryDetailRole.data?.data.data?.permissions;
    if (permissionsData) {
      if (permissionsData.includes(PERMISSIONS.ADMIN)) {
        setPermissions(
          getAllValueOfObject(PERMISSIONS, [
            PERMISSIONS.ADMIN,
            PERMISSIONS.BASIC,
          ])
        );
      } else if (permissionsData.includes(PERMISSIONS.BASIC)) {
        setPermissions([PERMISSIONS.DASHBOARD]);
      } else {
        setPermissions(permissionsData || []);
      }
    } else {
      setPermissions([]);
    }
  }, [queryDetailRole.data]);

  useEffect(() => {
    if (roleQueryData.data) {
      setRoleData(roleQueryData.data?.data.data?.roles || []);
    }
  }, [roleQueryData.data]);

  const handleDeleteRole = (id: string) => {
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
          .delete<ResponseData<RoleData>>(`${RoleAPI.ROLE}/${id}`)
          .then(() => {
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
      id: "name",
      header: () => <p className="">Name</p>,
      cell: ({ row }: { row: any }) => {
        return <p className="font-semibold">{row.original.name}</p>;
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
            {row.original.permissions.includes("ADMIN.GRANTED") ||
            row.original.permissions.includes("BASIC.PUBLIC") ? (
              <LockKeyhole
                className="font-normal  flex-shrink-0 cursor-not-allowed"
                width={20}
                height={20}
              ></LockKeyhole>
            ) : (
              <>
                <div
                  className={`p-2 rounded-full text-white ${
                    selectedRow?._id == row.original._id
                      ? "bg-purple text-white"
                      : "bg-black hover:bg-slate-200 bg-opacity-100"
                  }  ${!UPDATE ? "hidden" : "block"}`}
                  onClick={(e) => {
                    if (!UPDATE) return;
                    handleEdit(e, row.original);
                  }}
                >
                  <Pencil
                    className={`font-normal cursor-pointer flex-shrink-0  ${
                      !UPDATE
                        ? "!cursor-not-allowed bg-opacity-50"
                        : "cursor-default bg-opacity-100"
                    }`}
                    width={20}
                    height={20}
                  ></Pencil>
                </div>
                <div
                  className={`p-2 rounded-full text-white ${
                    selectedRow?._id == row.original._id
                      ? "bg-purple text-white"
                      : "bg-black hover:bg-slate-200 bg-opacity-100"
                  }  ${!DELETE ? "hidden" : "block"}`}
                >
                  <Trash2
                    className="font-normal cursor-pointer flex-shrink-0"
                    width={20}
                    height={20}
                    onClick={() => {
                      if (!DELETE) return;
                      handleDeleteRole(row.original._id);
                    }}
                  ></Trash2>
                </div>
              </>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const roleTable = useReactTable({
    data: roleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="grid grid-cols-3 gap-5 w-full">
      <div className="col-span-3 lg:col-span-1">
        <div className="flex items-center gap-2 w-full flex-wrap">
          <Search className="flex-shrink-0 !flex-1"></Search>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger disabled={!CREATE} className={``}>
              <div
                className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-white bg-purple cursor-pointer ${
                  !CREATE
                    ? "!cursor-not-allowed bg-opacity-50"
                    : "cursor-default bg-opacity-100"
                }`}
              >
                <Plus></Plus>
              </div>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              onCloseAutoFocus={() => {
                reset({ role_name: "" });
                setIsEdit("");
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-center">
                  {isEdit ? "Update Role" : "Add new Role"}
                </DialogTitle>
              </DialogHeader>
              <form
                className="grid gap-4 py-4"
                onSubmit={handleSubmit(handleForm)}
              >
                <Label htmlFor="name">Role Name</Label>
                <Controller
                  control={control}
                  name="role_name"
                  render={({ field }) => (
                    <Input
                      className="px-4 py-6 outline-none text-sm"
                      placeholder="Role Name"
                      {...field}
                    ></Input>
                  )}
                />
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.role_name && errors?.role_name?.message}
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-purple text-white">
                    {isEdit ? "Update " : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <h2 className="my-2 font-semibold">Role Manage</h2>
        <Table className="border">
          <TableHeader>
            {roleTable.getHeaderGroups().map((headerGroup) => (
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
            {roleTable?.getRowModel()?.rows?.length ? (
              roleTable?.getRowModel()?.rows?.map((row) => (
                <TableRow
                  key={row.id}
                  className={`cursor-pointer ${
                    selectedRow?._id === row.original._id
                      ? "bg-purple  hover:bg-purple text-white"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedRow(row.original);
                  }}
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
                  <ComponentsLoading></ComponentsLoading>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedRow && (
        <div className="col-span-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="my-2 font-semibold">Permissions With Role</h2>
            <Button
              className="bg-purple text-white"
              onClick={handleUpdatePermissions}
            >
              Update Permissions
            </Button>
          </div>
          <PermissionTable
            permissions={permissions}
            setPermissions={setPermissions}
            isLoading={queryDetailRole.isLoading}
            selectedRow={selectedRow}
          ></PermissionTable>
        </div>
      )}
    </div>
  );
}

RolePage.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);

RolePage.authGuard = true;
RolePage.permissions = [PERMISSIONS.SYSTEM.ROLE.VIEW];
