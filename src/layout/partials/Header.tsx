import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Logo from "../../../public/logo.svg";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/services/auth.services";
import { clearLS } from "@/utils/auth";
import { useRouter } from "next/router";
import { useAppContext } from "@/context/app.context";
import { Moon, ShoppingCart, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart.store";

export default function Header() {
  const { cart, clearCart } = useCartStore();
  const { setTheme } = useTheme();
  const { setIsAuth, setUser, user, isAuth } = useAppContext();

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
    clearCart();
  };

  const arrMenuOptions = [
    { name: "Seatings", link: "/seatings" },
    { name: "Outdoors", link: "/outdoors" },
    { name: "Living", link: "/living" },
    { name: "Dining", link: "/dining" },
    { name: "Bedroom", link: "/bed-room" },
    { name: "Storage", link: "/storage" },
    { name: "Office", link: "/office" },
  ];

  const cartLength = useMemo(() => {
    const totalQuantity = cart.reduce(
      (sum, currentValue) => (sum += currentValue.amount),
      0
    );
    return totalQuantity;
  }, [cart]);
  console.log(cartLength);
  return (
    <header className="h-[72px] w-full fixed bg-transparent top-0 left-0 right-0 shadow-md z-30 bg-white text-black">
      <nav className="h-full flex justify-between items-center leading-[72px]  container-fluid">
        <div className="flex items-center">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Image
              alt="logo"
              src={Logo}
              width={80}
              height={72}
              className="flex-shrink-0 object-cover"
            />
          </Link>
        </div>
        <div className="items-center hidden  gap-6 lg:flex ">
          {arrMenuOptions.map((item, index) => (
            <Link
              href={item.link}
              className="font-semibold hover:text-orange-900"
              key={index}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-x-2 medium:gap-x-5">
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

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="relative">
                <ShoppingCart></ShoppingCart>
                <div className="absolute w-5 h-5 bg-red-600 rounded-full top-0 right-1 flex items-center justify-center text-xs text-white">
                  {cartLength}
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-3xl font-bold flex items-end gap-2">
                  Cart
                  <span className="text-base text-slate-600 font-medium">
                    ({cartLength} items)
                  </span>
                </SheetTitle>
              </SheetHeader>
              <Separator className="my-4" />
              <div className="text-center text-slate-600 font-medium">
                Your cart is currently empty
              </div>
              <SheetFooter></SheetFooter>
            </SheetContent>
          </Sheet>

          {isAuth && user && (
            <div className="flex items-center">
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
                      <h4 className="font-medium leading-none">
                        {user?.email}
                      </h4>
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
            </div>
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
