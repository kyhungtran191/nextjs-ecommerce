import React from "react";

interface IProps {
  children: React.ReactNode;
}

export default function GeneralLayout({ children }: IProps) {
  return <div>{children}</div>;
}
