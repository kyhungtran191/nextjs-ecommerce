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

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import {
  createDelivery,
  getDetailDelivery,
  updateDelivery,
} from "@/services/delivery.services";
import { TDeliveryAdd } from "@/@types/delivery.type";

interface TCreateEditDelivery {
  open: boolean;
  idDelivery?: string;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setEditDelivery: React.Dispatch<React.SetStateAction<string | undefined>>;
}

type TDefaultValue = {
  name: string;
  price: number;
};

export default function EditAddDeliveryDialog({
  open,
  setEditDelivery,
  setOpenDialog,
  idDelivery,
}: TCreateEditDelivery) {
  const schema = yup.object().shape({
    name: yup.string().required("Required_field"),
    price: yup.number().required("Required_field"),
  });

  const defaultValues: TDefaultValue = {
    name: "",
    price: 0,
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const DeliveryDetailData = useQuery({
    queryKey: ["delivery_detail", idDelivery],
    queryFn: (_) => getDetailDelivery(idDelivery as string),
    enabled: Boolean(idDelivery),
    onSuccess: (data) => {
      const delivery = data?.data?.data;
      reset({ name: delivery?.name, price: delivery?.price });
    },
  });

  const createDeliveryMutation = useMutation({
    mutationFn: (body: TDeliveryAdd) => createDelivery(body),
  });

  const updateDeliveryMutation = useMutation({
    mutationFn: (body: TDeliveryAdd) =>
      updateDelivery(body, idDelivery as string),
  });

  const queryClient = useQueryClient();

  const handleForm = (data: TDefaultValue) => {
    if (!idDelivery) {
      createDeliveryMutation.mutate(data, {
        onSuccess(data) {
          let successMessage = data.data.message;
          toast.success(successMessage);
          reset(defaultValues);
          queryClient.invalidateQueries(["delivery-type"]);
          setOpenDialog(false);
        },
        onError(err: any) {
          const errMessage = err.response.data.message;
          toast.error(errMessage);
        },
      });
    } else {
      const updatedData: TDeliveryAdd = {
        name: data.name,
        price: data.price,
      };
      updateDeliveryMutation.mutate(updatedData, {
        onSuccess(data) {
          let successMessage = data.data.message;
          toast.success(successMessage);
          reset(defaultValues);
          queryClient.invalidateQueries(["delivery-type"]);
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
            setEditDelivery(undefined);
            setOpenDialog(false);
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              {idDelivery ? "Update Delivery" : "Add new Delivery"}
            </DialogTitle>
          </DialogHeader>
          {DeliveryDetailData.isLoading && idDelivery && (
            <ComponentsLoading></ComponentsLoading>
          )}
          {(!DeliveryDetailData.isLoading || !idDelivery) && (
            <form
              className="grid gap-2 py-4"
              onSubmit={handleSubmit(handleForm)}
            >
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      className="px-4 py-6 outline-none text-sm"
                      placeholder="Delivery Name"
                      {...field}
                    ></Input>
                  )}
                />
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.name && errors?.name?.message}
                </div>
              </div>
              <div>
                <Label htmlFor="name">Price</Label>
                <Controller
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <Input
                      className="px-4 py-6 outline-none text-sm"
                      placeholder="Delivery Price"
                      {...field}
                    ></Input>
                  )}
                />
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.price && errors?.price?.message}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-purple text-white">
                  {idDelivery ? "Update " : "Add"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
