import { getAllRole } from "@/services/role.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryRole = () =>
  useQuery({
    queryKey: ["roles"],
    queryFn: getAllRole,
    staleTime: 10 * (60 * 1000),
    cacheTime: 15 * (60 * 1000),
  });
