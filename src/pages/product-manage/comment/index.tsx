import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import React, { ReactNode } from "react";

export default function ProductCommentPage() {
  return <div>ProductCommentPage</div>;
}
ProductCommentPage.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
