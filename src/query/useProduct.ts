import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetailProductPublicBySlug } from "@/services/product-public.services";

const useProduct = (slug: string) => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery(
    ["product", slug],
    () => getDetailProductPublicBySlug(slug),
    {
      enabled: !!slug,
    }
  );

  const refetchProduct = () => {
    queryClient.invalidateQueries(["product", slug]);
  };

  return {
    product: data?.data.data,
    error,
    isLoading,
    refetchProduct,
  };
};

export default useProduct;
