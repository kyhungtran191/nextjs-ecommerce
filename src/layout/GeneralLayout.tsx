import React from "react";
import Header from "./partials/Header";
import Footer from "./partials/Footer";

interface IProps {
  children: React.ReactNode;
}

export default function GeneralLayout({ children }: IProps) {
  return (
    <>
      <Header></Header>
      <div className="flex flex-col min-h-screen">{children}</div>
      <Footer></Footer>
    </>
  );
}
