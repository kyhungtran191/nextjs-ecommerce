import { ResponseData } from "@/@types/message.type";
import { TReview } from "@/@types/review.type";

import { ReviewAPI } from "@/apis/review.api";
import instanceAxios from "@/configs/axiosInstance";
import axios from "axios";

export const createReview = async (body: TReview) =>
  instanceAxios.post<ResponseData<TReview>>(`${ReviewAPI.INDEX}`, body);

export const getAllProductAdmin = async (params?: any) =>
  await axios.get<ResponseData<TReview[]>>(`${ReviewAPI.INDEX}`, {
    params,
  });

export const getDetailReview = async (id: string) => {
  return await instanceAxios.get<ResponseData<TReview>>(
    `${ReviewAPI.INDEX}/${id}`
  );
};

export const updateMyReview = async (body: TReview, id: string) =>
  await instanceAxios.put<ResponseData<TReview>>(
    `${ReviewAPI.INDEX}/me/${id}`,
    body
  );

export const deleteMyReview = async (id: string) => {
  return await instanceAxios.delete(`${ReviewAPI.INDEX}/me/${id}`);
};

export const deleteMultipleReview = async (body: { reviewIds: string[] }) => {
  return await instanceAxios.delete<{}>(
    `${ReviewAPI.INDEX}/delete-many`,
    body as any
  );
};
