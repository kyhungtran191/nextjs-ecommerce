export type TPayment = {
  name: string;
  type: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type TPaymentAdd = {
  name: string;
  type: string;
};

export type PaymentDataList = {
  paymentTypes: TPayment[];
  totalPage: string;
  totalCount: string;
};
