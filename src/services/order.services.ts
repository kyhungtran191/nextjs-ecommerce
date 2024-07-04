import { ResponseData } from "@/@types/message.type";
import { TParamsCreateOrderProduct } from "@/@types/order.type";
import { OrderAPI } from "@/apis/orders.api";
import instanceAxios from "@/configs/axiosInstance";

export const createOrder = async (body: TParamsCreateOrderProduct) =>
  await instanceAxios.post<ResponseData<{}>>(`${OrderAPI.INDEX}`, body);

// export const getAllCities = async (params?: any) =>
//   instanceAxios.get<ResponseData<{}>>(`${CityAPI.CITY}`, {
//     params,
//   });
