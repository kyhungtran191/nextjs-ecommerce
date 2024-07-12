import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getMeOrder } from "@/services/order.services";
import OrderCard from "./components/OrderCard";
import { TParamsGetMeProduct } from "@/@types/order.type";
import SkeletonCard from "@/components/SkeletonCard";
import PaginationCustom from "@/components/PaginationCustom";

export default function Orders() {
  const [status, setStatus] = useState<string>("4");

  const router = useRouter();
  const queryParams = router.query;

  const queryConfig: TParamsGetMeProduct = {
    limit: Number(queryParams?.limit) || 4,
    page: Number(queryParams?.page) || 1,
    status: status !== "4" ? Number(status) : undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["orders-me", queryConfig],
    queryFn: () => getMeOrder(queryConfig),
  });

  return (
    <Tabs
      defaultValue={status}
      className="w-full medium:mt-5"
      value={status}
      onValueChange={(value) => {
        router.replace("/me/orders");
        setStatus(value);
      }}
    >
      <TabsList className="w-full gap-2">
        <TabsTrigger
          value="4"
          className="w-full py-3 font-semibold data-[state=active]:bg-[black] data-[state=active]:text-[#f7eed8]"
        >
          All
        </TabsTrigger>
        <TabsTrigger
          value="0"
          className="w-full py-3 font-semibold data-[state=active]:bg-[black] data-[state=active]:text-[#f7eed8] "
        >
          Wait Payment
        </TabsTrigger>
        <TabsTrigger
          value="1"
          className="w-full py-3 font-semibold data-[state=active]:bg-[black] data-[state=active]:text-[#f7eed8]  "
        >
          Wait delivery
        </TabsTrigger>
        <TabsTrigger
          value="2"
          className="w-full  py-3  font-semibold data-[state=active]:bg-[black] data-[state=active]:text-[#f7eed8]  "
        >
          Done
        </TabsTrigger>
        <TabsTrigger
          value="3"
          className="w-full  py-3  font-semibold data-[state=active]:bg-[black] data-[state=active]:text-[#f7eed8]  "
        >
          Cancelled
        </TabsTrigger>
      </TabsList>

      <TabsContent value="4" className="">
        {isLoading &&
          Array(4)
            .fill(0)
            .map((item, index) => <SkeletonCard key={index}></SkeletonCard>)}
        {!isLoading &&
          data?.data.data?.orders.map((item) => (
            <OrderCard item={item} key={item._id}></OrderCard>
          ))}
        <PaginationCustom
          queryConfig={{ page: queryConfig.page, limit: queryConfig.limit }}
          pathname={router.pathname}
          totalPage={data?.data?.data?.totalPage as number}
        ></PaginationCustom>
        {!isLoading && !data?.data?.data?.totalCount && (
          <div className="text-center font-semibold my-5">No Data</div>
        )}
      </TabsContent>
      <TabsContent value="0" className="">
        {isLoading &&
          Array(4)
            .fill(0)
            .map((item, index) => <SkeletonCard key={index}></SkeletonCard>)}
        {!isLoading &&
          data?.data.data?.orders.map((item) => (
            <OrderCard item={item} key={item._id}></OrderCard>
          ))}
        <PaginationCustom
          queryConfig={{ page: queryConfig.page, limit: queryConfig.limit }}
          pathname={router.pathname}
          totalPage={data?.data?.data?.totalPage as number}
        ></PaginationCustom>
        {!isLoading && !data?.data?.data?.totalCount && (
          <div className="text-center font-semibold my-5">No Data</div>
        )}
      </TabsContent>
      <TabsContent value="1" className="">
        {isLoading &&
          Array(4)
            .fill(0)
            .map((item, index) => <SkeletonCard key={index}></SkeletonCard>)}
        {!isLoading &&
          data?.data.data?.orders.map((item) => (
            <OrderCard item={item} key={item._id}></OrderCard>
          ))}
        <PaginationCustom
          queryConfig={{ page: queryConfig.page, limit: queryConfig.limit }}
          pathname={router.pathname}
          totalPage={data?.data?.data?.totalPage as number}
        ></PaginationCustom>
        {!isLoading && !data?.data?.data?.totalCount && (
          <div className="text-center font-semibold my-5">No Data</div>
        )}
      </TabsContent>
      <TabsContent value="2" className="">
        {isLoading &&
          Array(4)
            .fill(0)
            .map((item, index) => <SkeletonCard key={index}></SkeletonCard>)}
        {!isLoading &&
          data?.data.data?.orders.map((item) => (
            <OrderCard item={item} key={item._id}></OrderCard>
          ))}
        <PaginationCustom
          queryConfig={{ page: queryConfig.page, limit: queryConfig.limit }}
          pathname={router.pathname}
          totalPage={data?.data?.data?.totalPage as number}
        ></PaginationCustom>
        {!isLoading && !data?.data?.data?.totalCount && (
          <div className="text-center font-semibold my-5">No Data</div>
        )}
      </TabsContent>
      <TabsContent value="3" className="">
        {isLoading &&
          Array(4)
            .fill(0)
            .map((item, index) => <SkeletonCard key={index}></SkeletonCard>)}
        {!isLoading &&
          data?.data.data?.orders.map((item) => (
            <OrderCard item={item} key={item._id}></OrderCard>
          ))}
        <PaginationCustom
          queryConfig={{ page: queryConfig.page, limit: queryConfig.limit }}
          pathname={router.pathname}
          totalPage={data?.data?.data?.totalPage as number}
        ></PaginationCustom>
        {!isLoading && !data?.data?.data?.totalCount && (
          <div className="text-center font-semibold my-5">No Data</div>
        )}
      </TabsContent>
    </Tabs>
  );
}
Orders.getLayout = (page: ReactNode) => (
  <GeneralLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </GeneralLayout>
);
Orders.authGuard = true;
