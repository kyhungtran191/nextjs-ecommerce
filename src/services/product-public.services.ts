import { ResponseData } from "@/@types/message.type";
import { ProductsDataList, TProductPublic } from "@/@types/product.type";
import { ProductAPI } from "@/apis/product.api";
import axios from "axios";

export const getProductPublic = async (params: any) =>
  axios.get<ResponseData<TProductPublic[]>>(`${ProductAPI.PUBLIC}`, {
    params,
  });

export const getDetailProductPublic = async (id: string) =>
  axios.get<ResponseData<TProductPublic>>(`${ProductAPI.PUBLIC}/${id}`);

export const getRelatedProduct = async (params: any) =>
  axios.get<ResponseData<ProductsDataList<TProductPublic>>>(
    `${ProductAPI.RELATED}`,
    {
      params,
    }
  );
