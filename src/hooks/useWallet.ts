import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { walletService } from "../services/wallet";
import { WalletQuery, HistoryQuery } from "../types/api";

export const useWallet = (query?: WalletQuery) => {
  return useQuery({
    queryKey: ["wallet", query],
    queryFn: () => walletService.getWallet(query),
    staleTime: 1 * 60 * 1000, // 1 phút
  });
};

export const useInfiniteWallet = (query?: Omit<WalletQuery, "page">) => {
  return useInfiniteQuery({
    queryKey: ["wallet-infinite", query],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      walletService.getWallet({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      console.log("Wallet getNextPageParam:", lastPage);
      if (lastPage && lastPage.current_page && lastPage.last_page) {
        const hasNext = lastPage.current_page < lastPage.last_page;
        console.log(
          `Wallet page ${lastPage.current_page}/${lastPage.last_page}, hasNext: ${hasNext}`
        );
        return hasNext ? lastPage.current_page + 1 : undefined;
      }
      return undefined;
    },
    staleTime: 1 * 60 * 1000,
  });
};

export const useHistory = (query?: HistoryQuery) => {
  return useQuery({
    queryKey: ["history", query],
    queryFn: () => walletService.getHistory(query),
    staleTime: 2 * 60 * 1000, // 2 phút
  });
};

export const useUseVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => walletService.useVoucher(code),
    onSuccess: () => {
      // Invalidate wallet và history để cập nhật trạng thái
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      // Invalidate vouchers để refresh danh sách
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      queryClient.invalidateQueries({ queryKey: ["vouchers-infinite"] });
    },
  });
};
