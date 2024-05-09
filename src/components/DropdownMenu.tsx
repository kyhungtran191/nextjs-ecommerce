import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/router";

type TDropdownItem = {
  title: string;
  icon: LucideIcon;
  children?: TDropdownItem[];
  link: string;
};
export default function DropdownMenu({ items }: { items: TDropdownItem[] }) {
  const router = useRouter();
  console.log(router);
  const handleClickItem = (item: TDropdownItem) => {
    if (item.children) return;
    router.push(item.link);
  };
  return (
    <>
      {items &&
        items.length > 0 &&
        items.map((item) => (
          <Accordion
            type="multiple"
            className={`w-full p-2 text-md`}
            key={item.title}
          >
            <AccordionItem value="item-1" className="border-none py-0">
              {/* Title + ICON */}
              <AccordionTrigger
                className={`p-2  rounded-lg  font-medium ${
                  router.asPath.startsWith(item.link)
                    ? "bg-purple bg-opacity-90 text-white"
                    : "bg-white text-black"
                }`}
                hidden={Boolean(item.children)}
                onClick={() => handleClickItem(item)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${
                      router.asPath.startsWith(item.link)
                        ? "bg-purple text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <item.icon></item.icon>
                  </div>
                  {item.title}
                </div>
              </AccordionTrigger>
              {/* Check if has children */}
              {item.children && item.children.length > 0 && (
                <AccordionContent>
                  <DropdownMenu items={item.children}></DropdownMenu>
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
        ))}
    </>
  );
}
