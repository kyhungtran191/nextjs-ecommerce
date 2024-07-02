import { getAllPayments } from "@/services/payment.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryPayment = () => {
  return useQuery({
    queryKey: ["payment"],
    queryFn: getAllPayments,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
