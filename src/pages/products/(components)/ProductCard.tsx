import { Heart, Router, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { TProductPublic } from "@/@types/product.type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CartItem } from "@/@types/cart.type";
import { useCartStore } from "@/stores/cart.store";
import { convertAddProduct, isExpiry } from "@/utils/helper";
import { useAppContext } from "@/context/app.context";
import { getLocalProductCart, setLocalProductToCart } from "@/utils/auth";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeProduct, unlikeProduct } from "@/services/product-public.services";
import { toast } from "react-toastify";
export default function ProductCard({ product }: { product: TProductPublic }) {
  const { cart, updateCart } = useCartStore();
  const { user } = useAppContext();
  const router = useRouter();
  const [isLikedByUser, setIsLikedByUser] = useState<Boolean>(
    product?.likedBy?.includes(user?._id as string)
  );

  const queryClient = useQueryClient();

  const { mutate: like } = useMutation({
    mutationFn: (productId: string) => likeProduct({ productId }),
    onSuccess: () => {
      // Success actions
      toast.success("Like product successfully!");
      setIsLikedByUser(true);
      queryClient.invalidateQueries(["favorite-me"]);
    },
    onError: (error) => {
      // Error actions
    },
  });

  const { mutate: unlike } = useMutation({
    mutationFn: (productId: string) => unlikeProduct({ productId }),
    onSuccess: () => {
      // Success actions
      toast.success("unLike product successfully!");
      setIsLikedByUser(false);
      queryClient.invalidateQueries(["favorite-me"]);
    },
    onError: (error) => {
      // Error actions
    },
  });

  const handleToggleLikeProduct = () => {
    if (!isLikedByUser) {
      like(product._id);
    } else {
      unlike(product._id);
    }
  };

  const { isExpired, disCountPrice } = useMemo(() => {
    const isExpired = isExpiry(
      product?.discountStartDate,
      product?.discountEndDate
    );
    const disCountPrice =
      product?.discount && !isExpired
        ? product?.price - (product?.price * product?.discount) / 100
        : 0;
    return { isExpired, disCountPrice };
  }, [product]);

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
    const parseCart = cartLS ? JSON.parse(cartLS) : {};
    const convertedCartItems = convertAddProduct(cart, item);
    updateCart(convertedCartItems);
    if (user?._id) {
      setLocalProductToCart({ ...parseCart, [user._id]: convertedCartItems });
    }
  };

  console.log(product.name, disCountPrice);

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

      <div
        className="absolute w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center top-4 left-4 cursor-pointer"
        onClick={handleToggleLikeProduct}
      >
        <Heart
          className={`${isLikedByUser ? "fill-red-500 text-red-500" : ""}`}
        ></Heart>
      </div>
      <div
        className="absolute w-10 h-10  rounded-full  bg-white shadow-lg flex items-center justify-center top-4 right-4"
        onClick={(e) => {
          const mappedItem: CartItem = {
            name: product.name,
            amount: 1,
            discount: product.discount,
            image: product.image,
            price: disCountPrice ? disCountPrice : product.price,
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
            {disCountPrice ? (
              <>
                <p className="text-red-500 line-through text-sm">
                  {product?.price}$
                </p>
                <p className="text-base">{disCountPrice}$</p>
              </>
            ) : (
              <p className="text-base">{product.price}$</p>
            )}
            {/* Fix later */}
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
