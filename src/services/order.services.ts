import { ResponseData } from "@/@types/message.type";
import {
  OrderMeResult,
  TItemOrderProductMe,
  TParamsCreateOrderProduct,
  TParamsGetMeProduct,
} from "@/@types/order.type";
import { OrderAPI } from "@/apis/orders.api";
import instanceAxios from "@/configs/axiosInstance";

export const createOrder = async (body: TParamsCreateOrderProduct) =>
  await instanceAxios.post<ResponseData<{}>>(`${OrderAPI.INDEX}`, body);

export const getMeOrder = async (params: TParamsGetMeProduct) =>
  await instanceAxios.get<ResponseData<OrderMeResult>>(`${OrderAPI.INDEX}/me`, {
    params,
  });

export const getDetailMeOrder = async (id: string) =>
  await instanceAxios.get<ResponseData<TItemOrderProductMe>>(
    `${OrderAPI.INDEX}/me/${id}`
  );

export const cancelMyOrder = async (id: string) =>
  await instanceAxios.post<ResponseData<{}>>(
    `${OrderAPI.INDEX}/me/cancel/${id}`
  );

export const getAllOrders = async (params?: any) =>
  instanceAxios.get<ResponseData<OrderMeResult>>(`${OrderAPI.INDEX}`, {
    params,
  });

export const updateStatusOrders = async (
  id: string,
  body: { status: number }
) => {
  return await instanceAxios.put<ResponseData<TItemOrderProductMe>>(
    `${OrderAPI.INDEX}/${id}`,
    body
  );
};
