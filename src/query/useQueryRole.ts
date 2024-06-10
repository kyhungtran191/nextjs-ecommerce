import { getAllRole } from "@/services/role.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryRole = () =>
  useQuery({
    queryKey: ["roles"],
    queryFn: getAllRole,
  });

  
