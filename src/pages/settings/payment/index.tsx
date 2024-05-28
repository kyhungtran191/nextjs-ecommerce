import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import React, { ReactNode } from "react";

export default function PaymentPage() {
  return <div>PaymentPage</div>;
}
PaymentPage.getLayout = (page: ReactNode) => (
  <AdminDashboard>{page}</AdminDashboard>
);
