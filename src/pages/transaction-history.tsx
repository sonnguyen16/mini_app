import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "zmp-ui";
import { Navigation } from "../components/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { walletService } from "../services/wallet";
import { getImageUrl } from "../utils/utils";

interface Transaction {
  id: number;
  user_id: number;
  app_id: number;
  voucher_id: number;
  type: "redeem" | "use";
  status: "success" | "failed";
  metadata: {
    code?: string;
    points_used?: number;
  };
  created_at: string;
  updated_at: string;
  voucher: {
    id: number;
    name: string;
    description: string;
    image: string;
    required_points: number;
  };
}

// Component hiển thị item giao dịch
function TransactionItem({ transaction }: { transaction: Transaction }) {
  const getStatusColor = (status: string) => {
    return status === "success" ? "text-green-600" : "text-red-600";
  };

  const getTypeText = (type: string) => {
    return type === "redeem" ? "Đổi voucher" : "Sử dụng voucher";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 space-y-3">
      <div className="flex items-start gap-3">
        <img
          src={getImageUrl(transaction.voucher.image)}
          alt={transaction.voucher.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2">
            {transaction.voucher.name}
          </h3>
          <p className="text-xs text-neutral-600 mt-1">
            {transaction.voucher.description}
          </p>
        </div>
        <div className="text-right">
          <div
            className={`text-xs font-medium ${getStatusColor(
              transaction.status
            )}`}
          >
            {getTypeText(transaction.type)}
          </div>
          {transaction.metadata.points_used && (
            <div className="text-xs text-neutral-600 mt-1">
              -{transaction.metadata.points_used} điểm
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
        <span>Mã: {transaction.metadata.code || "N/A"}</span>
        <span>{formatDate(transaction.created_at)}</span>
      </div>
    </div>
  );
}

// Component loading
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B21F2D]"></div>
    </div>
  );
}

// Component error state
function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="py-12 text-center text-neutral-500">
      <div className="text-4xl mb-2">⚠️</div>
      <div className="text-sm">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#B21F2D] text-white rounded-lg text-sm font-medium mt-4"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "redeem" | "use">("all");

  // API call với infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["transaction-history", filter],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      walletService.getHistory({
        page: pageParam,
        per_page: 10,
        type: filter === "all" ? undefined : filter,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      console.log("Transaction getNextPageParam:", lastPage);
      if (lastPage && lastPage.current_page && lastPage.last_page) {
        const hasNext = lastPage.current_page < lastPage.last_page;
        console.log(
          `Transaction page ${lastPage.current_page}/${lastPage.last_page}, hasNext: ${hasNext}`
        );
        return hasNext ? lastPage.current_page + 1 : undefined;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000,
  });

  // Infinite scroll
  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      // Trigger when within 200px of bottom
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    // Lắng nghe scroll event của main element
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll);
      return () => mainElement.removeEventListener("scroll", handleScroll);
    }
    return () => {};
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Prepare data
  const transactions =
    data?.pages.reduce((acc: Transaction[], page: any) => {
      const pageData = Array.isArray(page?.data) ? page.data : [];
      return [...acc, ...pageData];
    }, []) || [];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <Header
        title="Lịch sử giao dịch"
        showBackIcon
        onBackClick={() => navigate(-1)}
        className="bg-white border-b border-neutral-200"
      />

      {/* Filter tabs */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="flex gap-2">
          {[
            { key: "all", label: "Tất cả" },
            { key: "redeem", label: "Đã đổi" },
            { key: "use", label: "Đã dùng" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === tab.key
                  ? "bg-[#B21F2D] text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState
            message="Không thể tải lịch sử giao dịch. Vui lòng thử lại."
            onRetry={() => window.location.reload()}
          />
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}

            {transactions.length === 0 && (
              <div className="py-12 text-center text-neutral-500">
                <div className="text-4xl mb-2">📄</div>
                <div className="text-sm">Chưa có giao dịch nào</div>
              </div>
            )}

            {isFetchingNextPage && <LoadingSpinner />}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}
