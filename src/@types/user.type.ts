import { RoleData } from "./role.type";

export type TUser = {
  _id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  role: RoleData;
  phoneNumber: string;
  avatar?: string;
  city?: string;
  status?: number;
  userType?: number;
  addresses?: TUserAddress[];
};

export type TUserAddress = {
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  address: string;
  city: string;
  isDefault: boolean;
  _id?: string;
};

export type TUserAdd = Pick<
  TUser,
  | "email"
  | "firstName"
  | "middleName"
  | "lastName"
  | "password"
  | "phoneNumber"
  | "status"
> & { role: string };

export type UserDataList = {
  users: TUser[];
  totalPage: string;
  totalCount: string;
};
