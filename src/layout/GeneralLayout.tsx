import React from "react";
import Header from "./partials/Header";

interface IProps {
  children: React.ReactNode;
}

export default function GeneralLayout({ children }: IProps) {
  return (
    <>
      <Header></Header>
      <div className="container">{children}</div>
    </>
  );
}
