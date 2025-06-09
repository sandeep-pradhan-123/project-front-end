import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { fetchApi, ApiResponse } from '../lib/api';


// Example hook for fetching data
export function useFetchData<T>(
  endpoint: string,
  queryKey: string | string[],
  options?: UseQueryOptions<ApiResponse<T>, Error, ApiResponse<T>, string[]>
) {
  const queryKeyArray = Array.isArray(queryKey) ? queryKey : [queryKey];
  
  return useQuery<ApiResponse<T>, Error, ApiResponse<T>, string[]>({
    queryKey: queryKeyArray,
    queryFn: () => fetchApi<T>(endpoint),
    ...options,
  });
}

// Example hook for posting data
export function usePostData<T, U>(endpoint: string) {
  return useMutation<ApiResponse<U>, Error, T>({
    mutationFn: (data: T) => 
      fetchApi<U>(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}

// Example hook for updating data
export function useUpdateData<T, U>(endpoint: string) {
  return useMutation<ApiResponse<U>, Error, T>({
    mutationFn: (data: T) => 
      fetchApi<U>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  });
}

// Example hook for deleting data
export function useDeleteData<T>(endpoint: string) {
  return useMutation<ApiResponse<T>, Error, void>({
    mutationFn: () => 
      fetchApi<T>(endpoint, {
        method: 'DELETE',
      }),
  });
} 