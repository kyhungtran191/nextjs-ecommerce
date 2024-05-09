import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import React, { ReactNode } from "react";

export default function ManageIndex() {
  return <div>ManageIndex</div>;
}
ManageIndex.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
