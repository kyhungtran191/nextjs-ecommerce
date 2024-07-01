import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode } from "react";
import DashboardLayout from "../layout/DashboardLayout ";

export default function Orders() {
  return <div>Orders</div>;
}
Orders.getLayout = (page: ReactNode) => (
  <GeneralLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </GeneralLayout>
);
Orders.authGuard = true;
