export type User = {
  _id: string;
  email: string;
  password: string;
  role: Role;
  status: number;
  likedProducts: string[];
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
