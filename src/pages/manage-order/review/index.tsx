import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import React, { ReactNode } from "react";

export default function ReviewPage() {
  return <div>ReviewPage</div>;
}
ReviewPage.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
