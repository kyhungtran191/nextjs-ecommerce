import {
  DeliveryDataList,
  TDelivery,
  TDeliveryAdd,
} from "@/@types/delivery.type";
import { ResponseData } from "@/@types/message.type";
import { DELIVERYAPI } from "@/apis/delivery.api";
import instanceAxios from "@/configs/axiosInstance";

export const createDelivery = async (body: { name: string }) =>
  instanceAxios.post<ResponseData<TDelivery>>(`${DELIVERYAPI.DELIVERY}`, body);

export const getAllDelivery = async (params?: any) =>
  instanceAxios.get<ResponseData<DeliveryDataList>>(`${DELIVERYAPI.DELIVERY}`, {
    params,
  });

export const getDetailDelivery = async (id: string) => {
  return instanceAxios.get<ResponseData<TDelivery>>(
    `${DELIVERYAPI.DELIVERY}/${id}`
  );
};

export const updateDelivery = async (body: TDeliveryAdd, id: string) =>
  instanceAxios.put<ResponseData<TDelivery>>(
    `${DELIVERYAPI.DELIVERY}/${id}`,
    body
  );
// Define delete one
export const deleteDetailDelivery = async (id: string) =>
  instanceAxios.delete<ResponseData<TDelivery>>(
    `${DELIVERYAPI.DELIVERY}/${id}`
  );
// Define delete all
export const deleteMultipleDelivery = async (body: {
  deliveryTypeIds: string[];
}) =>
  instanceAxios.delete<ResponseData<TDelivery>>(
    `${DELIVERYAPI.DELIVERY}/delete-many`,
    body as any
  );
