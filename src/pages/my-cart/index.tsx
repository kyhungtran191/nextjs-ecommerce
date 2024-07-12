import { Button } from "@/components/ui/button";
import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode, useMemo } from "react";
import Banner from "./(components)/Banner";
import Link from "next/link";
import Image from "next/image";
import Close from "./(components)/CloseIcon";
import QuantityController from "@/components/QuantityController";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cart.store";
import { CartItem } from "@/@types/cart.type";
import { useAppContext } from "@/context/app.context";
import { cloneDeep } from "lodash";
import { getLocalProductCart, setLocalProductToCart } from "@/utils/auth";
import { convertAddProduct } from "@/utils/helper";
export default function MyCart() {
  const { cart, updateCart } = useCartStore();
  const { user } = useAppContext();

  const { totalPrice, totalQuantity: cartLength } = useMemo(() => {
    const totalQuantity = cart?.reduce(
      (sum, currentValue) => (sum += currentValue.amount),
      0
    );

    const totalPrice = cart?.reduce(
      (sum, currentValue) => (sum += currentValue.amount * currentValue.price),
      0
    );

    return { totalPrice, totalQuantity };
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
    <div>
      <section>
        <Banner className="w-full"></Banner>
        <div className="container">
          <h2 className="text-[28px] font-bold md:text-[38px]">YOUR CART</h2>
          <p className="text-xs text-darkGray">
            *FREE DELIVERY Applies to orders of 5.000.000₫ or more
          </p>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="text-base font-medium my-4">
            Total ({cartLength || 0} items): <span>{totalPrice || 0} $</span>
          </div>
          <div className="grid grid-cols-1 medium:grid-cols-10 gap-10">
            <div className="col-span-1 medium:col-span-6 sm:max-h-auto p-3 max-h-[600px] overflow-y-auto">
              {cart.length > 0 &&
                cart.map((item, index) => (
                  <div
                    className="flex flex-wrap items-start gap-4 sm:gap-7 py-5 border-b border-darkGrey"
                    key={item.product}
                  >
                    <Link
                      href="/products/1"
                      className="w-full h-[204px] sm:h-[204px] sm:w-[204px] flex-shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt="cart-item"
                        width={0}
                        height={0}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </Link>
                    <div className="w-full sm:flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl sm:text-2xl text-black font-semibold">
                          {item.name}
                        </h3>
                        <Close className="cursor-pointer"></Close>
                      </div>
                      <p className="text-xl  text-red-600 font-semibold my-2">
                        {item.price}$
                      </p>

                      <QuantityController
                        value={item.amount}
                        classNameWrapper="my-2 flex items-end"
                        defaultValue={item.amount}
                        id={item.product}
                        onDecrease={onDecrease}
                        onIncrease={onIncrease}
                        onType={onType}
                      ></QuantityController>
                    </div>
                  </div>
                ))}
              {!cart.length && (
                <div className="font-semibold text-center">
                  Your Cart is Empty
                </div>
              )}
            </div>
            <div className="col-span-1 medium:col-span-4">
              <h2 className="font-medium text-lg">YOUR CART</h2>
              <div className="relative my-6">
                <Input
                  type="text"
                  placeholder="Discount Code"
                  className="px-3 bg-[#D9D9D9CC] outline-none border-none w-full rounded-md "
                />
                <div className="absolute right-[8px] cursor-pointer top-[50%] -translate-y-1/2 text-[40px] font-medium">
                  +
                </div>
              </div>
              <div className="flex justify-between items-center my-2">
                <h3 className="text-xl font-bold">Total:</h3>
                <span className="text-xl font-bold text-red-600">
                  {totalPrice || 0}$
                </span>
              </div>
              <Button className="w-full py-6">Checkout</Button>
              <div className="mt-4 text-darkGrey font-medium text-center">
                <p>ACCEPTANCE PAYMENT METHOD:</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
MyCart.authGuard = true;
MyCart.getLayout = (page: ReactNode) => <GeneralLayout>{page}</GeneralLayout>;
