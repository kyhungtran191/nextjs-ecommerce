import { ResponseData } from "@/@types/message.type";
import { TUser, TUserAdd, UserDataList } from "@/@types/user.type";
import { UserAPI } from "@/apis/user.api";
import instanceAxios from "@/configs/axiosInstance";

export const createUser = async (body: TUserAdd) =>
  instanceAxios.post<ResponseData<TUser>>(`${UserAPI.USER}`, body);

export const getAllUser = async (params?: any) =>
  instanceAxios.get<ResponseData<UserDataList>>(`${UserAPI.USER}`, {
    params,
  });

export const getDetailUser = async (id: string) => {
  return instanceAxios.get<ResponseData<TUser>>(`${UserAPI.USER}/${id}`);
};

export const updateUser = async (body: TUserAdd, id: string) =>
  instanceAxios.put<ResponseData<TUser>>(`${UserAPI.USER}/${id}`, body);
