export type TProductAdmin = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  countInStock: number;
  location?: string;
  discount?: string;
  description: string;
  discountStartDate: Date | null;
  discountEndDate: Date | null;
  type: string;
  status: number;
  createdAt: string;
};

export type TProductPublic = {
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
  likedBy: string[];
  totalLikes?: number;
  status: number;
  views: number;
  uniqueViews: never[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  totalReviews: number;
};

export type TProductAdd = {
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

// Generic type for Product List (Admin, Public)
export type ProductsDataList<Data> = {
  products: Data[];
  totalPage: number;
  totalCount: number;
};
