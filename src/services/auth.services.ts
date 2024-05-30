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

export const login = async (data: TLogin) =>
  await axios.post<ResponseData<ResponseLogin>>(AuthAPI.login, data);

export const register = async (data: TLogin) => {
  return await axios.post<ResponseData<ResponseLogin>>(AuthAPI.register, data);
};

export const profile = async () => {
  return await instanceAxios.get<ResponseData<User>>(AuthAPI.me);
};

export const logout = async () => await instanceAxios.post<{}>(AuthAPI.logout);
