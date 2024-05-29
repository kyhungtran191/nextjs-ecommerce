// ** React Imports
import { useAppContext } from "@/context/app.context";
import { getAccessTokenFromLS, getUserFromLS } from "@/utils/auth";
import { useRouter } from "next/router";
import { ReactNode, ReactElement, useEffect, useState } from "react";
import ComponentsLoading from "../loading/ComponentsLoading";

interface GuestGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}
const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props;

  // ** router
  const router = useRouter();

  // ** auth
  const authContext = useAppContext();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (
      window.localStorage.getItem("access_token") &&
      window.localStorage.getItem("refresh_token")
    ) {
      router.replace("/");
    }
  }, [router.route]);

  if (authContext.isAuth && authContext.user) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;
