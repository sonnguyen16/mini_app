import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { catalogService } from "../services/catalog";
import { walletService } from "../services/wallet";
import { VouchersQuery, LatestVouchersQuery } from "../types/api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};

export const useVouchers = (query?: VouchersQuery) => {
  return useQuery({
    queryKey: ["vouchers", query],
    queryFn: () => catalogService.getVouchers(query),
    staleTime: 2 * 60 * 1000, // 2 phút
  });
};

export const useLatestVouchers = (query?: LatestVouchersQuery) => {
  return useQuery({
    queryKey: ["vouchers", "latest", query],
    queryFn: () => catalogService.getLatestVouchers(query),
    staleTime: 2 * 60 * 1000, // 2 phút
  });
};

export const useVoucherDetail = (id: number) => {
  return useQuery({
    queryKey: ["voucher", id],
    queryFn: () => catalogService.getVoucherById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

export const useInfiniteVouchers = (query?: Omit<VouchersQuery, "page">) => {
  return useInfiniteQuery({
    queryKey: ["vouchers-infinite", query],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      catalogService.getVouchers({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      console.log('Vouchers getNextPageParam:', lastPage);
      if (lastPage && lastPage.current_page && lastPage.last_page) {
        const hasNext = lastPage.current_page < lastPage.last_page;
        console.log(`Vouchers page ${lastPage.current_page}/${lastPage.last_page}, hasNext: ${hasNext}`);
        return hasNext ? lastPage.current_page + 1 : undefined;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useRedeemVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (voucherId: number) => walletService.redeemVoucher(voucherId),
    onSuccess: () => {
      // Invalidate wallet và profile để cập nhật điểm
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      // Invalidate vouchers để refresh danh sách
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      queryClient.invalidateQueries({ queryKey: ["vouchers-infinite"] });
    },
  });
};
