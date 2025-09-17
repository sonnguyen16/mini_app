import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../../components/navigation";
import { Header } from "zmp-ui";
import {
  useCategories,
  useVouchers,
  useRedeemVoucher,
} from "../../hooks/useVouchers";
import { useWallet, useHistory, useUseVoucher } from "../../hooks/useWallet";
import { initializeApp } from "../../services";

// Fallback categories nếu API không hoạt động
const FALLBACK_CATEGORIES = [
  { key: "all", label: "Tất cả", icon: "🏠" },
  { key: "food", label: "Ăn uống", icon: "🍽️" },
  { key: "shop", label: "Mua sắm", icon: "🛍️" },
  { key: "move", label: "Di chuyển", icon: "🧭" },
  { key: "other", label: "Khác", icon: "⚙️" },
];

// Fallback vouchers nếu API không hoạt động
const FALLBACK_VOUCHERS = [
  {
    id: "mango",
    category_id: 2,
    image: "/deal1.jpg",
    name: "MANGO - Giảm 100K",
    title: "Giảm 100K",
    points_required: 25,
    description: "Voucher giảm giá 100K cho đơn hàng từ MANGO",
  },
  {
    id: "elsa",
    category_id: 3,
    image: "/deal2.jpg",
    name: "Elsa Speak",
    title: "Elsa Speak Premium",
    points_required: 1,
    description: "Gói học tiếng Anh premium từ Elsa Speak",
  },
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
    <aside className="w-20 shrink-0 rounded-2xl bg-[#FBF7F2] p-2">
      <div className="space-y-2">
        {categories.map((c) => {
          const active = value === c.key;
          return (
            <button
              key={c.key}
              onClick={() => onChange(c.key)}
              className={`w-full rounded-xl px-2 py-3 text-center text-xs font-medium transition ${
                active ? "bg-white text-[#8B3A25] shadow" : "text-neutral-600"
              }`}
            >
              <div className="text-lg">{c.icon}</div>
              <div className="mt-1 leading-tight">{c.label}</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function GiftCard({ voucher, onClick, onRedeem, isRedeeming }: any) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* top image */}
      <div className="h-28">
        <img
          src={voucher.image || "/deal1.jpg"}
          alt={voucher.name}
          className="w-full h-full object-cover"
        />
      </div>
      {/* bottom text area */}
      <div className="p-3">
        <div className="text-sm line-clamp-1 font-bold leading-tight">
          {voucher.name}
        </div>
        <div className="text-sm text-neutral-700 mt-1">
          {voucher.description}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[13px] text-neutral-700 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="opacity-70">🏆</span>
              <span className="font-semibold">{voucher.points_required}</span>
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRedeem(voucher.id);
          }}
          disabled={isRedeeming}
          className="px-4 py-2 mt-3 rounded-full bg-[#B21F2D] text-white text-sm font-semibold shadow disabled:opacity-50"
        >
          {isRedeeming ? "Đang đổi..." : "Đổi"}
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// PAGE: Quà Tặng
// ──────────────────────────────────────────────────────────────────────────────
export default function GiftsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("offers");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  // Sử dụng React Query hooks
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: vouchers, isLoading: vouchersLoading } = useVouchers();
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data: history, isLoading: historyLoading } = useHistory();
  const { mutate: redeemVoucher, isPending: isRedeeming } = useRedeemVoucher();
  const { mutate: useVoucher, isPending: isUsing } = useUseVoucher();

  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeApp();
      } catch (error) {
        console.warn("API initialization failed:", error);
      }
    };
    initApp();
  }, []);

  // Tạo categories với fallback
  const displayCategories = useMemo(() => {
    const apiCategories =
      categories?.map((cat) => ({
        key: cat.id.toString(),
        label: cat.name,
        icon:
          cat.name === "Ăn uống" ? "🍽️" : cat.name === "Mua sắm" ? "🛍️" : "⚙️",
      })) || [];

    return [
      { key: "all", label: "Tất cả", icon: "🏠" },
      ...(apiCategories.length > 0
        ? apiCategories
        : FALLBACK_CATEGORIES.slice(1)),
    ];
  }, [categories]);

  // Tạo vouchers với fallback
  const displayVouchers = useMemo(() => {
    const apiVouchers = vouchers?.data || [];
    return apiVouchers.length > 0 ? apiVouchers : FALLBACK_VOUCHERS;
  }, [vouchers]);

  const handleGiftClick = (voucher: any) => {
    navigate("/voucher-detail", {
      state: {
        item: {
          ...voucher,
          type: "gift",
          topImage: voucher.image,
          expire_at: voucher.expire_at_date || "23:59 31/12/2025",
          subtitle: `Đổi ${voucher.name} với ${voucher.points_required} điểm`,
          description: voucher.description,
        },
      },
    });
  };

  const handleRedeem = (voucherId: string) => {
    redeemVoucher(parseInt(voucherId), {
      onSuccess: () => {
        // Thông báo thành công
        console.log("Đổi voucher thành công!");
      },
      onError: (error) => {
        console.error("Lỗi khi đổi voucher:", error);
      },
    });
  };

  const filtered = useMemo(() => {
    if (tab !== "offers") return [];
    return displayVouchers.filter(
      (v: any) =>
        (category === "all" || v.category_id?.toString() === category) &&
        (query.trim() === "" ||
          (v.name + v.description).toLowerCase().includes(query.toLowerCase()))
    );
  }, [tab, category, query, displayVouchers]);

  // Lấy danh sách voucher đã đổi và đã sử dụng từ history
  const redeemedVouchers = useMemo(() => {
    const historyData = history?.data || [];
    return historyData.filter((h: any) => h.type === "voucher_redeem") || [];
  }, [history]);

  const usedVouchers = useMemo(() => {
    const historyData = history?.data || [];
    return historyData.filter((h: any) => h.type === "voucher_use") || [];
  }, [history]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Header title="Quà Tặng" showBackIcon />
      <Tabs value={tab} onChange={setTab} />
      {/* Search + filter */}
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

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {tab === "offers" && (
          <div className="flex gap-4">
            {/* left sidebar */}
            <Sidebar
              value={category}
              onChange={setCategory}
              categories={displayCategories}
            />

            {/* grid cards */}
            <div className="grid grid-cols-2 grid-rows-[260px] gap-4 flex-1">
              {vouchersLoading ? (
                <div className="col-span-2 flex justify-center items-center h-40">
                  <div className="text-gray-500">Đang tải...</div>
                </div>
              ) : (
                filtered.map((voucher) => (
                  <GiftCard
                    key={voucher.id}
                    voucher={voucher}
                    onClick={() => handleGiftClick(voucher)}
                    onRedeem={handleRedeem}
                    isRedeeming={isRedeeming}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {tab === "redeemed" && (
          <div>
            {historyLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="text-gray-500">Đang tải...</div>
              </div>
            ) : redeemedVouchers.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {redeemedVouchers.map((item: any) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-3"
                  >
                    <div className="text-sm font-bold">
                      {item.voucher?.name || "Voucher"}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      Đã đổi: {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Bạn chưa đổi quà nào" />
            )}
          </div>
        )}

        {tab === "used" && (
          <div>
            {historyLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="text-gray-500">Đang tải...</div>
              </div>
            ) : usedVouchers.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {usedVouchers.map((item: any) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-3"
                  >
                    <div className="text-sm font-bold">
                      {item.voucher?.name || "Voucher"}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      Đã dùng: {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Bạn chưa sử dụng quà nào" />
            )}
          </div>
        )}

        <div className="h-24" />
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
