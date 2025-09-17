import { httpClient } from '../libs/http';
import { ApiResponse, Profile, UpdateProfileRequest } from '../types/api';

export const profileService = {
  /**
   * Lấy thông tin profile
   */
  async getProfile(): Promise<Profile> {
    const response = await httpClient.get<ApiResponse<Profile>>('/me');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error as string || 'Không thể lấy thông tin profile');
  },

  /**
   * Cập nhật profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<Profile> {
    const response = await httpClient.put<ApiResponse<Profile>>('/me', data);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error as string || 'Cập nhật profile thất bại');
  },
};
