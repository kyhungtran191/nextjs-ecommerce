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
import { useMutation, useQuery } from "@tanstack/react-query";
import { logout } from "@/services/auth.services";
import {
  clearLS,
  getLocalProductCart,
  setLocalProductToCart,
} from "@/utils/auth";
import Router, { useRouter } from "next/router";
import { useAppContext } from "@/context/app.context";
import {
  Armchair,
  KeyRound,
  LogOut,
  Moon,
  ShoppingBasket,
  ShoppingCart,
  Sun,
  User,
} from "lucide-react";
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
import { getAllProductTypes } from "@/services/product-type.services";
import QuantityController from "@/components/QuantityController";
import Close from "@/pages/my-cart/(components)/CloseIcon";
import { cloneDeep } from "lodash";
import { convertAddProduct } from "@/utils/helper";
import { CartItem } from "@/@types/cart.type";

export default function Header() {
  const { cart, clearCart } = useCartStore();
  const { setTheme } = useTheme();
  const { setIsAuth, setUser, user, isAuth } = useAppContext();

  const { updateCart } = useCartStore();
  useEffect(() => {
    const cartLS = getLocalProductCart();
    const parseData = cartLS ? JSON.parse(cartLS) : {};
    if (user?._id) {
      console.log(parseData);
      updateCart(parseData[user?._id] ? parseData[user?._id] : []);
    }
  }, []);

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess() {
      clearLS();
      setIsAuth(false);
      setUser(undefined);
      toast.success("Logout successfully!");
      Router.push("/login");
    },
  });
  const handleLogout = () => {
    logoutMutation.mutate();
    clearCart();
  };

  const { data: categoryData } = useQuery({
    queryKey: ["product_types"],
    queryFn: () => getAllProductTypes({}),
    onSuccess: () => {},
    staleTime: 60 * 10,
    cacheTime: 60 * 10 * 10,
  });

  const cartLength = useMemo(() => {
    const totalQuantity = cart?.reduce(
      (sum, currentValue) => (sum += currentValue.amount),
      0
    );
    return totalQuantity;
  }, [cart]);

  const onType = (id: string, value: number) => {
    const increasingItem = cart.find((item) => item.product == id);
    let cloneItem = cloneDeep(increasingItem);
    const cartLS = getLocalProductCart();
    const parseCart = cartLS ? JSON.parse(cartLS) : {};
    const cartConverted = convertAddProduct(
      cart,
      {
        ...cloneItem,
        amount: value,
      } as CartItem,
      true
    );
    updateCart(cartConverted);
    if (user?._id) {
      setLocalProductToCart({ ...parseCart, [user._id]: cartConverted });
    }
  };

  const popoverOptions = [
    {
      title: "My Orders",
      link: "/me/orders",
      icon: ShoppingBasket,
    },
    {
      title: "My Product",
      link: "/me/favorite",
      icon: Armchair,
    },
    {
      title: "Change Password",
      link: "/me/favorite",
      icon: KeyRound,
    },
  ];

  const onDecrease = (id: string, value: number) => {
    const increasingItem = cart.find((item) => item.product == id);
    let cloneItem = cloneDeep(increasingItem);
    const cartLS = getLocalProductCart();
    const parseCart = cartLS ? JSON.parse(cartLS) : {};
    const cartConverted = convertAddProduct(cart, {
      ...cloneItem,
      amount: -1,
    } as CartItem).filter((item) => item.amount > 0);
    updateCart(cartConverted);
    if (user?._id) {
      setLocalProductToCart({ ...parseCart, [user._id]: cartConverted });
    }
  };

  const onIncrease = (id: string, value: number) => {
    const increasingItem = cart.find((item) => item.product == id);
    let cloneItem = cloneDeep(increasingItem);
    const cartLS = getLocalProductCart();
    const parseCart = cartLS ? JSON.parse(cartLS) : {};
    const cartConverted = convertAddProduct(cart, {
      ...cloneItem,
      amount: 1,
    } as CartItem);
    updateCart(cartConverted);
    if (user?._id) {
      setLocalProductToCart({ ...parseCart, [user._id]: cartConverted });
    }
  };

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
          {categoryData?.data?.data?.productTypes.map((item, index) => (
            <Link
              href={`/products?category=${item._id}`}
              className="font-semibold hover:text-orange-900"
              key={item._id}
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
                <div className="absolute w-5 h-5 bg-red-600 rounded-full top-0 right-1 flex items-center justify-center text-[10px] text-white">
                  {(cartLength && cartLength >= 100 ? "99+" : cartLength) || 0}
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent className="p-2">
              <SheetHeader className="">
                <SheetTitle className="text-3xl font-bold flex items-center gap-2">
                  Cart
                  <span className="text-base text-slate-600 font-medium">
                    ({cartLength || 0} items)
                  </span>
                  <Link href="my-cart" className="text-xs">
                    View all
                  </Link>
                </SheetTitle>
                <Button>Check out</Button>
              </SheetHeader>
              <Separator className="my-4" />
              {!cartLength && (
                <div className="text-center text-slate-600 font-medium">
                  Your cart is currently empty
                </div>
              )}
              <div className="max-h-[90vh] overflow-y-scroll pb-10 px-3">
                {cartLength > 0 &&
                  cart.map((item, index) => (
                    <div
                      className="flex flex-wrap items-start gap-2 py-2  border-darkGrey"
                      key={item?.product}
                    >
                      <Link
                        href="/products/1"
                        className="w-full h-[204px] sm:h-[204px] flex-shrink-0"
                      >
                        <Image
                          src={item?.image}
                          alt="cart-item"
                          width={0}
                          height={0}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </Link>
                      <div className="w-full sm:flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl sm:text-2xl text-black font-semibold">
                            {item?.name}
                          </h3>
                          <Close className="cursor-pointer"></Close>
                        </div>
                        <p className="text-xl  text-red-600 font-semibold my-2">
                          {item?.price}$
                        </p>
                        <QuantityController
                          defaultValue={item.amount}
                          value={item.amount}
                          classNameWrapper="my-2"
                          onDecrease={onDecrease}
                          onType={onType}
                          onIncrease={onIncrease}
                          id={item.product}
                          max={100}
                        ></QuantityController>
                      </div>
                      {index != cart.length - 1 && <Separator></Separator>}
                    </div>
                  ))}
              </div>
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
                <PopoverContent className="w-50">
                  <div className="grid">
                    <div className="">
                      <Link
                        href="/me"
                        className="font-medium leading-none py-2 px-2 cursor-pointer rounded-lg hover:bg-slate-100"
                      >
                        {user?.email}
                      </Link>
                      <Separator className="my-2"></Separator>
                    </div>
                    <div className="gap-2 text-slate-700 font-medium">
                      {popoverOptions.map((item, index) => {
                        return (
                          <Link
                            className="flex items-end w-full px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 gap-x-2"
                            key={index}
                            href={item.link}
                          >
                            <item.icon></item.icon> {item.title}
                          </Link>
                        );
                      })}

                      <div
                        className="flex items-center w-full px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 gap-x-3"
                        onClick={handleLogout}
                      >
                        <LogOut></LogOut> Logout
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
