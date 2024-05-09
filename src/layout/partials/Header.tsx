import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Logo from "../../../public/logo.png";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/services/auth.services";
import { clearLS } from "@/utils/auth";
import { useRouter } from "next/router";
import { useAppContext } from "@/context/app.context";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { setTheme } = useTheme();
  const { setIsAuth, setUser, user, isAuth } = useAppContext();
  const router = useRouter();
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess() {
      clearLS();
      setIsAuth(false);
      setUser(undefined);
      toast.success("Logout successfully!");
      // router.push("/login");
    },
  });
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  return (
    <header className="h-[72px] w-full sticky top-0 left-0 right-0 shadow-md z-30 bg-white text-black ">
      <nav className="container h-full flex justify-between items-center leading-[72px] relative">
        <div className="flex items-center">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Image
              alt="logo"
              src={Logo}
              width={20}
              height={20}
              className="flex-shrink-0 object-cover w-8 h-8 sm:h-16 sm:w-16"
            />
            <h1 className="text-sm font-bold text-center sm:text-xl">Shop</h1>
          </Link>
        </div>
        <div className="items-center hidden ml-8 lg:flex absolute left-[50%] -transition-x-1/2">
          {Array(5)
            .fill(0)
            .map((item, index) => (
              <div className="mx-4" key={index}>
                {index}
              </div>
            ))}
        </div>
        <div className="flex items-center gap-x-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isAuth && user && (
            <Popover>
              <PopoverTrigger asChild className="cursor-pointer">
                <Avatar>
                  <AvatarImage
                    src="https://variety.com/wp-content/uploads/2021/04/Avatar.jpg"
                    className="object-cover"
                  ></AvatarImage>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="px-2 w-50">
                <div className="grid gap-4">
                  <div className="space-y-2 hover:bg-slate-100">
                    <h4 className="font-medium leading-none">{user?.email}</h4>
                    {/* <p className="text-sm text-muted-foreground">Student</p> */}
                    <Separator></Separator>
                  </div>
                  <div className="gap-2 text-slate-700 font-medium">
                    <div className="flex items-center w-full px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 gap-x-3">
                      My Profile
                    </div>
                    <div
                      className="flex items-center w-full px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 gap-x-3"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          {!isAuth && (
            <Popover>
              <PopoverTrigger asChild className="cursor-pointer">
                <Avatar className="border-2">
                  <AvatarImage
                    src="https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
                    className="object-cover"
                  ></AvatarImage>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="px-2 max-w-[150px]">
                <Link
                  href="signup"
                  className="gap-2 text-slate-700 font-medium"
                >
                  <div className="flex items-center justify-center  px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 gap-x-3">
                    Sign Up
                  </div>
                  <Separator></Separator>
                </Link>
                <Link href="login" className="gap-2 text-slate-700 font-medium">
                  <div className="flex items-center justify-center  px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 gap-x-3">
                    Login
                  </div>
                </Link>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </nav>
    </header>
  );
}
