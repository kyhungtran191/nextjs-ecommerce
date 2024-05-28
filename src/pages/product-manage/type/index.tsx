import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import React, { ReactNode } from "react";

export default function ProductType() {
  return <div>ProductType</div>;
}
ProductType.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
