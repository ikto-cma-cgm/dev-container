import { useQuery, UseQueryOptions } from '@tanstack/react-query'

export function useResource<TData, TError = Error>(
  key: string[],
  fetcher: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn: fetcher,
    ...options,
  })
}
