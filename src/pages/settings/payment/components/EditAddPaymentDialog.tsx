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

import { toast } from "react-toastify";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import {
  createPayment,
  getDetailPayment,
  updatePayment,
} from "@/services/payment.services";
import { TPaymentAdd } from "@/@types/payment.type";
import { PAYMENT_TYPE } from "@/constants/payment";

interface TCreateEditUser {
  open: boolean;
  idPayment?: string;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setEditPayment: React.Dispatch<React.SetStateAction<string | undefined>>;
}

type TDefaultValue = {
  name: string;
  type: string;
};

export default function EditAddPaymentDialog({
  open,
  setEditPayment,
  setOpenDialog,
  idPayment,
}: TCreateEditUser) {
  const schema = yup.object().shape({
    name: yup.string().required("Required_field"),
    type: yup.string().required("Required_field"),
  });

  const defaultValues: TDefaultValue = {
    name: "",
    type: "",
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
    queryKey: ["payment_detail", idPayment],
    queryFn: (_) => getDetailPayment(idPayment as string),
    enabled: Boolean(idPayment),
    onSuccess: (data) => {
      const payment = data?.data?.data;
      reset({
        name: payment?.name,
        type: payment?.type,
      });
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: (body: TPaymentAdd) => createPayment(body),
  });

  const updatePaymentMutation = useMutation({
    mutationFn: (body: TPaymentAdd) => updatePayment(body, idPayment as string),
  });

  const queryClient = useQueryClient();

  const handleForm = (data: TDefaultValue) => {
    if (!idPayment) {
      const addData: TPaymentAdd = {
        name: data.name,
        type: data.type,
      };
      createPaymentMutation.mutate(addData, {
        onSuccess(data) {
          let successMessage = data.data.message;
          toast.success(successMessage);
          reset(defaultValues);
          queryClient.invalidateQueries(["payment-type"]);
          setOpenDialog(false);
        },
        onError(err: any) {
          const errMessage = err.response.data.message;
          toast.error(errMessage);
        },
      });
    } else {
      const updatedData: TPaymentAdd = {
        name: data.name,
        type: data.type,
      };
      updatePaymentMutation.mutate(updatedData, {
        onSuccess(data) {
          let successMessage = data.data.message;
          toast.success(successMessage);
          reset(defaultValues);
          queryClient.invalidateQueries(["payment-type"]);
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
            setEditPayment(undefined);
            setOpenDialog(false);
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              {idPayment ? "Update User" : "Add new User"}
            </DialogTitle>
          </DialogHeader>
          {userDetailData.isLoading && idPayment && (
            <ComponentsLoading></ComponentsLoading>
          )}
          {(!userDetailData.isLoading || !idPayment) && (
            <form
              className="grid gap-2 py-4"
              onSubmit={handleSubmit(handleForm)}
            >
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      className="px-4 py-6 outline-none text-sm"
                      placeholder="Payment Name"
                      {...field}
                    ></Input>
                  )}
                />
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.name && errors?.name?.message}
                </div>
              </div>

              <div>
                <Label htmlFor="type">Payment Type</Label>
                <Select
                  onValueChange={(value) => {
                    console.log(value);
                    setValue("type", value);
                  }}
                  defaultValue={getValues("type")}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select Payment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {PAYMENT_TYPE &&
                        PAYMENT_TYPE.map((payment) => (
                          <SelectItem value={payment} key={payment}>
                            {payment}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.type && errors?.type?.message}
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-purple text-white">
                  {idPayment ? "Update " : "Add"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
