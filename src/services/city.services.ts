import { City, CityDataList } from "@/@types/city.type";
import { ResponseData } from "@/@types/message.type";
import { CityAPI } from "@/apis/city.api";
import instanceAxios from "@/configs/axiosInstance";

export const createCity = async (body: { name: string }) =>
  instanceAxios.post<ResponseData<City>>(`${CityAPI.CITY}`, body);

export const getAllCities = async (params?: any) =>
  instanceAxios.get<ResponseData<CityDataList>>(`${CityAPI.CITY}`, {
    params,
  });

export const getDetailCity = async (id: string) => {
  return instanceAxios.get<ResponseData<City>>(`${CityAPI.CITY}/${id}`);
};

export const updateCity = async (body: { name: string }, id: string) =>
  instanceAxios.put<ResponseData<City>>(`${CityAPI.CITY}/${id}`, body);
// Define delete one
export const deleteDetailCity = async (id: string) =>
  instanceAxios.delete<ResponseData<City>>(`${CityAPI.CITY}/${id}`);
// Define delete all
export const deleteMultipleCity = async (body: { cityIds: string[] }) =>
  instanceAxios.delete<ResponseData<City>>(
    `${CityAPI.CITY}/delete-many`,
    body as any
  );
