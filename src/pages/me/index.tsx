import DatePickerCustom from "@/components/DatePickerCustom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode } from "react";
import DashboardLayout from "./layout/DashboardLayout ";

export default function Me() {
  return (
    <div className="">
      <label htmlFor="image" className="mx-auto cursor-pointer">
        <img
          alt=""
          className="w-[80px] h-[80px] rounded-full  border-black mx-auto hover:bg-black object-cover"
        />
        <input type="file" className="hidden" id="image" />
      </label>
      <form className="grid items-start justify-center grid-cols-2 gap-5">
        <div className="col-span-2 sm:col-span-1">
          <Label className="font-semibold text-md">First Name</Label>
          <Input
            className="p-4 mt-2 font-semibold shadow-inner outline-none "
            placeholder="Enter First Name"
            type={"text"}
          ></Input>
          <div className="h-5 mt-3 text-base font-semibold text-red-500"></div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label className="font-semibold text-md">Last Name</Label>
          <Input
            className="p-4 mt-2 font-semibold shadow-inner outline-none "
            placeholder="Enter Last Name"
            type={"text"}
          ></Input>
          <div className="h-5 mt-3 text-base font-semibold text-red-500"></div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label className="font-semibold text-md">Email</Label>
          <Input
            className="p-4 mt-2 font-semibold bg-gray-300 shadow-inner outline-none"
            placeholder="Enter Email"
            disabled
            type={"text"}
          ></Input>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label className="font-semibold text-md">Phone</Label>
          <Input
            className="p-4 mt-2 font-semibold shadow-inner outline-none "
            placeholder="+84"
            type={"text"}
          ></Input>

          <div className="h-5 mt-3 text-base font-semibold text-red-500"></div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label className="font-semibold text-md">Faculty</Label>
          <Input
            className="p-4 mt-2 font-semibold bg-gray-300 shadow-inner outline-none"
            placeholder="Faculty"
            type={"text"}
            disabled
          ></Input>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label className="font-semibold text-md">Date of Birth</Label>

          <DatePickerCustom
            mode="single"
            fromYear={1960}
            toYear={2030}
          ></DatePickerCustom>
        </div>
        <Button className="col-span-2 py-6 bg-blue-500">Update</Button>
      </form>
    </div>
  );
}
Me.getLayout = (page: ReactNode) => (
  <GeneralLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </GeneralLayout>
);
Me.authGuard = true;
Me.guestGuard = false;
