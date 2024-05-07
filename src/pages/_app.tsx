// ** React Imports
import { ReactNode } from "react";
import "@/styles/globals.css";
// ** Next Imports
import Head from "next/head";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

// ** Store Imports

// ** Loader Import
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
// ** Config Imports
import GuestGuard from "@/components/auth/GuestGuard";
import FallbackSpinner from "@/components/FallbackSpinner";
import AuthGuard from "@/components/auth/AuthGuard";
import AclGuard from "@/components/auth/AclGuard";
import { defaultACLObj } from "@/configs/acl";

// ** Third Party Import
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Poppins } from "next/font/google";
import GeneralLayout from "@/layout/GeneralLayout";
import Router from "next/router";
import { AppContextProvider } from "@/context/app.context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosInterceptor } from "@/configs/axiosInstance";
import { ThemeProvider } from "@/components/theme-provider";
import Fallback from "@/components/Spinner";
// ** Contexts

// ** Global css styles

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
    return <GuestGuard>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard>{children}</AuthGuard>;
  }
};
// Font family
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function App(props: ExtendedAppProps) {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => <>{page}</>);

  const authGuard = Component.authGuard ?? false;

  const guestGuard = Component.guestGuard ?? false;

  const aclAbilities = Component.acl ?? defaultACLObj;

  // Query Client (React Query)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <main className={poppins.className}>
      <Head>
        <title>HShop</title>
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ToastContainer></ToastContainer>
          <AppContextProvider>
            <AxiosInterceptor>
              <Guard authGuard={authGuard} guestGuard={guestGuard}>
                <AclGuard
                  aclAbilities={aclAbilities}
                  guestGuard={guestGuard}
                  authGuard={authGuard}
                >
                  {getLayout(<Component {...pageProps} />)}
                  <ProgressBar
                    height="2px"
                    color="purple"
                    options={{ showSpinner: false }}
                    shallowRouting
                  />
                </AclGuard>
              </Guard>
            </AxiosInterceptor>
          </AppContextProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </main>
  );
}
