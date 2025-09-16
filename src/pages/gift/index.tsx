import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../../components/navigation";
import { Header } from "zmp-ui";

// ──────────────────────────────────────────────────────────────────────────────
// Gift card mock data (thay ảnh/chuỗi bằng API thật khi cần)
// ──────────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "all", label: "Tất cả", icon: "🏠" },
  { key: "food", label: "Ăn uống", icon: "🍽️" },
  { key: "shop", label: "Mua sắm", icon: "🛍️" },
  { key: "move", label: "Di chuyển", icon: "🧭" },
  { key: "other", label: "Khác", icon: "⚙️" },
];

const GIFTS = [
  {
    id: "mango",
    category: "shop",
    image: "/deal1.jpg",
    brand: "MANGO",
    title: "Giảm 100K",
    points: 25,
  },
  {
    id: "elsa",
    category: "other",
    image: "/deal2.jpg",
    brand: "Elsa Speak",
    title: "Elsa Speak",
    points: 1,
  },
  {
    id: "cfy",
    category: "other",
    image: "/deal3.jpg",
    brand: "California Fitness & Yoga",
    title: "21 Ngày",
    points: 1,
  },
  {
    id: "ivivu",
    category: "move",
    image: "/deal1.jpg",
    brand: "iVIVU",
    title: "Giảm 50K",
    points: 45,
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
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <aside className="w-20 shrink-0 rounded-2xl bg-[#FBF7F2] p-2">
      <div className="space-y-2">
        {CATEGORIES.map((c) => {
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

function GiftCard({ image, brand, title, points, onClick }: any) {
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
        <div className="text- line-clamp-1 font-bold leading-tight">
          {brand}
        </div>
        <div className="text-sm text-neutral-700 mt-1">{title}</div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[13px] text-neutral-700 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="opacity-70">🏆</span>
              <span className="font-semibold">{points}</span>
            </span>
          </div>
        </div>
        <button className="px-4 py-2 mt-3 rounded-full bg-[#B21F2D] text-white text-sm font-semibold shadow">
          Đổi
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

  const handleGiftClick = (gift: any) => {
    navigate("/voucher-detail", {
      state: {
        item: {
          ...gift,
          type: "gift",
          topImage: gift.image,
          expiry: "23:59 31/12/2025",
          subtitle: `Đổi ${gift.title} với ${gift.points} điểm`,
          description: `Quà tặng từ ${gift.brand}`,
        },
      },
    });
  };

  const filtered = useMemo(() => {
    if (tab !== "offers") return [];
    return GIFTS.filter(
      (g) =>
        (category === "all" || g.category === category) &&
        (query.trim() === "" ||
          (g.brand + g.title).toLowerCase().includes(query.toLowerCase()))
    );
  }, [tab, category, query]);

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
            <Sidebar value={category} onChange={setCategory} />

            {/* grid cards */}
            <div className="grid grid-cols-2 grid-rows-[260px] gap-4 flex-1">
              {filtered.map((g) => (
                <GiftCard
                  key={g.id}
                  {...g}
                  onClick={() => handleGiftClick(g)}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "redeemed" && <EmptyState text="Bạn chưa đổi quà nào" />}
        {tab === "used" && <EmptyState text="Bạn chưa sử dụng quà nào" />}

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
