import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode, useMemo } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cancelMyOrder, getDetailMeOrder } from "@/services/order.services";
import SkeletonCard from "@/components/SkeletonCard";
import Image from "next/image";
import CustomBreadCrumb from "@/components/custom-breadcrumb/CustomBreadCrumb";
import { ORDER_STATUS } from "@/constants/order";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app.context";
import { useCartStore } from "@/stores/cart.store";
import { TItemOrderProduct } from "@/@types/order.type";
import { getLocalProductCart, setLocalProductToCart } from "@/utils/auth";
import { convertUpdateMultipleProductsCart } from "@/utils/helper";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function OrderDetail() {
  const router = useRouter();
  const id = router.query.id;
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["order-me-detail", id],
    queryFn: () => getDetailMeOrder(id as string),
    enabled: !!id,
  });
  const { mutate: cancel } = useMutation({
    mutationFn: (id: string) => cancelMyOrder(id),
  });
  const { user } = useAppContext();
  const { cart, updateCart } = useCartStore();

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
        const items = orderInfo?.orderItems?.map((prd) => ({
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

  const orderInfo = data && data?.data?.data;
  console.log(data?.data.data);
  const isSoldOut = useMemo(() => {
    return orderInfo?.orderItems?.some((item) => item.product.countInStock < 0);
  }, [orderInfo]);

  const handleCancelOrder = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        cancel(id, {
          onSuccess: () => {
            toast.success(`Cancel order-${id} successfully!`);
            refetch();
          },
        });
      }
    });
  };

  return (
    <div>
      <CustomBreadCrumb homeElement="Home"></CustomBreadCrumb>
      <div className="py-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Shipping Information</h2>
          <div
            className={`${
              orderInfo?.status === 3 ? "text-red-500" : ""
            } font-bold text-purple`}
          >
            {ORDER_STATUS[orderInfo?.status as number]?.label}
          </div>
        </div>
        <div className="my-3 text-sm ">
          <h3 className="mb-1">{orderInfo?.shippingAddress.fullName}</h3>
          <p className="mb-1">{orderInfo?.shippingAddress.phone}</p>
          <p className="mb-1">
            {orderInfo?.shippingAddress.address}{" "}
            {orderInfo?.shippingAddress.city.name}
          </p>
        </div>
      </div>
      <div className="py-4">
        <h2 className="font-bold">Order Items</h2>
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading &&
            Array(4)
              .fill(0)
              .map((item, index) => <SkeletonCard key={index}></SkeletonCard>)}
          {!isLoading &&
            orderInfo?.orderItems?.map((item) => (
              <div
                className="flex items-start gap-4 my-2 pb-3 "
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
      </div>
      <div className="py-4">
        <Table className="border border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left font-bold text-base text-black">
                OrderID - {orderInfo?._id}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold text-right border-r">
                Items Price
              </TableCell>
              <TableCell className="text-right font-medium">
                {orderInfo?.itemsPrice}$
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold text-right border-r">
                Shipping Price
              </TableCell>
              <TableCell className="text-right font-medium">
                {orderInfo?.shippingPrice}$
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={1} className="font-bold text-right border-r">
                Total
              </TableCell>
              <TableCell className="text-right font-medium">
                {orderInfo?.totalPrice}$
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-x-4 py-4 shadow-inner">
        {orderInfo?.status == 0 && (
          <Button
            variant={"outline"}
            className="border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-white"
            onClick={() => handleCancelOrder(orderInfo?._id)}
          >
            Cancel Order
          </Button>
        )}
        {orderInfo?.status === 3 && (
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
      </div>
    </div>
  );
}

OrderDetail.getLayout = (page: ReactNode) => (
  <GeneralLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </GeneralLayout>
);
OrderDetail.authGuard = true;
