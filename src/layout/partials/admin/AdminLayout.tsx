import { Metadata } from "next";
import Image from "next/image";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "./menu";
import { Sidebar } from "./Sidebar";
import Header from "./Header";

export const metadata: Metadata = {
  title: "Music App",
  description: "Example music app using the components.",
};

export interface IProps {
  children?: React.ReactNode;
}

export default function AdminDDashboard({ children }: IProps) {
  return (
    <>
      <div className="">
        {/* Header */}
        <Header></Header>
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              {/* Sidebar */}
              <Sidebar className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
