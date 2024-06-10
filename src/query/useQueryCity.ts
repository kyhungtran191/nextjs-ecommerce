import { getAllCities } from "@/services/city.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryCities = () =>
  useQuery({
    queryKey: ["cities"],
    queryFn: getAllCities,
  });
