import { ResponseData } from "@/@types/message.type";
import { RoleData, RoleDataList } from "@/@types/role.type";
import { TUser, UserDataList } from "@/@types/user.type";
import { UserAPI } from "@/apis/user.api";
import instanceAxios from "@/configs/axiosInstance";

export const createUser = async (body: TUser) =>
  instanceAxios.post<ResponseData<TUser>>(`${UserAPI.USER}`, body);

export const getAllUser = async (params?: any) =>
  instanceAxios.get<ResponseData<UserDataList>>(`${UserAPI.USER}`);

// export const getAllUser = async()
// Define delete one
// Define delete all
