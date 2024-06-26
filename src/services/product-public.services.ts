import { ResponseData } from "@/@types/message.type";
import { ProductsDataList, TProductPublic } from "@/@types/product.type";
import { ProductAPI } from "@/apis/product.api";
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
