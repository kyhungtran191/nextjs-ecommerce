import { ResponseData } from "@/@types/message.type";
import { RoleData, RoleDataList } from "@/@types/role.type";
import { RoleAPI } from "@/apis/role.api";
import instanceAxios from "@/configs/axiosInstance";

export const createRole = (body: { name: string }) =>
  instanceAxios.post<ResponseData<RoleData>>(`${RoleAPI}`, body);

export const getAllRole = () =>
  instanceAxios.get<ResponseData<RoleDataList>>(`${RoleAPI}`);

export const getDetailRole = (id: string) =>
  instanceAxios.get<ResponseData<RoleData>>(`${RoleAPI}`, {
    params: {
      roleId: id,
    },
  });

// Define delete one
// Define delete all
