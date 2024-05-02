import React from "react";
import { MainNav } from "./MainNav";
import { Search } from "./Search";
import { UserNav } from "./UserNav";
import MenuMobile from "./MenuMobile";

export default function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6 md:block hidden" />
        <MenuMobile className="mx-6 md:hidden block"></MenuMobile>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
}
