import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import * as yup from "yup";
import LoginThumb from "../../../public/login-thumb.jpg";
import Logo from "../../../public/logo.png";
import { EMAIL_REG, PASSWORD_REG } from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { TLogin } from "@/@types/auth.type";
import { ResponseLogin, register } from "@/services/auth.services";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
type TDefaultValue = {
  email: string;
  password: string;
  confirmPassword: string;
};
export default function SignUp() {
  const router = useRouter();
  // React-Hook-Forms
  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Required_field")
      .matches(EMAIL_REG, "Rules_email"),
    password: yup
      .string()
      .required("Required_field")
      .matches(PASSWORD_REG, "Rules_password"),
    confirmPassword: yup
      .string()
      .required("Required_field")
      .matches(PASSWORD_REG, "Rules_password")
      .oneOf([yup.ref("password"), ""], "Rules_confirm_password"),
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const registerMutation = useMutation({
    mutationFn: (data: TLogin) => register(data),
  });
  //State
  const [isOpen, setIsOpen] = useState(false);
  const isLoading = false;

  const onSubmit = (data: TDefaultValue) => {
    console.log(data);
    let { confirmPassword, ...rest } = data;
    registerMutation.mutate(rest, {
      onSuccess(data) {
        toast.success("Sign Up Successfully!");
        router.push("/login");
      },
      onError(err: any) {
        let message = err?.response?.data.message;
        toast.error(message);
      },
    });
  };
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
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  className="p-6 outline-none text-sm"
                  placeholder="User Email"
                  {...field}
                ></Input>
              )}
            />
            <div className="my-2 text-red-500 text-sm font-medium">
              {errors?.email && errors?.email?.message}
            </div>
          </div>
          <div className="my-6">
            <div className="relative">
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    className="p-6 outline-none text-sm"
                    placeholder="Password"
                    type={isOpen ? "text" : "password"}
                    {...field}
                  ></Input>
                )}
              />
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
            <div className="my-2 text-red-500 text-sm font-medium">
              {errors?.password && errors?.password?.message}
            </div>
          </div>
          <div className="my-6">
            <div className="relative">
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <Input
                    className="p-6 outline-none text-sm"
                    placeholder="Confirm password"
                    type={isOpen ? "text" : "password"}
                    {...field}
                  ></Input>
                )}
              />

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
            <div className="my-2 text-red-500 text-sm font-medium">
              {errors?.confirmPassword && errors?.confirmPassword?.message}
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
