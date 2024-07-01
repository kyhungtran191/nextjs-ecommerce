import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode } from "react";
import DashboardLayout from "../layout/DashboardLayout ";
import ProductCard from "@/pages/products/(components)/ProductCard";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFavoriteProduct } from "@/services/product-public.services";
import { Button } from "@/components/ui/button";
import { TProductPublic } from "@/@types/product.type";
import { useRouter } from "next/router";
import { identity, pickBy } from "lodash";
import PaginationCustom from "@/components/PaginationCustom";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import SkeletonCard from "@/components/SkeletonCard";

export default function Favorite() {
  const router = useRouter();
  const queryConfig = router.query;
  const queryData = {
    search: "",
    page: queryConfig.page || 1,
    limit: 6,
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["favorite-me"],
    queryFn: () => getFavoriteProduct(pickBy(queryData, identity)),
  });

  return (
    <>
      {" "}
      {!isLoading && (
        <div>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
            {/* Product Item */}

            {data?.data.data?.products?.map((product: TProductPublic) => (
              <ProductCard product={product} key={product._id}></ProductCard>
            ))}
          </div>
          <PaginationCustom
            pathname={router.pathname}
            queryConfig={queryConfig}
            totalPage={data?.data?.data?.totalPage as number}
          ></PaginationCustom>
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          {Array(6)
            .fill(0)
            .map((item, index) => (
              <SkeletonCard key={index}></SkeletonCard>
            ))}
        </div>
      )}
    </>
  );
}

Favorite.getLayout = (page: ReactNode) => (
  <GeneralLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </GeneralLayout>
);
Favorite.authGuard = true;
