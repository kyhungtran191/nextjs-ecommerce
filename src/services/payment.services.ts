import { ResponseData } from "@/@types/message.type";
import { PaymentDataList, TPayment, TPaymentAdd } from "@/@types/payment.type";
import { PAYMENTAPI } from "@/apis/payment.api";
import instanceAxios from "@/configs/axiosInstance";

export const createPayment = async (body: TPaymentAdd) =>
  instanceAxios.post<ResponseData<TPayment>>(`${PAYMENTAPI.PAYMENT}`, body);

export const getAllPayments = async (params?: any) =>
  instanceAxios.get<ResponseData<PaymentDataList>>(`${PAYMENTAPI.PAYMENT}`, {
    params,
  });

export const getDetailPayment = async (id: string) => {
  return instanceAxios.get<ResponseData<TPayment>>(
    `${PAYMENTAPI.PAYMENT}/${id}`
  );
};

export const updatePayment = async (body: { name: string }, id: string) =>
  instanceAxios.put<ResponseData<TPayment>>(
    `${PAYMENTAPI.PAYMENT}/${id}`,
    body
  );
// Define delete one
export const deleteDetailPayment = async (id: string) =>
  instanceAxios.delete<ResponseData<TPayment>>(`${PAYMENTAPI.PAYMENT}/${id}`);
// Define delete all
export const deleteMultiplePayment = async (body: {
  paymentTypeIds: string[];
}) =>
  instanceAxios.delete<ResponseData<TPayment>>(
    `${PAYMENTAPI.PAYMENT}/delete-many`,
    body as any
  );
