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
import { LIST_DATA_PERMISSIONS, PERMISSIONS } from "@/configs/permission";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllValueOfObject } from "@/utils/helper";
import ComponentsLoading from "@/components/loading/ComponentsLoading";

type TProps = {
  permissions: string[];
  setPermissions: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading?: boolean;
};

export default function PermissionTable({
  permissions,
  setPermissions,
  isLoading,
}: TProps) {
  // return string from const value list
  const getValuePermission = (
    value: string,
    mode: string,
    parentValue?: string
  ) => {
    try {
      return parentValue
        ? PERMISSIONS[parentValue][value][mode]
        : PERMISSIONS[value];
    } catch (err) {
      return "";
    }
  };

  // Check onChange event
  const handleOnChangeCheckBox = (value: string) => {
    const isChecked = permissions?.includes(value);
    if (isChecked) {
      let newArr = permissions.filter((item) => item !== value);
      setPermissions(newArr);
    } else {
      setPermissions((prev) => [...prev, value]);
    }
  };

  const handleCheckIsCheckAll = (value: string, parentValues?: string) => {
    let allValue = parentValues
      ? getAllValueOfObject(PERMISSIONS[parentValues][value])
      : getAllValueOfObject(PERMISSIONS[value]);

    let isCheckAll = allValue.every((item) => permissions?.includes(item));
    return {
      isCheckAll,
      allValue,
    };
  };

  // Handle checkAll Permissions
  const handleCheckAllPermissions = (value: string, parentValues?: string) => {
    const { isCheckAll, allValue } = handleCheckIsCheckAll(value, parentValues);
    // isCheckAll -> filter ra
    if (isCheckAll) {
      let newArr = permissions.filter((item) => !allValue?.includes(item));
      setPermissions(newArr);
    } else {
      allValue.forEach((item) => permissions.push(item));
      let newArr = new Set(permissions);
      setPermissions([...newArr]);
    }
  };
  const columns = [
    {
      id: "all",
      header: () => <div className="flex items-center gap-2">All</div>,
      cell: ({ row }: { row: any }) => {
        const { isCheckAll } = handleCheckIsCheckAll(
          row.original.value,
          row.original.parentValue
        );
        return (
          !row.original.isHideAll && (
            <Checkbox
              value={row.original.value}
              onClick={(e) =>
                handleCheckAllPermissions(
                  (e.target as HTMLInputElement).value,
                  row.original.parentValue
                )
              }
              checked={isCheckAll}
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
        let value = getValuePermission(
          row.original.value,
          "VIEW",
          row.original.parentValue
        );
        return (
          !(row.original.isHideView || row.original.isParent) && (
            <Checkbox
              value={value}
              className="text-center"
              onClick={(e) => {
                handleOnChangeCheckBox((e.target as HTMLInputElement).value);
              }}
              checked={permissions?.includes(value)}
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
        let value = getValuePermission(
          row.original.value,
          "CREATE",
          row.original.parentValue
        );
        return (
          !(row.original.isHideCreate || row.original.isParent) && (
            <Checkbox
              value={value}
              onClick={(e) => {
                handleOnChangeCheckBox((e.target as HTMLInputElement).value);
              }}
              checked={permissions?.includes(value)}
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
      id: "update",
      header: () => <p>Update</p>,
      cell: ({ row }: { row: any }) => {
        let value = getValuePermission(
          row.original.value,
          "UPDATE",
          row.original.parentValue
        );
        return (
          !(row.original.isHideUpdate || row.original.isParent) && (
            <Checkbox
              value={value}
              onClick={(e) => {
                handleOnChangeCheckBox((e.target as HTMLInputElement).value);
              }}
              checked={permissions?.includes(value)}
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
      id: "delete",
      header: () => <p>Delete</p>,
      cell: ({ row }: { row: any }) => {
        let value = getValuePermission(
          row.original.value,
          "DELETE",
          row.original.parentValue
        );
        return (
          !(row.original.isHideDelete || row.original.isParent) && (
            <Checkbox
              value={value}
              onClick={(e) => {
                handleOnChangeCheckBox((e.target as HTMLInputElement).value);
              }}
              checked={permissions?.includes(value)}
            ></Checkbox>
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
      {isLoading && <ComponentsLoading></ComponentsLoading>}
      {!isLoading && (
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
      )}
    </div>
  );
}
