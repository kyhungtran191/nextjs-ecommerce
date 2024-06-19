import { Button } from "@/components/ui/button";
import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode } from "react";
import Banner from "./(components)/Banner";
import Link from "next/link";
import ProductCartImage from "../../../public/bedroom.jpg";
import Image from "next/image";
import Close from "./(components)/CloseIcon";
import QuantityController from "@/components/QuantityController";
import { Input } from "@/components/ui/input";
export default function MyCart() {
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
            Total (2 items): <span>8,218,000 đ</span>
          </div>
          <div className="grid grid-cols-1 medium:grid-cols-10 gap-10">
            <div className="col-span-1 medium:col-span-6 sm:max-h-auto p-3 max-h-[600px] overflow-auto">
              {Array(5)
                .fill(0)
                .map((item, index) => (
                  <div
                    className="flex flex-wrap items-start gap-4 sm:gap-7 py-5 border-b border-darkGrey"
                    key={index}
                  >
                    <Link
                      href="/products/1"
                      className="w-full h-[204px] sm:h-[204px] sm:w-[204px] flex-shrink-0"
                    >
                      <Image
                        src={ProductCartImage}
                        alt="cart-item"
                        width={0}
                        height={0}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </Link>
                    <div className="w-full sm:flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl sm:text-2xl text-black font-semibold">
                          Air Jordan 1 Zoom Cmft
                        </h3>
                        <Close className="cursor-pointer"></Close>
                      </div>
                      <p className="text-xl  text-red-600 font-semibold my-2">
                        4,109,000₫
                      </p>
                      <div className="text-base font-semibold">
                        Category: <span className="font-semibold">Black</span>
                      </div>
                      <QuantityController
                        value={1}
                        classNameWrapper="my-2"
                      ></QuantityController>
                    </div>
                  </div>
                ))}
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
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold">
                  Total Product Value:
                </h3>
                <span className="text-base font-semibold">8,218,000₫</span>
              </div>
              <div className="flex justify-between items-center pb-5 border-b border-darkGrey">
                <h3 className="text-base font-semibold">Total Delivery Fee:</h3>
                <span className="text-base font-semibold">8,218,000₫</span>
              </div>
              <div className="flex justify-between items-center my-2">
                <h3 className="text-xl font-bold">Total:</h3>
                <span className="text-xl font-bold text-red-600">
                  8,218,000₫
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
