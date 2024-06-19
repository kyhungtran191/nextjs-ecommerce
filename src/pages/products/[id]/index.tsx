import GeneralLayout from "@/layout/GeneralLayout";
import Image from "next/image";
import React, { ReactNode } from "react";
import ImageSample from "../../../../public/bedroom.jpg";
import CustomBreadCrumb from "@/components/custom-breadcrumb/CustomBreadCrumb";
import { Eye, HeartIcon, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "../(components)/ProductCard";
export default function ProductDetail() {
  return (
    <div className="">
      <div className="grid grid-cols-12 gap-10 items-start">
        <div className="col-span-7">
          <Image
            src={ImageSample}
            alt="sample"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="col-span-5 p-10">
          <CustomBreadCrumb
            homeElement="Home"
            capitalizeLinks
          ></CustomBreadCrumb>
          <div className="mt-5">
            <h1 className="text-5xl font-medium mb-2">Block Nomad Sofa</h1>
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-slate-500 text-base">
                  <p>1</p>
                  <Eye className="w-5 h-5 mx-1"></Eye>
                </div>
                <div className="flex items-center text-slate-500  text-base">
                  <p>1</p>
                  <HeartIcon className="w-5 h-5 mx-1"></HeartIcon>
                </div>
              </div>
              <div></div>
            </div>
            <h3 className="text-xl font-bold mb-2">Category</h3>
            <div className="flex items-center gap-3 my-3">
              <div className="flex items-center">
                {Array(5)
                  .fill(0)
                  .map((item, index) => (
                    <Star fill="#f7d100" strokeWidth={0} key={index} />
                  ))}
              </div>
              <p className="font-bold text-xl">4.9</p>
              <p className="text-slate-500 font-medium text-sm">140 Reviews</p>
              <div className="h-5 bg-slate-500 w-[2px]"></div>
              <p className="text-slate-500 font-medium text-sm">140 Sold</p>
            </div>
            <div className="flex items-center gap-3 my-3">
              <h3 className="text-4xl font-bold my-3">$5873</h3>
              <p className="text-3xl text-slate-500 line-through">$6873</p>
            </div>
            <div className="flex items-center gap-3 my-3">
              <Select defaultValue="1">
                <SelectTrigger className="w-[100px] bg-slate-200 font-bold">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="font-semibold text-slate-500 text-sm">
                500 Available
              </div>
            </div>
            <div className="flex items-center gap-2 my-10">
              <Button className="px-10 bg-yellow-600">Buy Now</Button>
              <Button className="px-10 bg-green-800">Add To Cart</Button>
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="description" className="w-full mt-5">
        <TabsList className="w-full gap-2">
          <TabsTrigger
            value="description"
            className="w-full py-3 font-semibold data-[state=active]:bg-[#383633] data-[state=active]:text-[#f7eed8] "
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="w-full  py-3  font-semibold data-[state=active]:bg-[#383633] data-[state=active]:text-[#f7eed8] "
          >
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="w-full  py-3  font-semibold data-[state=active]:bg-[#383633] data-[state=active]:text-[#f7eed8]  "
          >
            FAQ
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="p-10">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="reviews" className="p-10">
          Change your password here.
        </TabsContent>
        <TabsContent value="faq" className="p-10">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger hidden>Is it accessible?</AccordionTrigger>
              <AccordionContent className="py-3">
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="py-3">
              <AccordionTrigger hidden>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="py-3">
              <AccordionTrigger hidden>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It animated by default, but you can disable it if you
                prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
      <div className="section">
        <div className="p-5">
          <h2 className="section-heading">Similarity Product</h2>
          <div className="grid grid-cols-4 gap-5">
            {/* Product Item */}
            {Array(6)
              .fill(0)
              .map((item, index) => (
                <ProductCard key={index}></ProductCard>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
/** * Title
 * Price
 * Discount Price(optional)
 * type
 * Total likes
 * views
 * Bottom
 * 1. description
 * 2. Reviews
 * 3. HDBQ

 */
ProductDetail.authGuard = false;
ProductDetail.getLayout = (page: ReactNode) => (
  <GeneralLayout>{page}</GeneralLayout>
);
