export type TProductType = {
  name: string;
  slug: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type TProductTypeAdd = {
  name: string;
  slug: string;
};

export type ProductTypesDataList = {
  productTypes: TProductType[];
  totalPage: string;
  totalCount: string;
};
