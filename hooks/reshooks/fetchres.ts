import { fetchAllRes, fetchMenu } from "@/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useFetchAll() {
  return useMutation({
    mutationFn: fetchAllRes,
  });
}

export const useRestaurantMenu = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: ["menu", restaurantId],
    queryFn: () => fetchMenu(restaurantId!),
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
