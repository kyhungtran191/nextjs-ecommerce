import { RoleData } from "./role.type";

export type TUser = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  role?: RoleData;
  phoneNumber: string;
  address?: string;
  avatar?: string;
  city?: string;
  status?: number;
  userType?: number;
  addresses?: any[];
};

export type UserDataList = {
  users: TUser[];
  totalPage: string;
  totalCount: string;
};
