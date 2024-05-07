import { TLogin, User } from "@/@types/auth.type";
import { ResponseData } from "@/@types/message.type";
import { AuthAPI } from "@/apis/auth.api";
import instanceAxios from "@/configs/axiosInstance";
import axios from "axios";

export type ResponseLogin = {
  typeError: string;
  user?: User | null;
  access_token: string;
  refresh_token: string;
  message: string;
  status: string;
};

export const login = (data: TLogin) =>
  axios.post<ResponseData<ResponseLogin>>(AuthAPI.login, data);

export const register = (data: TLogin) => {
  return axios.post<ResponseData<ResponseLogin>>(AuthAPI.register, data);
};

export const logout = () => instanceAxios.post<{}>(AuthAPI.logout);
