import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
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
  createProductType,
  getDetailProductType,
  updateProductType,
} from "@/services/product-type.services";
import { TProductTypeAdd } from "@/@types/product-type.type";
import { stringToSlug } from "@/utils/helper";

interface TCreateEditType {
  open: boolean;
  idType?: string;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setEditProductType: React.Dispatch<React.SetStateAction<string | undefined>>;
}

type TDefaultValue = {
  name: string;
  slug: string;
};

export default function EditAddProductTypeDialog({
  open,
  setEditProductType,
  setOpenDialog,
  idType,
}: TCreateEditType) {
  const schema = yup.object().shape({
    name: yup.string().required("Required_field"),
    slug: yup.string().required("Required_field"),
  });

  const defaultValues: TDefaultValue = {
    name: "",
    slug: "",
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    getValues,
    watch,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const userDetailData = useQuery({
    queryKey: ["productTypes_detail", idType],
    queryFn: (_) => getDetailProductType(idType as string),
    enabled: Boolean(idType),
    onSuccess: (data) => {
      const payment = data?.data?.data;
      reset({
        name: payment?.name,
        slug: payment?.slug,
      });
    },
  });

  const createProductTypeMutation = useMutation({
    mutationFn: (body: TProductTypeAdd) => createProductType(body),
  });

  const updateProductTypeMutation = useMutation({
    mutationFn: (body: TProductTypeAdd) =>
      updateProductType(body, idType as string),
  });

  const queryClient = useQueryClient();

  const handleForm = (data: TDefaultValue) => {
    if (!idType) {
      const addData: TProductTypeAdd = {
        name: data.name,
        slug: data.slug,
      };
      createProductTypeMutation.mutate(addData, {
        onSuccess(data) {
          let successMessage = data.data.message;
          toast.success(successMessage);
          reset(defaultValues);
          queryClient.invalidateQueries(["product_types"]);
          setOpenDialog(false);
        },
        onError(err: any) {
          const errMessage = err.response.data.message;
          toast.error(errMessage);
        },
      });
    } else {
      const updatedData: TProductTypeAdd = {
        name: data.name,
        slug: data.slug,
      };
      updateProductTypeMutation.mutate(updatedData, {
        onSuccess(data) {
          let successMessage = data.data.message;
          toast.success(successMessage);
          reset(defaultValues);
          queryClient.invalidateQueries(["product_types"]);
          setOpenDialog(false);
        },
        onError(err: any) {
          const errMessage = err.response.data.message;
          toast.error(errMessage);
        },
      });
    }
  };
  const nameValue = watch("name");

  useEffect(() => {
    const parseSlugValue = stringToSlug(nameValue);
    setValue("slug", parseSlugValue);
  }, [nameValue, setValue]);

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
            setEditProductType(undefined);
            setOpenDialog(false);
            reset(defaultValues);
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              {idType ? "Update User" : "Add new User"}
            </DialogTitle>
          </DialogHeader>
          {userDetailData.isLoading && idType && (
            <ComponentsLoading></ComponentsLoading>
          )}
          {(!userDetailData.isLoading || !idType) && (
            <form
              className="grid gap-2 py-4"
              onSubmit={handleSubmit(handleForm)}
            >
              <div>
                <Label htmlFor="name">Product Type</Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      className="px-4 py-6 outline-none text-sm"
                      placeholder="Product Type Name"
                      {...field}
                    ></Input>
                  )}
                />
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.name && errors?.name?.message}
                </div>
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Controller
                  control={control}
                  name="slug"
                  render={({ field }) => (
                    <Input
                      className="px-4 py-6 outline-none text-sm bg-slate-300"
                      disabled
                      placeholder="Slug"
                      {...field}
                    ></Input>
                  )}
                />
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.slug && errors?.slug?.message}
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-purple text-white">
                  {idType ? "Update " : "Add"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
