import { httpClient } from '../libs/http';
import { 
  ApiResponse, 
  Category, 
  Voucher, 
  VouchersQuery, 
  LatestVouchersQuery,
  PaginatedResponse 
} from '../types/api';

export const catalogService = {
  /**
   * Lấy danh sách danh mục
   */
  async getCategories(): Promise<Category[]> {
    const response = await httpClient.get<ApiResponse<Category[]>>('/categories');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error as string || 'Không thể lấy danh sách danh mục');
  },

  /**
   * Lấy danh sách vouchers với filter
   */
  async getVouchers(query?: VouchersQuery): Promise<PaginatedResponse<Voucher>> {
    const params = new URLSearchParams();
    
    if (query?.category_id) {
      params.append('category_id', query.category_id.toString());
    }
    if (query?.keyword) {
      params.append('keyword', query.keyword);
    }
    if (query?.page) {
      params.append('page', query.page.toString());
    }
    if (query?.per_page) {
      params.append('per_page', query.per_page.toString());
    }

    const response = await httpClient.get<ApiResponse<PaginatedResponse<Voucher>>>(
      `/vouchers?${params.toString()}`
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error as string || 'Không thể lấy danh sách vouchers');
  },

  /**
   * Lấy vouchers mới nhất (HOT DEAL)
   */
  async getLatestVouchers(query?: LatestVouchersQuery): Promise<Voucher[]> {
    const params = new URLSearchParams();
    
    if (query?.limit) {
      params.append('limit', query.limit.toString());
    }

    const response = await httpClient.get<ApiResponse<Voucher[]>>(
      `/vouchers/latest?${params.toString()}`
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error as string || 'Không thể lấy vouchers mới nhất');
  },

  /**
   * Lấy chi tiết voucher theo ID
   */
  async getVoucherById(id: number): Promise<Voucher> {
    const response = await httpClient.get<ApiResponse<Voucher>>(`/vouchers/${id}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error as string || 'Không thể lấy thông tin voucher');
  },
};
