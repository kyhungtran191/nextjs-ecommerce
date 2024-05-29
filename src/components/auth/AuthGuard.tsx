// ** React Imports

import { useAppContext } from "@/context/app.context";
import Login from "@/pages/login";
import { useRouter } from "next/router";
import { ReactNode, ReactElement, useEffect, useState } from "react";
import ComponentsLoading from "../loading/ComponentsLoading";
import { clearLS } from "@/utils/auth";

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = (props: AuthGuardProps) => {
  // ** Props
  const { children, fallback } = props;
  // ** auth
  const authContext = useAppContext();

  // ** router
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (
      !window.localStorage.getItem("user") &&
      !window.localStorage.getItem("access_token") &&
      !window.localStorage.getItem("refresh_token") &&
      !authContext.isAuth
    ) {
      if (router.asPath !== "/" && router.asPath !== "/login") {
        router.replace({
          pathname: "/login",
          query: { returnUrl: router.asPath },
        });
      } else {
        router.replace("/login");
      }
      authContext.setUser(undefined);
      clearLS();
    }
  }, [router.route]);

  if (!authContext.isAuth || (authContext.isAuth && !authContext.user?._id)) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
