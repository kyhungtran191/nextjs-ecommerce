import { URL } from ".";

export const AuthAPI = {
  login: `${URL}/auth/login`,
  register: `${URL}/auth/register`,
  refreshToken: `${URL}/auth/refresh-token`,
  logout: `${URL}/auth/logout`,
  me: `${URL}/auth/me`,
  changePassword: `${URL}/auth/change-password`,
  forgotPassword: `${URL}/auth/forgot-password`,
  resetPassword: `${URL}/auth/reset-password`,
};
