import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "../../components/navigation";
import { Header } from "zmp-ui";
import { useCategories, useInfiniteVouchers } from "../../hooks/useVouchers";
import { useInfiniteWallet } from "../../hooks/useWallet";
import { getImageUrl } from "../../utils/utils";

// ──────────────────────────────────────────────────────────────────────────────
// Fallback categories nếu API không khả dụng
// ──────────────────────────────────────────────────────────────────────────────
const FALLBACK_CATEGORIES = [
  { key: "all", label: "Tất cả", icon: "🏠" },
  { key: "food", label: "Ăn uống", icon: "🍽️" },
  { key: "shop", label: "Mua sắm", icon: "🛍️" },
  { key: "move", label: "Di chuyển", icon: "🧭" },
  { key: "other", label: "Khác", icon: "⚙️" },
];

// ──────────────────────────────────────────────────────────────────────────────
// UI helpers
// ──────────────────────────────────────────────────────────────────────────────
function Tabs({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const items = [
    { key: "offers", label: "Ưu đãi" },
    { key: "redeemed", label: "Đã đổi" },
    { key: "used", label: "Đã dùng" },
  ];
  return (
    <div className="">
      <div className="grid grid-cols-3 text-center text-sm font-semibold">
        {items.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`py-3 relative ${
              value === t.key ? "text-[#8B3A25]" : "text-neutral-500"
            }`}
          >
            {t.label}
            <span
              className={`absolute left-1/2 -translate-x-1/2 -bottom-px h-0.5 w-12 rounded ${
                value === t.key ? "bg-[#B21F2D]" : "bg-transparent"
              }`}
            />
          </button>
        ))}
      </div>
      <div className="h-[2px] w-full bg-neutral-200" />
    </div>
  );
}

function Sidebar({
  value,
  onChange,
  categories,
}: {
  value: string;
  onChange: (v: string) => void;
  categories: any[];
}) {
  return (
    <aside className="w-20 shrink-0 rounded-2xl bg-[#FBF7F2] p-2 sticky top-0 scroll-y-auto max-h-[calc(100vh-250px)] self-start flex flex-col">
      <div className="scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent">
        <div className="space-y-2 pb-2">
          {categories.map((c) => {
            const active = value === c.key;
            return (
              <button
                key={c.key}
                onClick={() => onChange(c.key)}
                className={`w-full rounded-xl px-1 py-3 text-center text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-white text-[#8B3A25] shadow-md transform scale-105"
                    : "text-neutral-600 hover:bg-white/50 hover:text-[#8B3A25]"
                }`}
              >
                <div className="text-lg">{c.icon}</div>
                <div className="mt-1 leading-tight">{c.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function GiftCard({
  image,
  brand,
  title,
  points,
  onClick,
  redeemed = false,
  used = false,
}: any) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* top image */}
      <div className="h-28">
        <img src={image} alt={brand} className="w-full h-full object-cover" />
      </div>
      {/* bottom text area */}
      <div className="p-3">
        <div className="text- line-clamp-2 font-bold leading-tight">
          {brand}
        </div>
        <div className="text-sm text-neutral-700 line-clamp-2 mt-1">
          {title}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[13px] text-neutral-700 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="opacity-70">🏆</span>
              <span className="font-semibold">{points}</span>
            </span>
          </div>
          {!redeemed && !used && (
            <button className="px-4 py-2 rounded-full bg-[#B21F2D] text-white text-sm font-semibold shadow">
              Đổi
            </button>
          )}
          {redeemed && (
            <button className="px-4 py-2 rounded-full bg-[#B21F2D] text-white text-sm font-semibold shadow">
              Dùng
            </button>
          )}
          {used && (
            <button className="px-4 py-2 rounded-full bg-[#B21F2D] text-white text-sm font-semibold shadow">
              Đã dùng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// PAGE: Quà Tặng
// ──────────────────────────────────────────────────────────────────────────────
// Hook để debounce search query
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function GiftsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("offers");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  // Debounce search query để tránh gọi API quá nhiều
  const debouncedQuery = useDebounce(query, 500);

  // Kiểm tra state từ navigation để tự động chuyển tab
  useEffect(() => {
    const activeTab = location.state?.activeTab;
    if (activeTab && ["offers", "redeemed", "used"].includes(activeTab)) {
      setTab(activeTab);
      // Clear state sau khi sử dụng
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  // API calls
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();
  const {
    data: vouchersData,
    fetchNextPage: fetchNextVouchers,
    hasNextPage: hasNextVouchers,
    isFetchingNextPage: isFetchingNextVouchers,
    isLoading: isLoadingVouchers,
    error: vouchersError,
  } = useInfiniteVouchers({
    category_id: category === "all" ? undefined : parseInt(category),
    keyword: debouncedQuery.trim() || undefined,
  });

  const {
    data: redeemedData,
    fetchNextPage: fetchNextRedeemed,
    hasNextPage: hasNextRedeemed,
    isFetchingNextPage: isFetchingNextRedeemed,
    isLoading: isLoadingRedeemed,
    error: redeemedError,
  } = useInfiniteWallet({ status: "redeemed" });

  const {
    data: usedData,
    fetchNextPage: fetchNextUsed,
    hasNextPage: hasNextUsed,
    isFetchingNextPage: isFetchingNextUsed,
    isLoading: isLoadingUsed,
    error: usedError,
  } = useInfiniteWallet({ status: "used" });

  // Infinite scroll
  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      // Trigger when within 200px of bottom
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        if (tab === "offers" && hasNextVouchers && !isFetchingNextVouchers) {
          fetchNextVouchers();
        } else if (
          tab === "redeemed" &&
          hasNextRedeemed &&
          !isFetchingNextRedeemed
        ) {
          fetchNextRedeemed();
        } else if (tab === "used" && hasNextUsed && !isFetchingNextUsed) {
          fetchNextUsed();
        }
      }
    };

    // Lắng nghe scroll event của main element
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll);
      return () => mainElement.removeEventListener("scroll", handleScroll);
    }
    return () => {}; // Cleanup function for when mainElement is not found
  }, [
    tab,
    hasNextVouchers,
    hasNextRedeemed,
    hasNextUsed,
    isFetchingNextVouchers,
    isFetchingNextRedeemed,
    isFetchingNextUsed,
    fetchNextVouchers,
    fetchNextRedeemed,
    fetchNextUsed,
  ]);

  // Prepare categories
  const categories = useMemo(() => {
    const apiCategories = categoriesData || [];
    const mappedCategories = [
      { key: "all", label: "Tất cả", icon: "🏠" },
      ...apiCategories.map((cat: any) => ({
        key: cat.id.toString(),
        label: cat.name,
        icon: "🎁",
      })),
    ];
    return mappedCategories.length > 1 ? mappedCategories : FALLBACK_CATEGORIES;
  }, [categoriesData]);

  // Prepare data based on tab
  const currentData = useMemo(() => {
    console.log("Current tab:", tab);
    if (tab === "offers") {
      const pages = vouchersData?.pages || [];
      console.log("Vouchers pages:", pages);
      const result = pages.reduce((acc: any[], page: any) => {
        console.log("Processing page:", page);
        // Cấu trúc: page là PaginatedResponse<Voucher>, data nằm trong page.data
        const pageData = Array.isArray(page?.data) ? page.data : [];
        console.log("Page data:", pageData);
        return [...acc, ...pageData];
      }, []);
      console.log("Final vouchers result:", result);
      return result;
    } else if (tab === "redeemed") {
      const pages = redeemedData?.pages || [];
      console.log("Redeemed pages:", pages);
      const result = pages.reduce((acc: any[], page: any) => {
        // Cấu trúc: page là PaginatedResponse<WalletItem>, data nằm trong page.data
        const pageData = Array.isArray(page?.data) ? page.data : [];
        return [...acc, ...pageData];
      }, []);
      console.log("Final redeemed result:", result);
      return result;
    } else if (tab === "used") {
      const pages = usedData?.pages || [];
      console.log("Used pages:", pages);
      const result = pages.reduce((acc: any[], page: any) => {
        // Cấu trúc: page là PaginatedResponse<WalletItem>, data nằm trong page.data
        const pageData = Array.isArray(page?.data) ? page.data : [];
        return [...acc, ...pageData];
      }, []);
      console.log("Final used result:", result);
      return result;
    }
    return [];
  }, [tab, vouchersData, redeemedData, usedData]);

  const handleGiftClick = (item: any) => {
    if (tab === "offers") {
      // Voucher từ catalog
      navigate("/voucher-detail", {
        state: {
          item: {
            ...item,
            type: "voucher",
            topImage: item.image,
            expire_at: item.expire_at || "23:59 31/12/2025",
            subtitle: `${item.required_points} điểm`,
            description: item.description,
          },
        },
      });
    } else {
      // Wallet voucher (đã đổi/đã dùng)
      navigate("/voucher-detail", {
        state: {
          item: {
            ...item.voucher,
            type: "wallet",
            code: item.code,
            status: item.status,
            topImage: item.voucher?.image,
            expire_at: item.expire_at || "23:59 31/12/2025",
            subtitle: item.status === "redeemed" ? "Đã đổi" : "Đã sử dụng",
            description: item.voucher?.description,
            redeemed: item.status === "redeemed",
            used: item.status === "used",
          },
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Header title="Quà Tặng" showBackIcon />
      <Tabs value={tab} onChange={setTab} />
      {/* Search + filter */}
      {tab === "offers" && (
        <div className="px-4 pt-3">
          <div className="rounded-2xl bg-white border border-neutral-200 flex items-center gap-2 px-3 py-2">
            <span className="text-neutral-400">🔍</span>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="flex-1 outline-none text-sm placeholder:text-neutral-400"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {tab === "offers" && (
          <>
            {isLoadingVouchers ? (
              <LoadingSpinner />
            ) : vouchersError ? (
              <ErrorState
                message="Không thể tải danh sách voucher. Vui lòng thử lại."
                onRetry={() => window.location.reload()}
              />
            ) : (
              <div className="flex gap-4">
                {/* left sidebar */}
                <Sidebar
                  value={category}
                  onChange={setCategory}
                  categories={categories}
                />

                {/* grid cards */}
                <div className="flex flex-col gap-4">
                  {currentData.map((g) => (
                    <GiftCard
                      key={g.id}
                      image={getImageUrl(g.image)}
                      brand={g.name || g.brand}
                      title={g.description || g.title}
                      points={g.required_points}
                      onClick={() => handleGiftClick(g)}
                    />
                  ))}
                  {currentData.length === 0 && (
                    <div className="col-span-2">
                      <EmptyState text="Không tìm thấy voucher nào" />
                    </div>
                  )}
                  {isFetchingNextVouchers && (
                    <div className="col-span-2">
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {tab === "redeemed" && (
          <>
            {isLoadingRedeemed ? (
              <LoadingSpinner />
            ) : redeemedError ? (
              <ErrorState
                message="Không thể tải danh sách voucher đã đổi. Vui lòng thử lại."
                onRetry={() => window.location.reload()}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {currentData.map((item) => (
                  <GiftCard
                    key={item.id}
                    image={getImageUrl(item.voucher?.image)}
                    brand={item.voucher?.name || item.voucher?.brand}
                    title={item.voucher?.description || item.voucher?.title}
                    points={item.voucher?.required_points}
                    onClick={() => handleGiftClick(item)}
                    redeemed={item.status === "redeemed"}
                  />
                ))}
                {currentData.length === 0 && (
                  <div className="col-span-2">
                    <EmptyState text="Bạn chưa đổi quà nào" />
                  </div>
                )}
                {isFetchingNextRedeemed && (
                  <div className="col-span-2">
                    <LoadingSpinner />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {tab === "used" && (
          <>
            {isLoadingUsed ? (
              <LoadingSpinner />
            ) : usedError ? (
              <ErrorState
                message="Không thể tải danh sách voucher đã sử dụng. Vui lòng thử lại."
                onRetry={() => window.location.reload()}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {currentData.map((item) => (
                  <GiftCard
                    key={item.id}
                    image={getImageUrl(item.voucher?.image)}
                    brand={item.voucher?.name || item.voucher?.brand}
                    title={item.voucher?.description || item.voucher?.title}
                    points={item.voucher?.required_points}
                    onClick={() => handleGiftClick(item)}
                    used={item.status === "used"}
                  />
                ))}
                {currentData.length === 0 && (
                  <div className="col-span-2">
                    <EmptyState text="Bạn chưa sử dụng quà nào" />
                  </div>
                )}
                {isFetchingNextUsed && (
                  <div className="col-span-2">
                    <LoadingSpinner />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom nav */}
      <Navigation />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-12 text-center text-neutral-500">
      <div className="text-5xl mb-2">🎁</div>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B21F2D]"></div>
    </div>
  );
}

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
      <p className="text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#B21F2D] text-white rounded-lg text-sm font-medium"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}
