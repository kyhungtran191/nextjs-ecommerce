import { ResponseData } from "@/@types/message.type";
import {
  OrderMeResult,
  TItemOrderProductMe,
  TParamsCreateOrderProduct,
  TParamsGetMeProduct,
  TParamsGetOrderProducts,
} from "@/@types/order.type";
import { OrderAPI } from "@/apis/orders.api";
import instanceAxios from "@/configs/axiosInstance";

export const createOrder = async (body: TParamsCreateOrderProduct) =>
  await instanceAxios.post<ResponseData<{}>>(`${OrderAPI.INDEX}`, body);

export const getMeOrder = async (params: TParamsGetMeProduct) =>
  await instanceAxios.get<ResponseData<OrderMeResult>>(`${OrderAPI.INDEX}/me`, {
    params,
  });

export const cancelMyOrder = async (id: string) =>
  await instanceAxios.post<ResponseData<{}>>(
    `${OrderAPI.INDEX}/me/cancel/${id}`
  );

// export const getAllCities = async (params?: any) =>
//   instanceAxios.get<ResponseData<{}>>(`${CityAPI.CITY}`, {
//     params,
//   });
