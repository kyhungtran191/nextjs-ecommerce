import Link from "next/link";
import React, { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/router";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  return (
    <div className="container-fluid bg-white rounded-lg">
      <div className="my-5 text-center font-semibold text-2xl">
        Account Management
      </div>
      <div className="flex gap-8 mt-5  min-h-[70vh]">
        <aside className="flex-[1] flex flex-col items-center justify-start py-10  rounded-lg shadow-lg  font-semibold gap-6">
          {/* Include shared UI here e.g. a sidebar */}
          <Link
            href="/me"
            className={`hover:font-bold px-3 py-2 rounded-lg w-full text-center ${
              router.asPath == "/me"
                ? "bg-purple text-white"
                : "bg-white text-[#969595] "
            }`}
          >
            Profile
          </Link>
          <Link
            href="/me/orders"
            className={`hover:font-bold px-3 py-2 rounded-lg w-full text-center ${
              router.asPath.startsWith("/me/orders")
                ? "bg-purple text-white"
                : "bg-white text-[#969595] "
            }`}
          >
            Orders
          </Link>
          <Link
            href="/me/favorite"
            className={`hover:font-bold px-3 py-2 rounded-lg w-full text-center ${
              router.asPath.startsWith("/me/favorite")
                ? "bg-purple text-white"
                : "bg-white text-[#969595] "
            }`}
          >
            Favorite
          </Link>
        </aside>
        <div className=" flex-[8] p-6 rounded shadow-lg">{children}</div>
      </div>
    </div>
  );
};
export default DashboardLayout;
