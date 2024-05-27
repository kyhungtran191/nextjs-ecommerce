import { ResponseData } from "@/@types/message.type";
import { RoleData, RoleDataList } from "@/@types/role.type";
import { RoleAPI } from "@/apis/role.api";
import instanceAxios from "@/configs/axiosInstance";

export const createRole = async (body: { name: string }) =>
  await instanceAxios.post<ResponseData<RoleData>>(`${RoleAPI.ROLE}`, body);

export const getAllRole = async () =>
  await instanceAxios.get<ResponseData<RoleDataList>>(`${RoleAPI.ROLE}`);

export const updateRole = async (body: {
  name?: string;
  permissions?: string[];
  id: string;
}) => {
  const { id, ...data } = body;
  return await instanceAxios.put<ResponseData<RoleData>>(
    `${RoleAPI.ROLE}/${id}`,
    data
  );
};
export const getDetailRole = async (id: string) =>
  await instanceAxios.get<ResponseData<RoleData>>(`${RoleAPI.ROLE}`, {
    params: {
      roleId: id,
    },
  });

// Define delete one
// Define delete all
