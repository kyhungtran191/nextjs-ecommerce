import { Heart, Router, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TProductPublic } from "@/@types/product.type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CartItem } from "@/@types/cart.type";
import { useCartStore } from "@/stores/cart.store";
import { convertAddProduct } from "@/utils/helper";
import { useAppContext } from "@/context/app.context";
import { getLocalProductCart, setLocalProductToCart } from "@/utils/auth";
import { useRouter } from "next/router";
export default function ProductCard({ product }: { product: TProductPublic }) {
  const { cart, updateCart } = useCartStore();
  const { user } = useAppContext();
  const router = useRouter();
  const addProductToCart = (item: CartItem) => {
    if (!user?._id) {
      if (router.asPath !== "/" && router.asPath !== "/login") {
        return router.replace({
          pathname: "/login",
          query: { returnUrl: router.asPath },
        });
      } else {
        return router.replace("/login");
      }
    }
    const cartLS = getLocalProductCart();
    console.log("Cart Item", item);
    const parseCart = cartLS ? JSON.parse(cartLS) : {};
    const convertedCartItems = convertAddProduct(cart, item);
    console.log(convertedCartItems);
    updateCart(convertedCartItems);
    console.log("cartParse", parseCart);
    if (user?._id) {
      setLocalProductToCart({ ...parseCart, [user._id]: convertedCartItems });
    }
  };

  return (
    <div className="relative">
      <Link href={`/products/${product?.slug}`}>
        <Image
          src={product?.image}
          alt=""
          width="0"
          height="0"
          className="h-[280px] sm:h-[360px] w-full object-cover rounded-2xl"
        ></Image>
      </Link>

      <div className="absolute w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center top-4 left-4">
        <Heart></Heart>
      </div>
      <div
        className="absolute w-10 h-10  rounded-full  bg-white shadow-lg flex items-center justify-center top-4 right-4"
        onClick={(e) => {
          const mappedItem: CartItem = {
            name: product.name,
            amount: 1,
            discount: product.discount,
            image: product.image,
            price: product.price,
            product: product._id,
          };
          e.stopPropagation();
          e.preventDefault();
          addProductToCart(mappedItem);
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <ShoppingCart></ShoppingCart>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white  font-semibold">
              <p>Add to Cart</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="p-2">
        <div className="flex items-center justify-between ">
          <h2 className="font-medium text-lg">{product?.name}</h2>
          <div className="flex items-center font-semibold gap-2">
            <p className="text-red-500 line-through text-sm">
              {product?.price}
            </p>
            {/* Fix later */}
            <p className="text-base">$400</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-1">
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((item, index) => (
                  <Star fill="#f7d100" strokeWidth={0} key={index} />
                ))}
            </div>
            <span className="text-slate-500 text-sm font-semibold">(51)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
