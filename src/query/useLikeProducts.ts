import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavoriteProduct } from "@/services/product-public.services";
import { useAppContext } from "@/context/app.context";

const useMyFavorite = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const { user } = useAppContext();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery(
    ["my-favorite"],
    () => getFavoriteProduct(params),
    {
      enabled: Boolean(user?._id),
    }
  );

  const refetchFavoriteMe = () => {
    queryClient.invalidateQueries(["my-favorite"]);
  };

  let likedIds = data?.data?.data?.products.map((item) => item._id);

  return {
    likedMe: data?.data.data,
    likedIds,
    error,
    isLoading,
    refetchFavoriteMe,
  };
};

export default useMyFavorite;
