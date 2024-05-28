import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import React, { ReactNode } from "react";

export default function Dashboard() {
  return <div>Dashboard</div>;
}
Dashboard.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
