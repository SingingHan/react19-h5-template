import { useQuery } from '@tanstack/react-query';
import { getServerInfoByQuery } from '@/services/demo';

export function useServerInfoQuery() {
  return useQuery({
    queryKey: ['server-info'],
    queryFn: getServerInfoByQuery,
    enabled: false
  });
}
