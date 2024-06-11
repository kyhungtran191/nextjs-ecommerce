type TProduct = {
  name: string;
  slug: string;
  image: string;
  price: number;
  countInStock: number;
  description: string;
  discount: number;
  discountStartDate: null;
  discountEndDate: null;
  type: string;
  likedBy: never[];
  totalLikes: number;
  status: number;
  views: number;
  uniqueViews: never[];
  _id: string;
  createdAt: string;
  updatedAt: string;
};

type TProductAdd = {
  name: string;
  slug: string;
  image?: string;
  location?: string;
  price: number;
  countInStock: number;
  description?: string;
  discount?: number;
  sold?: number;
  type: string;
  discountStartDate?: string;
  discountEndDate?: string;
  status?: number;
};

export type ProductsDataList = {
  productTypes: TProduct[];
  totalPage: number;
  totalCount: number;
};
