import { NextComponentType } from "next";
import { ReactElement, ReactNode } from "react";
import { ACLObj } from "src/configs/acl";

declare module "next" {
  export declare type NextPage<P = {}, IP = P> = NextComponentType<
    NextPageContext,
    IP,
    P
  > & {
    acl?: ACLObj;
    authGuard?: boolean;
    guestGuard?: boolean;
    getLayout?: (page: ReactElement) => ReactNode;
  };
}
