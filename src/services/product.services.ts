import { ResponseData } from "@/@types/message.type";
import {
  ProductsDataList,
  TProductAdd,
  TProductAdmin,
} from "@/@types/product.type";
import { ProductAPI } from "@/apis/product.api";
import instanceAxios from "@/configs/axiosInstance";

// Admi
export const createProduct = async (body: TProductAdd) =>
  instanceAxios.post<ResponseData<TProductAdmin>>(`${ProductAPI.ADMIN}`, body);

export const getAllProductAdmin = async (params?: any) =>
  instanceAxios.get<ResponseData<ProductsDataList<TProductAdmin>>>(
    `${ProductAPI.ADMIN}`,
    {
      params,
    }
  );

export const getDetailProductAdmin = async (id: string) => {
  return instanceAxios.get<ResponseData<TProductAdmin>>(
    `${ProductAPI.ADMIN}/${id}`
  );
};

export const updateProductAdmin = async (body: TProductAdd, id: string) =>
  instanceAxios.put<ResponseData<TProductAdmin>>(
    `${ProductAPI.ADMIN}/${id}`,
    body
  );

// Client
/**
 * public
 * related
 * detail
 * like
 * unlike
 * delete
 */
