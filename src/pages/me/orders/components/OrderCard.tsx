import { TItemOrderProduct, TItemOrderProductMe } from "@/@types/order.type";
import { ORDER_STATUS } from "@/constants/order";
import Image from "next/image";
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { convertUpdateMultipleProductsCart, formatDate } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelMyOrder } from "@/services/order.services";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getLocalProductCart, setLocalProductToCart } from "@/utils/auth";
import { useCartStore } from "@/stores/cart.store";
import { useAppContext } from "@/context/app.context";
import { useRouter } from "next/router";
export default function OrderCard({ item }: { item: TItemOrderProductMe }) {
  const { mutate: cancel } = useMutation({
    mutationFn: (id: string) => cancelMyOrder(id),
  });
  const { user } = useAppContext();
  const queryClient = useQueryClient();
  const { cart, updateCart } = useCartStore();
  const router = useRouter();

  const handleUpdateProductToCart = (items: TItemOrderProduct[]) => {
    const productCart = getLocalProductCart();
    const parseData = productCart ? JSON.parse(productCart) : {};
    const listOrderItems = convertUpdateMultipleProductsCart(cart, items);
    console.log(listOrderItems);
    if (user?._id) {
      updateCart(listOrderItems);
      setLocalProductToCart({
        ...parseData,
        [user._id]: listOrderItems,
      });
    }
  };

  const handleBuyAgain = () => {
    if (isSoldOut) return;
    Swal.fire({
      title: "Are you sure to buy again this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I want to buy again",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const items = item?.orderItems?.map((prd) => ({
          name: prd.name,
          amount: prd.amount,
          image: prd.image,
          price: prd.price,
          discount: prd.discount,
          product: prd?.product,
          slug: prd?.product?.slug,
        }));
        handleUpdateProductToCart(items as any);
        router.push("/my-cart");
      }
    });
  };

  const isSoldOut = useMemo(() => {
    return item?.orderItems?.some((item) => item.product.countInStock < 0);
  }, [item]);

  const handleCancelOrder = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        cancel(id, {
          onSuccess: () => {
            toast.success(`Cancel order-${id} successfully!`);
            queryClient.invalidateQueries(["orders-me"]);
          },
        });
      }
    });
  };

  return (
    <div className="p-6 my-4  bg-white rounded-lg min-h-[300px] shadow-md">
      <div className="flex items-center justify-between  pb-5 border-b">
        <div className="font-bold text-sm text-slate-600">
          {formatDate(item?.createdAt)}
        </div>
        <div
          className={`${
            item?.status === 3 ? "text-red-500" : ""
          } font-bold text-purple`}
        >
          {ORDER_STATUS[item?.status]?.label}
        </div>
      </div>
      <div className="mt-4 max-h-[400px] overflow-y-auto ">
        {item?.orderItems?.map((item) => (
          <div
            className="flex items-start gap-4 my-2 pb-3 border-b"
            key={item?.name}
          >
            <Image
              width={0}
              height={0}
              className="w-[100px] h-[100px] object-cover"
              src={item?.image}
              alt="product"
            ></Image>
            <div className="space-y-2">
              <h2 className="font-semibold text-lg">{item?.name}</h2>
              <h3 className="text-base font-medium">{item?.price} $</h3>
              <h3 className="text-sm font-medium">X{item?.amount}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-x-4 py-4 shadow-inner">
        {item?.status == 0 && (
          <Button
            variant={"outline"}
            className="border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-white"
            onClick={() => handleCancelOrder(item?._id)}
          >
            Cancel Order
          </Button>
        )}
        {item?.status === 3 && (
          <Button
            variant={"outline"}
            className={`border-green-500 text-green-500 font-bold hover:bg-green-500 hover:text-white ${
              isSoldOut ? "pointer-events-none" : "pointer-events-auto"
            }`}
            disabled={isSoldOut}
            onClick={handleBuyAgain}
          >
            Buy again
          </Button>
        )}

        <Button
          variant={"outline"}
          className="border-blue-500 text-blue-500 font-bold hover:bg-blue-500 hover:text-white"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
