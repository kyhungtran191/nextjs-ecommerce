export type TDelivery = {
  name: string;
  price: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type TDeliveryAdd = {
  name: string;
  price: number;
};

export type DeliveryDataList = {
  deliveryTypes: TDelivery[];
  totalPage: string;
  totalCount: string;
};
