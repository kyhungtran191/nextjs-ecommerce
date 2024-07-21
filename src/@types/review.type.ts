import { User } from "./auth.type";

export type TReview = {
  content: string;
  star: number;
  product: string;
  user: User | string;
};
export type ReviewList  = {
  reviews: TReview[];
  totalPage: number;
  totalCount: number;
};
