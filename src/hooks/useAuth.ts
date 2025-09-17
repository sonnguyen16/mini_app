import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth";
import { LoginRequest, Profile, UpdateProfileRequest } from "../types/api";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      // Cache user profile sau khi login thành công
      queryClient.setQueryData(["profile"], data.profile);
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};

export const useProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getMe(),
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateMe(data),
    onSuccess: (updatedProfile) => {
      // Cập nhật cache với profile mới
      queryClient.setQueryData(["profile"], updatedProfile);
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
};
