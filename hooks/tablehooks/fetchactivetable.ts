import { fetchActiveResTable } from '@/api/api';
import { useMutation } from '@tanstack/react-query';

// Define the input type for better type safety
interface FetchActiveTableParams {
  restaurantId: string;
  bookingFor: string | null;
  endTime: string | null;
}

export const useFetchActiveTableMutation = () => {
  return useMutation({
    mutationFn: ({ restaurantId, bookingFor, endTime }: FetchActiveTableParams) =>
      fetchActiveResTable(restaurantId, bookingFor, endTime),
    onError: (error) => {
      console.error('Error fetching active tables:', error);
    }
  });
};
