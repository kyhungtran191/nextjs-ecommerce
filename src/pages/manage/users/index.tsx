import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import React, { ReactNode } from "react";

export default function Users() {
  return <div>Users</div>;
}
Users.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
