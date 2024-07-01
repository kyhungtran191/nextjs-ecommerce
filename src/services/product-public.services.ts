import { ResponseData } from "@/@types/message.type";
import { ProductsDataList, TProductPublic } from "@/@types/product.type";
import { ProductAPI } from "@/apis/product.api";
import instanceAxios from "@/configs/axiosInstance";
import axios from "axios";

export const getProductPublic = async (params: any) =>
  axios.get<ResponseData<TProductPublic[]>>(`${ProductAPI.PUBLIC}`, {
    params,
  });

export const getDetailProductPublicBySlug = async (
  slug: string,
  isViewed?: boolean
) => {
  const data = { params: { isPublic: true, isViewed } };
  return axios.get<ResponseData<TProductPublic>>(
    `${ProductAPI.PUBLIC}/slug/${slug}`,
    data
  );
};

export const getRelatedProduct = async (params: any) =>
  axios.get<ResponseData<ProductsDataList<TProductPublic>>>(
    `${ProductAPI.RELATED}`,
    {
      params,
    }
  );

export const likeProduct = async (body: { productId: string }) => {
  return await instanceAxios.post<ResponseData<TProductPublic[]>>(
    `${ProductAPI.ADMIN}/like`,
    body
  );
};

export const unlikeProduct = async (body: { productId: string }) => {
  return await instanceAxios.post<ResponseData<TProductPublic[]>>(
    `${ProductAPI.ADMIN}/unlike`,
    body
  );
};

export const getFavoriteProduct = async ({
  page = 1,
  limit = 6,
}: // search = "",
{
  page?: number;
  // search?: string;
  limit?: number;
}) => {
  return await instanceAxios.get<
    ResponseData<ProductsDataList<TProductPublic>>
  >(`${ProductAPI.ADMIN}/liked/me`, {
    params: {
      page,
      limit,
    },
  });
};
