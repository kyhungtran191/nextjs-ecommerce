// ** React Imports
import { useAppContext } from "@/context/app.context";
import { getAccessTokenFromLS, getUserFromLS } from "@/utils/auth";
import { useRouter } from "next/router";
import { ReactNode, ReactElement, useEffect, useState } from "react";
import ComponentsLoading from "../loading/ComponentsLoading";

interface GuestGuardProps {
  children: ReactNode;
}
const GuestGuard = (props: GuestGuardProps) => {
  const { children } = props;
  const { isAuth, user } = useAppContext();
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (isAuth) {
      console.log(1);
      router.replace("/");
    } else {
      setLoader(false);
    }
  }, [router.route]);

  return (
    <>
      {loader && <ComponentsLoading></ComponentsLoading>}
      {!loader && children}
    </>
  );
};

export default GuestGuard;
