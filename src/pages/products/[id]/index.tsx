import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode } from "react";

export default function ProductDetail() {
  return (
    <div>
      <div className="container">
        <div>1</div>
      </div>
    </div>
  );
}

ProductDetail.authGuard = false;
ProductDetail.getLayout = (page: ReactNode) => (
  <GeneralLayout>{page}</GeneralLayout>
);
