export type User = {
  _id: string;
  email: string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  status: number;
  likedProducts: string[];
  address: string;
  avatar?: string;
  city?: string;
  viewedProducts: string[];
  userType: number;
  addresses: string[];
  createdAt: string;
  updatedAt: string;
};

export type Role = {
  name: string;
  permissions: string[];
};

export type TLogin = {
  email: string;
  password: string;
};
