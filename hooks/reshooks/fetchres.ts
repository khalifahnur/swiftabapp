import { fetchAllRes, fetchMenu } from "@/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useFetchAll() {
  return useMutation({
    mutationFn: fetchAllRes,
    onSuccess: (data) => {
      console.log("fetched successful:");
    },
    onError: (error) => {
      console.error("fetch error:", error.message);
    },
  });
};


export const useRestaurantMenu = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => fetchMenu(restaurantId!),
    enabled: !!restaurantId, 
    staleTime: 1000 * 60 * 5,
    retry: 2, 
  });
};
