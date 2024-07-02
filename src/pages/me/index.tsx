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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryCities } from "@/query/useQueryCity";
export default function Me() {
  const [imageProduct, setImageProduct] = useState<string>("");
  const handleUploadImage = async (file: File) => {
    const base64 = await convertBase64(file);
    setImageProduct(base64 as string);
  };

  const { data } = useQueryCities();

  const cityOptions = useMemo(() => {
    return data?.data?.data?.cities;
  }, [data?.data?.data?.cities]);

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
        {imageProduct ? (
          <div className="w-full h-full relative group">
            <Image
              src={imageProduct}
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
                  setImageProduct("");
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
      <form className="grid items-center  grid-cols-1 max-w-5xl mx-auto ">
        <div className="">
          <Label className="font-semibold text-md">First Name</Label>
          <Input
            className="p-4 mt-1 font-semibold outline-none "
            placeholder="Enter First Name"
            type={"text"}
          ></Input>
          <div className="h-5 mt-2 text-base font-semibold text-red-500"></div>
        </div>

        <div className="">
          <Label className="font-semibold text-md">Middle Name</Label>
          <Input
            className="p-4 mt-1 font-semibold  outline-none "
            placeholder="Enter Last Name"
            type={"text"}
          ></Input>
          <div className="h-5  text-base font-semibold text-red-500"></div>
        </div>

        <div className="">
          <Label className="font-semibold text-md">Last Name</Label>
          <Input
            className="p-4 mt-1 font-semibold  outline-none "
            placeholder="Enter Last Name"
            type={"text"}
          ></Input>
          <div className="h-5  text-base font-semibold text-red-500"></div>
        </div>
        <div className="">
          <Label className="font-semibold text-md">Email</Label>
          <Input
            className="p-4 mt-1 font-semibold bg-gray-200/80 outline-none"
            placeholder="Enter Email"
            disabled
            type={"text"}
          ></Input>
          <div className="h-5  text-base font-semibold text-red-500"></div>
        </div>

        <div className="">
          <Label className="font-semibold text-md">Phone</Label>
          <Input
            className="p-4 mt-1 font-semibold  outline-none "
            placeholder="+84"
            type={"text"}
          ></Input>

          <div className="h-5 text-base font-semibold text-red-500"></div>
        </div>

        <div className="">
          <Label className="font-semibold text-md">Address</Label>
          <Input
            className="p-4 mt-1 font-semibold"
            placeholder="Address"
            type={"text"}
          ></Input>
        </div>
        <div className="my-3">
          <Label className="font-semibold text-md">City</Label>
          <Select>
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
