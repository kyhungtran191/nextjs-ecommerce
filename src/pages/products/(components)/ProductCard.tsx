import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProductImage from "../../../../public/dining.jpg";
export default function ProductCard() {
  return (
    <Link href="#" className="relative">
      <Image
        src={ProductImage}
        alt=""
        width="0"
        height="0"
        className="h-[280px] sm:h-[360px] w-full object-cover rounded-2xl"
      ></Image>
      <div className="absolute w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center top-4 left-4">
        <Heart></Heart>
      </div>
      <div className="p-2">
        <div className="flex items-center justify-between ">
          <h2 className="font-medium text-lg">Nova Bliss Chair</h2>
          <div className="flex items-center font-semibold gap-2">
            <p className="text-red-500 line-through text-sm">$400</p>
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
    </Link>
  );
}
