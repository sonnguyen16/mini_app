import { httpClient } from "../libs/http";
import {
  ApiResponse,
  WalletItem,
  WalletQuery,
  RedeemVoucherResponse,
  HistoryItem,
  HistoryQuery,
  PaginatedResponse,
} from "../types/api";

export const walletService = {
  /**
   * Đổi voucher
   */
  async redeemVoucher(voucherId: number): Promise<RedeemVoucherResponse> {
    const response = await httpClient.post<ApiResponse<RedeemVoucherResponse>>(
      `/vouchers/${voucherId}/redeem`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error((response.data.error as string) || "Đổi voucher thất bại");
  },

  /**
   * Sử dụng voucher
   */
  async useVoucher(code: string): Promise<WalletItem> {
    const response = await httpClient.post<ApiResponse<WalletItem>>(
      `/wallet/${code}/use`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      (response.data.error as string) || "Sử dụng voucher thất bại"
    );
  },

  /**
   * Lấy ví voucher
   */
  async getWallet(query?: WalletQuery): Promise<PaginatedResponse<WalletItem>> {
    const params = new URLSearchParams();

    if (query?.status) {
      params.append("status", query.status);
    }
    if (query?.page) {
      params.append("page", query.page.toString());
    }
    if (query?.per_page) {
      params.append("per_page", query.per_page.toString());
    }

    const response = await httpClient.get<
      ApiResponse<PaginatedResponse<WalletItem>>
    >(`/wallet?${params.toString()}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      (response.data.error as string) || "Không thể lấy ví voucher"
    );
  },

  /**
   * Lấy lịch sử giao dịch
   */
  async getHistory(
    query?: HistoryQuery
  ): Promise<PaginatedResponse<HistoryItem>> {
    const params = new URLSearchParams();

    if (query?.type) {
      params.append("type", query.type);
    }
    if (query?.limit) {
      params.append("limit", query.limit.toString());
    }
    if (query?.page) {
      params.append("page", query.page.toString());
    }
    if (query?.per_page) {
      params.append("per_page", query.per_page.toString());
    }

    const response = await httpClient.get<
      ApiResponse<PaginatedResponse<HistoryItem>>
    >(`/history?${params.toString()}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      (response.data.error as string) || "Không thể lấy lịch sử giao dịch"
    );
  },
};
