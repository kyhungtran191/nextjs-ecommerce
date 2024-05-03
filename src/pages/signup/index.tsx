import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import * as yup from "yup";
import LoginThumb from "../../../public/login-thumb.jpg";
import Logo from "../../../public/logo.png";

export default function SignUp() {
  // React-Hook-Forms
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  //State
  const [isOpen, setIsOpen] = useState(false);
  const isLoading = false;

  const onSubmit = () => {};
  return (
    <div className="fixed grid w-screen h-screen grid-cols-2 gap-x-6">
      {/* Left */}
      <div
        className={`col-span-1 bg-login bg-cover bg-left bg-no-repeat hidden medium:block`}
      ></div>
      {/* Right */}
      <div className="w-full col-span-2 p-8 medium:py-14 medium:px-10 medium:col-span-1 flex-col max-w-[90%] medium:max-w-[70%] m-auto rounded-lg  max-h-auto shadow-2xl">
        <div className="flex justify-end">
          <Button className="bg-purple">
            <Link href="/">Back to Homepage</Link>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Image
            src={Logo}
            alt="logo"
            className="flex-shrink-0 object-cover w-10 h-10 sm:h-20 sm:w-20"
          />
        </div>
        <h2 className="mt-12 text-xl font-semibold">Nice to see you again!</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-6">
            <Input
              className="p-6 outline-none text-lg"
              placeholder="User Email"
            ></Input>
          </div>
          <div className="my-6">
            <div className="relative">
              <Input
                className="p-6 outline-none text-lg"
                placeholder="Password"
                type={isOpen ? "text" : "password"}
              ></Input>
              <div
                className="absolute -translate-y-1/2 top-[50%] w-5 h-5 cursor-pointer right-5"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <Icon icon="ri:eye-off-fill" className="w-full h-full"></Icon>
                ) : (
                  <Icon icon="mdi:eye" className="w-full h-full"></Icon>
                )}
              </div>
            </div>
          </div>
          <div className="my-6">
            <div className="relative">
              <Input
                className="p-6 outline-none text-lg"
                placeholder="Confirm password"
                type={isOpen ? "text" : "password"}
              ></Input>
              <div
                className="absolute -translate-y-1/2 top-[50%] w-5 h-5 cursor-pointer right-5"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <Icon icon="ri:eye-off-fill" className="w-full h-full"></Icon>
                ) : (
                  <Icon icon="mdi:eye" className="w-full h-full"></Icon>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <p className="font-semibold">Already has account?</p>
            <Link href="/login" className=" text-blue-500 underline mx-1">
              Login here
            </Link>
          </div>
          <Button
            type="submit"
            className={`w-full py-6 mt-8 text-lg transition-all duration-300 ease-in-out bg-purple bg-opacity-90  hover:bg-opacity-100 ${
              isLoading ? "pointer-events-none bg-opacity-65" : ""
            }`}
          >
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
}
