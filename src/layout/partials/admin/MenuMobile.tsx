import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";
import { useRouter } from "next/router";
interface IProps {
  className: string;
}
export default function MenuMobile({ className }: IProps) {
  const router = useRouter();
  console.log(router.pathname);
  return (
    <div className={className}>
      <Sheet>
        <SheetTrigger asChild>
          <AlignJustify />
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Discover</SheetTitle>
          </SheetHeader>
          {/* Sidebar options here */}
          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
