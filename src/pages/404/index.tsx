import React from "react";
import NotFoundImg from "../../../public/notFound.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center flex-col">
      <Image
        src={NotFoundImg}
        alt="not-found"
        width={0}
        height={0}
        className="w-[500px] h-[400px] object-cover"
      ></Image>
      <Link href="/">
        <Button className="bg-purple text-white">Back to Home</Button>
      </Link>
    </div>
  );
}
