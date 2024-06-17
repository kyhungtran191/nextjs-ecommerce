import { getAllProductTypes } from "@/services/product-type.services";
import { getAllRole } from "@/services/role.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryProductType = () => {
  const { data } = useQuery({
    queryKey: ["product_types"],
    queryFn: getAllProductTypes,
  });
  return data?.data.data?.productTypes;
};
