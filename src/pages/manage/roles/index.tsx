import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import React, { ReactNode } from "react";

export default function Roles() {
  return <div>Roles</div>;
}
Roles.getLayout = (page: ReactNode) => <AdminDashboard>{page}</AdminDashboard>;
