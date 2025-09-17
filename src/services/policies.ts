import { httpClient } from '../libs/http';
import { PolicyResponse } from '../types/api';

export const policiesService = {
  /**
   * Lấy điều khoản thành viên
   */
  async getMembershipPolicy(): Promise<string> {
    const response = await httpClient.get<PolicyResponse>('/policies/membership');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Không thể lấy chính sách thành viên');
  },

  /**
   * Lấy chính sách bảo mật
   */
  async getPrivacyPolicy(): Promise<string> {
    const response = await httpClient.get<PolicyResponse>('/policies/privacy');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Không thể lấy chính sách bảo mật');
  },
};
