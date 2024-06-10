import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EMAIL_REG, PASSWORD_REG } from "@/utils/regex";
import { OptionType } from "@/components/MultiSelect";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  getDetailUser,
  updateUser,
} from "@/services/user.services";
import { TUser, TUserAdd } from "@/@types/user.type";
import { separationFullName, toFullName } from "@/utils/helper";
import { toast } from "react-toastify";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import { Switch } from "@/components/ui/switch";

interface TCreateEditUser {
  open: boolean;
  roles: OptionType[];
  idUser?: string;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setEditUser: React.Dispatch<React.SetStateAction<string | undefined>>;
  refetch: () => void;
}

type TDefaultValue = {
  password?: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
  address?: string;
  status?: number;
  city?: string;
};

export default function EditAddUserDialog({
  open,
  roles,
  setEditUser,
  setOpenDialog,
  idUser,
  refetch,
}: TCreateEditUser) {
  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Required_field")
      .matches(EMAIL_REG, "Rules_email"),
    password: idUser
      ? yup.string().nonNullable()
      : yup
          .string()
          .required("Required_field")
          .matches(PASSWORD_REG, "Rules_password"),
    fullName: yup.string().required("Required_field"),
    phoneNumber: yup
      .string()
      .required("Required_field")
      .min(9, "The phone number is min 9 number"),
    role: yup.string().required("Required_field"),
    city: yup.string().nonNullable(),
    address: yup.string().nonNullable(),
    status: yup.number().nonNullable(),
  });

  const defaultValues: TDefaultValue = {
    password: "",
    fullName: "",
    email: "",
    role: "",
    phoneNumber: "",
    address: "",
    city: "",
    status: 1,
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const userDetailData = useQuery({
    queryKey: ["users_detail", idUser],
    queryFn: (_) => getDetailUser(idUser as string),
    // enabled: Boolean(idUser),
    onSuccess: (data) => {
      const user = data?.data?.data;
      reset({
        fullName: toFullName(
          user?.lastName as string,
          user?.middleName as string,
          user?.firstName as string,
          "vi"
        ),
        phoneNumber: user?.phoneNumber,
        email: user?.email,
        role: user?.role?._id,
        password: "",
        status: user?.status,
      });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (body: TUserAdd) => createUser(body),
  });

  const updateUserMutation = useMutation({
    mutationFn: (body: TUserAdd) => updateUser(body, idUser as string),
  });

  const handleForm = (data: TDefaultValue) => {
    let { firstName, lastName, middleName } = separationFullName(
      data.fullName,
      "vi"
    );
    if (!idUser) {
      const addData: TUserAdd = {
        email: data.email,
        password: data.password as string,
        role: data.role as string,
        status: data.status,
        phoneNumber: data.phoneNumber,
        firstName,
        lastName,
        middleName,
      };
      createUserMutation.mutate(addData, {
        onSuccess(data) {
          let successMessage = data.data.message;
          toast.success(successMessage);
          // queryClient.invalidateQueries(["users"]);
          refetch();
          reset(defaultValues);
          setOpenDialog(false);
        },
        onError(err: any) {
          const errMessage = err.response.data.message;
          toast.error(errMessage);
        },
      });
    } else {
      const updatedData: TUserAdd = {
        email: data.email,
        password: data.password as string,
        role: data.role as string,
        phoneNumber: data.phoneNumber,
        status: data.status,
        firstName,
        lastName,
        middleName,
      };
      updateUserMutation.mutate(updatedData, {
        onSuccess(data) {
          let successMessage = data.data.message;
          toast.success(successMessage);
          // queryClient.invalidateQueries(["users"]);
          refetch();
          reset(defaultValues);
          setOpenDialog(false);
        },
        onError(err: any) {
          const errMessage = err.response.data.message;
          toast.error(errMessage);
        },
      });
    }
  };
  return (
    <div>
      <Dialog defaultOpen={open} open={open} onOpenChange={setOpenDialog}>
        <DialogTrigger>
          <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-white bg-purple cursor-pointer">
            <Plus></Plus>
          </div>
        </DialogTrigger>
        <DialogContent
          className=""
          onCloseAutoFocus={() => {
            setEditUser(undefined);
            setOpenDialog(false);
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              {idUser ? "Update User" : "Add new User"}
            </DialogTitle>
          </DialogHeader>
          {userDetailData.isLoading && idUser && (
            <ComponentsLoading></ComponentsLoading>
          )}
          {(!userDetailData.isLoading || !idUser) && (
            <form
              className="grid gap-2 py-4"
              onSubmit={handleSubmit(handleForm)}
            >
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field }) => (
                    <Input
                      className="px-4 py-6 outline-none text-sm"
                      placeholder="Full Name"
                      {...field}
                    ></Input>
                  )}
                />
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.fullName && errors?.fullName?.message}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      className="px-4 py-6 outline-none text-sm"
                      type="text"
                      placeholder="Email"
                      {...field}
                    ></Input>
                  )}
                />
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.email && errors?.email?.message}
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      className="px-4 py-6 outline-none text-sm"
                      type="password"
                      placeholder="Password"
                      {...field}
                    ></Input>
                  )}
                />
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.password && errors?.password?.message}
                </div>
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone</Label>
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <Input
                      className="px-4 py-6 outline-none text-sm"
                      type="text"
                      placeholder="Phone"
                      {...field}
                    ></Input>
                  )}
                />
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.phoneNumber && errors?.phoneNumber?.message}
                </div>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("role", value);
                  }}
                  defaultValue={getValues("role")}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select User Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roles &&
                        roles.map((role) => (
                          <SelectItem
                            value={role.value as string}
                            key={role.label}
                          >
                            {role.label}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.role && errors?.role?.message}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="airplane-mode">Status </Label>
                <Switch
                  id="airplane-mode"
                  defaultChecked={getValues("status") == 1}
                  onCheckedChange={() => {
                    const currentStatus = getValues("status");
                    currentStatus == 1
                      ? setValue("status", 0)
                      : setValue("status", 1);
                  }}
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-purple text-white">
                  {idUser ? "Update " : "Add"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
