import { ResponseData } from "@/@types/message.type";
import { ReviewList, TReview } from "@/@types/review.type";

import { ReviewAPI } from "@/apis/review.api";
import instanceAxios from "@/configs/axiosInstance";
import axios from "axios";

export const createReview = async (body: TReview) =>
  instanceAxios.post<ResponseData<TReview>>(`${ReviewAPI.INDEX}`, body);

export const getAllReview = async (params?: any) =>
  await axios.get<ResponseData<ReviewList>>(`${ReviewAPI.INDEX}`, {
    params,
  });

export const getDetailReview = async (id: string) => {
  return await instanceAxios.get<ResponseData<TReview>>(
    `${ReviewAPI.INDEX}/${id}`
  );
};

export const updateMyReview = async (body: TReview, id: string) => {
  console.log(body, id);
  return await instanceAxios.put<ResponseData<TReview>>(
    `${ReviewAPI.INDEX}/${id}`,
    body
  );
};

export const deleteMyReview = async (id: string) => {
  return await instanceAxios.delete(`${ReviewAPI.INDEX}/me/${id}`);
};

export const deleteMultipleReview = async (body: { reviewIds: string[] }) => {
  return await instanceAxios.delete<{}>(
    `${ReviewAPI.INDEX}/delete-many`,
    body as any
  );
};
