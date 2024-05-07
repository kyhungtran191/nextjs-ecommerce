import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { Icon } from "@iconify/react";
import * as yup from "yup";
import LoginThumb from "../../../public/login-thumb.jpg";
import Logo from "../../../public/logo.png";
import { EMAIL_REG, PASSWORD_REG } from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { TLogin, User } from "@/@types/auth.type";
import { login } from "@/services/auth.services";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
type TDefaultValue = {
  email: string;
  password: string;
};
import {
  saveAccessTokenToLS,
  saveRefreshTokenToLS,
  saveUserToLS,
} from "@/utils/auth";
import { useAppContext } from "@/context/app.context";

export default function Login() {
  const { setIsAuth, setUser } = useAppContext();
  const router = useRouter();
  // Mutation
  const loginMutation = useMutation({
    mutationFn: (data: TLogin) => login(data),
  });
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
  });

  const defaultValues: TDefaultValue = {
    email: "admin@gmail.com",
    password: "123456789Kha@",
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: { email: string; password: string }) => {
    loginMutation.mutate(data, {
      onSuccess(data) {
        let currenData = data?.data?.data;
        saveAccessTokenToLS(currenData?.access_token as string);
        saveRefreshTokenToLS(currenData?.refresh_token as string);
        saveUserToLS(currenData?.user as User);
        setIsAuth(true);
        setUser(currenData?.user as User);
        toast.success("Login Successfully!");
        const returnUrl = router.query.returnUrl;
        const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
        router.replace(redirectURL as string);
      },
      onError(err: any) {
        if (err?.response?.data?.typeError === "INVALID")
          toast.error("The email or password wrong");
      },
    });
  };
  //State
  const [isOpen, setIsOpen] = useState(false);
  const isLoading = false;
  return (
    <div className="fixed grid w-screen h-screen grid-cols-2 gap-x-6">
      {/* Left */}
      <div
        className={`col-span-1 bg-login bg-cover bg-left bg-no-repeat hidden medium:block`}
      ></div>
      {/* Right */}
      <div className="w-full col-span-2 p-8 medium:py-14 medium:px-10 medium:col-span-1 flex-col max-w-[90%] medium:max-w-[70%] m-auto rounded-lg  max-h-auto shadow-2xl">
        <div className="flex justify-end">
          <Button className="bg-purple bg-opacity-90">
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
                  className="px-4 py-6 outline-none text-sm"
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
                    className="px-4 py-6 outline-none text-sm"
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
          <div className="flex justify-between">
            <div className="flex items-center">
              <p className="font-semibold">Dont have account?</p>
              <Link href="/signup" className=" text-blue-500 underline mx-1">
                Sign up here
              </Link>
            </div>
            <Link href="/" className="inline-block  text-blue-500 underline">
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className={`w-full py-6 mt-8 text-lg transition-all duration-300 ease-in-out bg-purple bg-opacity-90  hover:bg-opacity-100 ${
              isLoading ? "pointer-events-none bg-opacity-90" : ""
            }`}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
Login.guestGuard = true;
