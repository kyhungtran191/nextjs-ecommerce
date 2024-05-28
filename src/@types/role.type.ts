import { ResponseData } from "./message.type";

export type RoleData = {
  _id: string;
  name: string;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type RoleDataList = {
  roles: RoleData[];
  totalPage: string;
  totalCount: string;
};
