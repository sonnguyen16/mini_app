import { useQuery } from '@tanstack/react-query';
import { policiesService } from '../services/policies';

export const useMembershipPolicy = () => {
  return useQuery({
    queryKey: ['policies', 'membership'],
    queryFn: () => policiesService.getMembershipPolicy(),
    staleTime: 30 * 60 * 1000, // 30 phút
  });
};

export const usePrivacyPolicy = () => {
  return useQuery({
    queryKey: ['policies', 'privacy'],
    queryFn: () => policiesService.getPrivacyPolicy(),
    staleTime: 30 * 60 * 1000, // 30 phút
  });
};
