import { getAllDelivery } from "@/services/delivery.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryDelivery = () => {
  return useQuery({
    queryKey: ["delivery-type"],
    queryFn: getAllDelivery,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
