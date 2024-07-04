import DatePickerCustom from "@/components/DatePickerCustom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import DashboardLayout from "./layout/DashboardLayout ";
import WrapperFileUpload from "@/components/wrapper-react-drop";
import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";
import { convertBase64 } from "@/utils/helper";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryCities } from "@/query/useQueryCity";
import { useAppContext } from "@/context/app.context";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { updateMe } from "@/services/auth.services";

type TDefaultValue = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  address: string;
};

export default function Me() {
  const { user } = useAppContext();

  const [avatar, setAvatar] = useState<string>("");

  const schema = yup.object().shape({
    firstName: yup.string().required("Required_field"),
    middleName: yup.string().required("Required_field"),
    lastName: yup.string().required("Required_field"),
    email: yup.string().required("Required_field"),
    phoneNumber: yup
      .string()
      .required("Required_field")
      .min(9, "The phone number is min 9 number"),
    city: yup.string(),
    address: yup.string(),
  });

  const defaultValues: TDefaultValue = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: user?.city || "",
    address: "",
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const handleUploadImage = async (file: File) => {
    const base64 = await convertBase64(file);
    setAvatar(base64 as string);
  };

  const { data } = useQueryCities();

  const cityOptions = useMemo(() => {
    return data?.data?.data?.cities;
  }, [data?.data?.data?.cities]);

  useEffect(() => {
    if (user?._id) {
      reset({
        address: user?.address,
        city: user?.city,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        middleName: user.middleName,
        phoneNumber: user.phoneNumber,
      });

      if (user.avatar) {
        setAvatar(user?.avatar);
      }
    }
  }, [user]);

  const updateMeMutation = useMutation({
    mutationFn: (body: any) => updateMe(body),
  });

  const onSubmit = (value: any) => {
    const data = {
      ...value,
      avatar,
    };
    updateMeMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success("update success");
      },
      onError: (err: any) => {
        console.log(err);
      },
    });
  };

  return (
    <>
      <WrapperFileUpload
        uploadFunc={handleUploadImage}
        objectAcceptFile={{
          "image/jpeg": [".jpg", ".jpeg"],
          "image/png": [".png"],
        }}
        className="w-[100px] h-[100px] mx-auto rounded-full border cursor-pointer flex items-center justify-center mb-2"
      >
        {avatar ? (
          <div className="w-full h-full relative group">
            <Image
              src={avatar}
              width={0}
              height={0}
              alt={"product"}
              className="w-full h-full object-cover rounded-full"
            ></Image>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:visible invisible transition-all duration-300 ease-in-out">
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  setAvatar("");
                }}
              >
                <Trash2 className="text-red-400"></Trash2>
              </Button>
            </div>
          </div>
        ) : (
          <ImagePlus />
        )}
      </WrapperFileUpload>
      <form
        className="grid items-center  grid-cols-1 max-w-5xl mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="">
          <Label className="font-semibold text-md">First Name</Label>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <Input
                className="px-4 py-6 outline-none text-sm"
                placeholder="First Name"
                {...field}
              ></Input>
            )}
          />
          <div className="h-5 mt-2 text-base font-semibold text-red-500"></div>
        </div>

        <div className="">
          <Label className="font-semibold text-md">Middle Name</Label>
          <Controller
            control={control}
            name="middleName"
            render={({ field }) => (
              <Input
                className="px-4 py-6 outline-none text-sm"
                placeholder="Middle Name"
                {...field}
              ></Input>
            )}
          />
          <div className="h-5  text-base font-semibold text-red-500"></div>
        </div>

        <div className="">
          <Label className="font-semibold text-md">Last Name</Label>
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <Input
                className="px-4 py-6 outline-none text-sm"
                placeholder="Last Name"
                {...field}
              ></Input>
            )}
          />
          <div className="h-5  text-base font-semibold text-red-500"></div>
        </div>
        <div className="">
          <Label className="font-semibold text-md">Email</Label>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                className="p-4 mt-1 font-semibold bg-gray-200/80 outline-none"
                placeholder="Enter Email"
                disabled
                type={"text"}
                {...field}
              ></Input>
            )}
          />

          <div className="h-5  text-base font-semibold text-red-500"></div>
        </div>

        <div className="">
          <Label className="font-semibold text-md">Phone</Label>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <Input
                className="px-4 py-6 outline-none text-sm"
                placeholder="Phone"
                {...field}
              ></Input>
            )}
          />
          <div className="h-5 text-base font-semibold text-red-500"></div>
        </div>

        <div className="">
          <Label className="font-semibold text-md">Address</Label>
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <Input
                className="px-4 py-6 outline-none text-sm"
                placeholder="Address"
                {...field}
              ></Input>
            )}
          />
        </div>
        <div className="my-3">
          <Label className="font-semibold text-md">City</Label>

          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <Select
                {...field}
                value={field.value}
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cityOptions?.map((city) => {
                      return (
                        <SelectItem value={city._id} key={city._id}>
                          {city.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          ></Controller>
        </div>

        <Button className=" py-3 bg-blend-darken max-w-[80vw] mt-5  ">
          Update
        </Button>
      </form>
    </>
  );
}
Me.getLayout = (page: ReactNode) => (
  <GeneralLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </GeneralLayout>
);
Me.authGuard = true;
Me.guestGuard = false;
