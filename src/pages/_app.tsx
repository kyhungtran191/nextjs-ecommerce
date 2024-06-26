// ** React Imports
import React, { ReactNode } from "react";
import "@/styles/globals.css";

// ** Next Imports
import Head from "next/head";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import localforage from "localforage";

// ** Store Imports

// ** Loader Import
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
// ** Config Imports
import GuestGuard from "@/components/auth/GuestGuard";
import AuthGuard from "@/components/auth/AuthGuard";
import AclGuard from "@/components/auth/AclGuard";
import { defaultACLObj } from "@/configs/acl";

// ** Third Party Import
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Poppins } from "next/font/google";
import { AppContextProvider } from "@/context/app.context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosInterceptor } from "@/configs/axiosInstance";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import useDetectIsLoadingSSR from "@/hooks/useDetectIsLoadingSSR";
// ** Contexts

// ** Global css styles
if (typeof document === "undefined") {
  React.useLayoutEffect = React.useEffect;
}
type ExtendedAppProps = AppProps & {
  Component: NextPage;
};

type GuardProps = {
  authGuard: boolean;
  guestGuard: boolean;
  children: ReactNode;
};

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return (
      <GuestGuard fallback={<ComponentsLoading></ComponentsLoading>}>
        {children}
      </GuestGuard>
    );
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return (
      <AuthGuard fallback={<ComponentsLoading></ComponentsLoading>}>
        {children}
      </AuthGuard>
    );
  }
};
// Font family
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const persistConfig = {
  key: "root",
  storage: localforage,
};

export default function App(props: ExtendedAppProps) {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => <>{page}</>);

  const authGuard = Component.authGuard ?? false;

  const guestGuard = Component.guestGuard ?? false;

  const aclAbilities = Component.acl ?? defaultACLObj;

  const permissions = Component.permissions ?? [];

  const title = Component.title ? Component.title : "Furnitown";
  // Query Client (React Query)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const { isLoading } = useDetectIsLoadingSSR();

  return (
    <main className={poppins.className}>
      <Head>
        <title>{title}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer></ToastContainer>
        <AppContextProvider>
          <AxiosInterceptor>
            <Guard authGuard={authGuard} guestGuard={guestGuard}>
              <AclGuard
                permissions={permissions}
                aclAbilities={aclAbilities}
                guestGuard={guestGuard}
                authGuard={authGuard}
              >
                {getLayout(<Component {...pageProps} />)}
                <ProgressBar height="2px" color="#c3b1ff" shallowRouting />
                {isLoading && (
                  <div className="fixed inset-0 bg-white/35 flex items-center justify-center">
                    <ComponentsLoading></ComponentsLoading>
                  </div>
                )}
              </AclGuard>
            </Guard>
          </AxiosInterceptor>
        </AppContextProvider>
      </QueryClientProvider>
    </main>
  );
}
