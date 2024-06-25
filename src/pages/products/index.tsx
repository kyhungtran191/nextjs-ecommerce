import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import ChairImage from "../../../public/chair-banner.png";
import Image from "next/image";
import { motion } from "framer-motion";
import CustomBreadCrumb from "@/components/custom-breadcrumb/CustomBreadCrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import SliderCustom from "./(components)/SliderCustom";
import ProductCard from "./(components)/ProductCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { identity, pickBy } from "lodash";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProductTypes } from "@/services/product-type.services";
import { getProductPublic } from "@/services/product-public.services";
import ComponentsLoading from "@/components/loading/ComponentsLoading";

export default function Products(props: { products: any }) {
  console.log(props.products);

  // Call API category  list later

  const [range, setRange] = useState([0, 1000]);

  const handleRangeChange = (value: number[]) => {
    setRange(value);
  };
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);

  const router = useRouter();

  const queryConfig = router.query;

  const typeProduct = useQuery({
    queryKey: ["product_types"],
    queryFn: () => getAllProductTypes(queryConfig),
    staleTime: 60 * 10,
    cacheTime: 60 * 10 * 10,
  });

  useEffect(() => {
    let categoriesString = queryConfig.category as string;
    setCategoriesSelected(categoriesString?.split("|") || []);
  }, [queryConfig]);

  console.log("categoryList", categoriesSelected);

  const handleToggleCategory = (id: string) => {
    if (categoriesSelected?.includes(id)) {
      const newQueryCategory = categoriesSelected.filter((item) => item != id);
      setCategoriesSelected(newQueryCategory);
      return router.push(
        {
          query: pickBy(
            { ...queryConfig, category: newQueryCategory.join("|") },
            identity
          ),
        },
        undefined,
        { scroll: false }
      );
    } else {
      const categoryArr = categoriesSelected && Array?.from(categoriesSelected);
      const newArr = categoryArr?.push(id as string);
      // setCategoriesSelected(newArr);
      return router.push(
        {
          query: { ...queryConfig, category: categoryArr?.join("|") },
        },
        undefined,
        { scroll: false }
      );
    }
  };
  return (
    <div>
      <div className="container-fluid">
        <section className="section p-10 bg-[#f1ebe9] min-h-[400px] rounded-2xl my-10  items-center relative hidden md:flex">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
            className="font-semibold text-2xl medium:text-4xl xl:text-5xl"
          >
            Explore a World of Chairs, <br />
            Crafted for You
          </motion.div>
          <motion.div
            initial={{ right: -10, opacity: 0.8 }}
            animate={{ right: 10, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
            className="w-[500px] h-[500px] object-cover absolute bottom-0 "
          >
            <Image
              src={ChairImage}
              width={0}
              height={0}
              alt="chair-banner"
              className="w-full h-full object-cover"
            ></Image>
          </motion.div>
        </section>
        <CustomBreadCrumb
          homeElement={"Home"}
          capitalizeLinks
        ></CustomBreadCrumb>
        <section className="my-5 grid grid-cols-1 medium:grid-cols-[250px_minmax(500px,_1fr)] gap-[20px]  medium:gap-[40px]">
          <div className="bg-[#383633] shadow-md min-h-[500px] p-4 text-[#f7eed8] rounded-lg  hidden medium:block ">
            <div>
              <h3 className="font-bold text-xl">Category</h3>
              <ul className="my-3 ml-2">
                {typeProduct.data?.data?.data?.productTypes.map(
                  (item, index) => (
                    <li className="flex items-center gap-2 py-1" key={index}>
                      <Checkbox
                        id="settings"
                        className="border-[#f7eed8]"
                        checked={categoriesSelected?.includes(item._id)}
                        onCheckedChange={() => handleToggleCategory(item._id)}
                      ></Checkbox>
                      <Label
                        htmlFor="settings"
                        className="text-sm font-bold cursor-pointer"
                      >
                        {item.name}
                      </Label>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl">Ratings</h3>
              <RadioGroup
                defaultValue="option-one"
                className="my-2 ml-2"
                onValueChange={(value) => {
                  router.replace({ query: { ...queryConfig, minStar: value } });
                }}
              >
                <div className="flex items-center space-x-2 py-1">
                  <RadioGroupItem
                    value="4.5"
                    id="half-five"
                    className="border-[#f7eed8]"
                  />
                  <Label htmlFor="half-five" className="font-bold">
                    More than 4.5
                  </Label>
                </div>
                <div className="flex items-center space-x-2 py-1">
                  <RadioGroupItem
                    value="4"
                    id="four"
                    className="border-[#f7eed8]"
                  />
                  <Label htmlFor="four" className="font-bold">
                    More than 4
                  </Label>
                </div>
                <div className="flex items-center space-x-2 py-1">
                  <RadioGroupItem
                    value="3"
                    id="three"
                    className="border-[#f7eed8]"
                  />
                  <Label htmlFor="three" className="font-bold">
                    More than 3
                  </Label>
                </div>
                <div className="flex items-center space-x-2 py-1">
                  <RadioGroupItem
                    value="2"
                    id="two"
                    className="border-[#f7eed8]"
                  />
                  <Label htmlFor="two" className="font-bold">
                    More than 2
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <h3 className="font-bold text-xl">Price Range ($)</h3>
              <SliderCustom
                className="w-[80%] mt-2"
                max={50000}
                min={1000}
                step={1}
                value={range}
                onValueChange={handleRangeChange}
                formatLabel={(value) => `${value}$`}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap">
              <h2 className="text-3xl font-semibold">Products</h2>
              <div className="flex items-center gap-2">
                <Drawer>
                  <DrawerTrigger className="px-6 py-2 bg-slate-200 text-black font-medium rounded-md block medium:hidden">
                    Filter
                  </DrawerTrigger>
                  <DrawerContent className="min-h-[40vh]">
                    <DrawerHeader>
                      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                      <DrawerDescription>
                        This action cannot be undone.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button>Submit</Button>
                      <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
                <div className="text-base font-medium">Sort By</div>
                <Select>
                  <SelectTrigger className="w-[180px] border-none bg-slate-200/50 font-semibold">
                    <SelectValue placeholder="Options" />
                  </SelectTrigger>
                  <SelectContent className="font-semibold">
                    <SelectItem value="selling">Best selling</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                    <SelectItem value="likes">Most Likes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
              {/* Product Item */}
              {!props.products.length && (
                <ComponentsLoading></ComponentsLoading>
              )}
              {props.products &&
                Array(6)
                  .fill(0)
                  .map((item, index) => (
                    <ProductCard key={index}></ProductCard>
                  ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export const getServerSideProps = async (context: any) => {
  // Fetch data from external API
  const query = context.query;
  console.log("server side query", query);
  const queryData = {
    page: query.page || "1",
    limit: query.limit || "10",
    productType: query.category || "",
    minStar: query.minStar || "",
    minPrice: query.minPrice || "",
    maxPrice: query.maxPrice || "",
    order: query.order || "",
    search: query.search || "",
  };

  const data = await getProductPublic(pickBy(queryData, identity));
  console.log(data.data);
  // Pass data to the page via props
  // Test render list
  return { props: data.data.data };
};
Products.authGuard = false;
Products.getLayout = (page: ReactNode) => <GeneralLayout>{page}</GeneralLayout>;
Products.title = "Furnitown Product List";
