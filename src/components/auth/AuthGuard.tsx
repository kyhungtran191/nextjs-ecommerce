// ** React Imports

import { useAppContext } from "@/context/app.context";
import Login from "@/pages/login";
import { useRouter } from "next/router";
import { ReactNode, ReactElement, useEffect, useState } from "react";
import Spinner from "../Spinner";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuth, user } = useAppContext();
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!isAuth && router.pathname !== "/login") {
      router.replace({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    } else {
      setLoader(false);
    }
  }, [isAuth, router.pathname, router.asPath]);

  return (
    <>
      {loader && <Spinner></Spinner>}
      {!loader && children}
    </>
  );
};

export default AuthGuard;
