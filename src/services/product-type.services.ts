import { ResponseData } from "@/@types/message.type";
import { ProductTypesDataList, TProductType } from "@/@types/product-type.type";
import { ProductTypesAPI } from "@/apis/product-type.api";
import instanceAxios from "@/configs/axiosInstance";

export const createProductType = async (body: { name: string }) =>
  instanceAxios.post<ResponseData<TProductType>>(
    `${ProductTypesAPI.INDEX}`,
    body
  );

export const getAllProductTypes = async (params?: any) =>
  instanceAxios.get<ResponseData<ProductTypesDataList>>(
    `${ProductTypesAPI.INDEX}`,
    {
      params,
    }
  );

export const getDetailProductType = async (id: string) => {
  return instanceAxios.get<ResponseData<TProductType>>(
    `${ProductTypesAPI.INDEX}/${id}`
  );
};

export const updateProductType = async (body: { name: string }, id: string) =>
  instanceAxios.put<ResponseData<TProductType>>(
    `${ProductTypesAPI.INDEX}/${id}`,
    body
  );
