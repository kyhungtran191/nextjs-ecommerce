import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode, useState } from "react";
import ChairImage from "../../../public/chair-banner.png";
import Image from "next/image";
import { motion } from "framer-motion";
import CustomBreadCrumb from "@/components/custom-breadcrumb/CustomBreadCrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SliderCustom } from "./(components)/SliderCustom";
import ProductImage from "../../../public/dining.jpg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import Link from "next/link";
export default function Products() {
  const categoriesList = [
    {
      title: "Category",
      children: [
        {
          title: "Seating",
          link: "/settings/payment",
        },
        {
          title: "Outdoor",
          link: "/settings/payment",
        },
        {
          title: "Outdoor",
          link: "/settings/payment",
        },
      ],
    },
  ];

  const [range, setRange] = useState([0, 1000]);

  const handleRangeChange = (value: number[]) => {
    setRange(value);
  };

  return (
    <div>
      <div className="container">
        <section className="section p-10 bg-[#f1ebe9] min-h-[400px] rounded-2xl my-10 flex items-center relative">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
            className="font-semibold text-5xl"
          >
            Explore a World of Chairs, <br />
            Crafted for You
          </motion.div>
          <motion.div
            initial={{ right: -10, opacity: 0.8 }}
            animate={{ right: 80, opacity: 1 }}
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
        <section className="my-5 grid grid-cols-1 md:grid-cols-[250px_minmax(500px,_1fr)] gap-[20px]  medium:gap-[40px]">
          <div className="bg-[#383633] shadow-md min-h-[500px] p-4 text-[#f7eed8] rounded-lg sticky">
            <div>
              <h3 className="font-bold text-xl">Category</h3>
              <ul className="my-3 ml-2">
                {Array(6)
                  .fill(0)
                  .map((item, index) => (
                    <li className="flex items-center gap-2 py-1" key={index}>
                      <Checkbox
                        id="settings"
                        className="border-[#f7eed8]"
                      ></Checkbox>
                      <Label
                        htmlFor="settings"
                        className="text-sm font-bold cursor-pointer"
                      >
                        Seating
                      </Label>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl">Ratings</h3>
              <RadioGroup
                defaultValue="option-one"
                className="my-2 ml-2"
                onValueChange={(value) => console.log(value)}
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
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-semibold">Products</h2>
              <div className="flex items-center gap-2">
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
            <div className="grid grid-cols-3 gap-5">
              {/* Product Item */}
              {Array(6)
                .fill(0)
                .map((item, index) => (
                  <Link href="#" key={index}>
                    <Image
                      src={ProductImage}
                      alt=""
                      width="0"
                      height="0"
                      className="h-[360px] w-full object-cover rounded-2xl"
                    ></Image>
                    <div className="p-2">
                      <div className="flex items-center justify-between ">
                        <h2 className="font-medium text-lg">
                          Nova Bliss Chair
                        </h2>
                        <div className="flex items-center font-semibold gap-2">
                          <p className="text-red-500 line-through text-sm">
                            $400
                          </p>
                          <p className="text-base">$400</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-end gap-1">
                          <div className="flex items-center">
                            {Array(5)
                              .fill(0)
                              .map((item, index) => (
                                <Star
                                  fill="#f7d100"
                                  strokeWidth={0}
                                  key={index}
                                />
                              ))}
                          </div>
                          <span className="text-slate-500 text-sm font-semibold">
                            (51)
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

Products.authGuard = false;
Products.getLayout = (page: ReactNode) => <GeneralLayout>{page}</GeneralLayout>;
