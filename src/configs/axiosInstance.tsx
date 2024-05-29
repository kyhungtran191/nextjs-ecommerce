import { useAppContext } from "@/context/app.context";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { jwtDecode } from "jwt-decode";
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshToken,
  saveAccessTokenToLS,
  saveRefreshTokenToLS,
} from "@/utils/auth";
import { toast } from "react-toastify";
import { URL } from "@/apis";
const instanceAxios = axios.create({
  baseURL: URL,
});

let isRefreshing = false;
let refreshQueue: any[] = [];

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  let { setIsAuth, setUser } = useAppContext();
  let queryClient = useQueryClient();
  instanceAxios.interceptors.request.use(async function (
    config: AxiosRequestConfig
  ) {
    let accessToken = getAccessTokenFromLS();
    let refreshToken = getRefreshToken();
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      if ((decoded.exp as number) > Date.now() / 1000) {
        if (config && config?.headers) {
          config.headers.authorization = ` Bearer ${accessToken}`;
        }
        return config;
      } else {
        if (refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;
            await axios
              .post(refreshToken, { accessToken, refreshToken })
              .then((res) => {
                if (res && res?.data?.responseData) {
                  const {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                  } = res?.data?.responseData;

                  if (newRefreshToken) {
                    saveRefreshTokenToLS(newRefreshToken);
                  }
                  if (newAccessToken) {
                    if (config && config?.headers) {
                      config.headers.authorization = `Bearer ${newAccessToken}`;
                    }
                    saveAccessTokenToLS(newAccessToken);
                    refreshQueue.forEach((cb) => cb(newAccessToken));
                    refreshQueue = [];
                    // Check false
                    isRefreshing = false;
                  } else {
                    toast.error("Không có access và refresh");
                  }
                }
                return config;
              })
              .catch((error) => {
                toast.error("Refresh Token Timeout!");
                clearLS();
                setUser(undefined);
                setIsAuth(false);
                queryClient.clear();
                return router.replace("/login");
              });
          } else {
            return new Promise<any>((resolve) => {
              refreshQueue.push((newAccessToken: string) => {
                if (config && config.headers) {
                  config.headers.authorization = `Bearer ${newAccessToken}`;
                  return resolve(config);
                }
              });
            });
          }
        } else {
          clearLS();
          setUser(undefined);
          setIsAuth(false);
          queryClient.clear();
          return router.replace("/login");
        }
      }
    }
    return config;
  });
  instanceAxios.interceptors.response.use((response) => {
    return response;
  });
  return <>{children}</>;
};

export default instanceAxios;
export { AxiosInterceptor };
