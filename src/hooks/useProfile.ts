import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile';
import { UpdateProfileRequest } from '../types/api';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileService.updateProfile(data),
    onSuccess: () => {
      // Invalidate profile query để refresh data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
