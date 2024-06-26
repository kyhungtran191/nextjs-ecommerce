import { User } from "@/@types/auth.type";
import { CartItem } from "@/@types/cart.type";
import { toast } from "react-toastify";

export const LocalStorageEventTarget = new EventTarget();

export const saveAccessTokenToLS = (accessToken: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("access_token", accessToken);
  }
};

export const clearAccessTokenFromLS = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
};

export const getAccessTokenFromLS = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("access_token") || "";
  }
  return null;
};

export const saveRefreshTokenToLS = (accessToken: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("refresh_token", accessToken);
  }
};

export const clearRefreshToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("refresh_token");
  }
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token") || "";
  }
  return null;
};

export const saveUserToLS = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getUserFromLS = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : {};
  }
  return {};
};

export const clearUserFromLS = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

export const clearLS = () => {
  clearRefreshToken();
  clearAccessTokenFromLS();
  clearUserFromLS();
};

export const setLocalProductToCart = (data: Record<string, CartItem[]>) => {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("cart", JSON.stringify(data));
    } catch (err) {
      console.log(err);
      toast.error("Cart Storage is full");
    }
  }
};

export const getLocalProductCart = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("cart");
  }

  return "";
};

// export const savePermissions = (permissions) => {
//   try {
//     const permissionsJSON = JSON.stringify(permissions);
//     localStorage.setItem("permissions", permissionsJSON);
//   } catch (error) {
//     console.error("Error saving permissions to local storage", error);
//   }
// };

// export const getPermissions = () => {
//   try {
//     const permissionsJSON = localStorage.getItem("permissions");
//     return permissionsJSON ? JSON.parse(permissionsJSON) : null;
//   } catch (error) {
//     console.error("Error retrieving permissions from local storage", error);
//     return null;
//   }
// };

// export const deletePermissions = () => {
//   try {
//     localStorage.removeItem("permissions");
//   } catch (error) {
//     console.error("Error deleting permissions from local storage", error);
//   }
// };
