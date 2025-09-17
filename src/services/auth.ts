import { httpClient, setAuthToken } from '../libs/http';
import { ApiResponse, LoginRequest, LoginResponse, Profile, UpdateProfileRequest } from '../types/api';

export const authService = {
  /**
   * Đăng nhập qua Secret Key
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    
    if (response.data.success && response.data.data) {
      // Lưu token vào memory và set cho http client
      setAuthToken(response.data.data.token);
      return response.data.data;
    }
    
    throw new Error(response.data.error as string || 'Đăng nhập thất bại');
  },

  /**
   * Đăng xuất
   */
  logout(): void {
    setAuthToken(null);
  },

  /**
   * Lấy thông tin profile hiện tại
   */
  async getMe(): Promise<Profile> {
    const response = await httpClient.get<ApiResponse<Profile>>('/me');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error as string || 'Không thể lấy thông tin profile');
  },

  /**
   * Cập nhật profile
   */
  async updateMe(data: UpdateProfileRequest): Promise<Profile> {
    const response = await httpClient.put<ApiResponse<Profile>>('/me', data);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error as string || 'Cập nhật profile thất bại');
  },
};
