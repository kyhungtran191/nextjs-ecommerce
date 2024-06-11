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
import {
  createCity,
  getDetailCity,
  updateCity,
} from "@/services/city.services";
import { toast } from "react-toastify";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import { TCityAdd } from "@/@types/city.type";

interface TCreateEditCity {
  open: boolean;
  idCity?: string;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setEditCity: React.Dispatch<React.SetStateAction<string | undefined>>;
}

type TDefaultValue = {
  name: string;
};

export default function EditAddCityDialog({
  open,
  setEditCity,
  setOpenDialog,
  idCity,
}: TCreateEditCity) {
  const schema = yup.object().shape({
    name: yup.string().required("Required_field"),
  });

  const defaultValues: TDefaultValue = {
    name: "",
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

  const CityDetailData = useQuery({
    queryKey: ["city_detail", idCity],
    queryFn: (_) => getDetailCity(idCity as string),
    enabled: Boolean(idCity),
    onSuccess: (data) => {
      const city = data?.data?.data;
      reset({ name: city?.name });
    },
  });

  const createCityMutation = useMutation({
    mutationFn: (body: TCityAdd) => createCity(body),
  });

  const updateCityMutation = useMutation({
    mutationFn: (body: TCityAdd) => updateCity(body, idCity as string),
  });

  const queryClient = useQueryClient();

  const handleForm = (data: TDefaultValue) => {
    if (!idCity) {
      createCityMutation.mutate(data, {
        onSuccess(data) {
          let successMessage = data.data.message;
          toast.success(successMessage);
          reset(defaultValues);
          queryClient.invalidateQueries(["cities"]);
          setOpenDialog(false);
        },
        onError(err: any) {
          const errMessage = err.response.data.message;
          toast.error(errMessage);
        },
      });
    } else {
      const updatedData: TCityAdd = {
        name: data.name,
      };
      updateCityMutation.mutate(updatedData, {
        onSuccess(data) {
          let successMessage = data.data.message;
          toast.success(successMessage);
          reset(defaultValues);
          queryClient.invalidateQueries(["cities"]);
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
            setEditCity(undefined);
            setOpenDialog(false);
            reset(defaultValues);
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              {idCity ? "Update City" : "Add new City"}
            </DialogTitle>
          </DialogHeader>
          {CityDetailData.isLoading && idCity && (
            <ComponentsLoading></ComponentsLoading>
          )}
          {(!CityDetailData.isLoading || !idCity) && (
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
                      placeholder="City Name"
                      {...field}
                    ></Input>
                  )}
                />
                <div className=" text-red-500 text-sm font-medium">
                  {errors?.name && errors?.name?.message}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-purple text-white">
                  {idCity ? "Update " : "Add"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
