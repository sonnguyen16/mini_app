import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useAuth";
import { useLatestVouchers, useVouchers } from "../../hooks/useVouchers";
import { initializeApp } from "../../services";
import userService from "../../services/user";
import { getImageUrl } from "../../utils/utils";

// Fallback data khi API không khả dụng
const fallbackDeals = [
  {
    id: 1,
    image: "deal1.jpg",
    name: "Swensen Deal",
    description: "Áp dụng cho hoá đơn từ 150.000 VNĐ",
    required_points: 50,
  },
  {
    id: 2,
    image: "deal2.jpg",
    name: "Chang Modern Deal",
    description: "Áp dụng cho hoá đơn từ 500.000 VNĐ",
    required_points: 100,
  },
];

const fallbackVouchers = [
  {
    id: 1,
    image: "deal1.jpg",
    name: "Cà Phê Hoà Tan",
    description: "Highlands Coffee",
    required_points: 259,
  },
  {
    id: 2,
    image: "deal2.jpg",
    name: "Voucher 50.000",
    description: "ALDO",
    required_points: 65,
  },
];

const news = [
  { id: 4, image: "promo.jpg" },
  { id: 5, image: "promo.jpg" },
];

export default function HighlandsHome() {
  const [userData, setUserData] = useState<any>({});
  const navigate = useNavigate();

  const handleItemClick = (item: any) => {
    navigate("/voucher-detail", {
      state: {
        item: {
          ...item,
          image: getImageUrl(item.image),
        },
      },
    });
  };

  // Sử dụng React Query hooks
  const { profile } = useProfile();
  const { data: latestVouchers } = useLatestVouchers({
    limit: 6,
  });
  const { data: vouchersData } = useVouchers({
    per_page: 6,
  });

  // Khởi tạo app và lấy thông tin người dùng
  useEffect(() => {
    const initApp = async () => {
      try {
        // Khởi tạo app với logic auth mới
        const authData = await initializeApp();

        if (authData) {
          setUserData({
            userInfo: authData.userInfo,
            phoneNumber: authData.phoneNumber,
          });
        } else {
          // Fallback data
          setUserData({
            userInfo: {
              id: "default",
              name: "Sơn",
              avatar: "avatar.jpg",
            },
          });
        }
      } catch (error) {
        console.warn("App initialization failed:", error);
        setUserData({
          userInfo: {
            id: "default",
            name: "Người dùng",
            avatar: "avatar.jpg",
          },
        });
      }
    };

    initApp();
  }, []);

  // Lấy dữ liệu để hiển thị - ưu tiên từ userService
  const cachedUserData = userService.getCachedUserData();
  const displayUser = {
    ...profile,
    name:
      cachedUserData.userInfo?.name || userData.userInfo?.name || "Người dùng",
    avatar:
      cachedUserData.userInfo?.avatar ||
      userData.userInfo?.avatar ||
      "avatar.jpg",
    phone: cachedUserData.phoneNumber || userData.phoneNumber || "",
  };
  const displayDeals = latestVouchers || fallbackDeals;
  const displayVouchers = vouchersData?.data || fallbackVouchers;

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900 relative flex flex-col">
      {/* BANNER */}
      <section className="relative w-full">
        <div className="relative w-full h-60 bg-[#B21F2D] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B21F2D] via-[#B21F2D] to-[#8F1722]" />
          <div className="absolute left-5 top-20 text-white select-none">
            <div className="text-2xl font-extrabold leading-none">MINI APP</div>
            <div className="text-2xl font-extrabold leading-none">REWARDS</div>
            <div className="mt-1 text-xs tracking-widest opacity-90">
              MEMBER
            </div>
          </div>
        </div>

        {/* USER CARD đè 50% xuống banner */}
        <div className="px-4">
          <div
            className="relative -translate-y-1/2 z-10 rounded-2xl bg-white shadow-lg border border-neutral-200 p-4 flex items-center gap-4"
            style={{ transform: "translateY(-50%)" }}
          >
            <img
              src={(displayUser as any).avatar || "avatar.jpg"}
              alt="Avatar"
              className="h-12 w-12 rounded-full object-cover border"
            />
            <div className="flex-1">
              <div className="text-lg font-semibold">{displayUser.name}</div>
              <div className="text-sm text-neutral-500">Thành viên</div>
              {/* <div className="mt-2 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-[#B21F2D]" />
              </div>
              <div className="mt-1 text-xs text-neutral-500">0đ / 700.000đ</div> */}
            </div>
            <div className="flex flex-col items-end">
              <div className="px-3 py-1 rounded-full bg-neutral-100 text-sm font-semibold">
                {profile?.points_total || 0} điểm
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      {/* Thêm pt-16 để tiêu đề Hot Deal không bị card user che mất */}
      <main className="-mt-20 pt-14 pb-20 px-4 flex-1 overflow-y-auto">
        {/* Banner dưới card user */}
        <div className="mb-4">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-neutral-200">
            <img
              src="promo.jpg"
              alt="promo"
              className="w-full h-[200px] object-cover"
            />
          </div>
        </div>

        {/* HOT DEAL: 2 item / màn hình, cuộn ngang */}
        <SectionHeader title="Hot Deal" actionLabel="Tất cả >" />
        <HScroll columns={2} className="mt-3">
          {displayDeals.map((d) => (
            <div
              key={d.id}
              onClick={() => handleItemClick(d)}
              className="cursor-pointer"
            >
              <DealCard
                image={d.image.includes("/") ? getImageUrl(d.image) : d.image}
                name={d.name}
                description={d.description}
                required_points={d.required_points}
              />
            </div>
          ))}
        </HScroll>

        {/* VOUCHER: 2 item / màn hình, cuộn ngang */}
        <SectionHeader
          title="Voucher dành cho bạn"
          actionLabel="Tất cả >"
          className="mt-6"
        />
        <HScroll columns={2} className="mt-3">
          {displayVouchers.map((v) => (
            <div
              key={v.id}
              onClick={() => handleItemClick(v)}
              className="cursor-pointer"
            >
              <VoucherCard
                image={v.image.includes("/") ? getImageUrl(v.image) : v.image}
                name={v.name}
                description={v.description}
                required_points={v.required_points}
              />
            </div>
          ))}
        </HScroll>

        {/* NEWS: 1 item / màn hình, cuộn ngang */}
        <h3 className="mt-8 text-xl font-bold">Tin tức</h3>
        <HScroll columns={1} className="mt-3">
          {news.map((n) => (
            <NewsCard key={n.id} image={n.image} />
          ))}
        </HScroll>
      </main>

      {/* Bottom Nav (visual) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 px-2 py-2">
        <div className="grid grid-cols-4 gap-1">
          {["Trang chủ", "Thông báo", "Giỏ hàng", "Cá nhân"].map((label) => (
            <button
              key={label}
              className="py-2 text-xs font-medium rounded-xl hover:bg-neutral-50"
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function SectionHeader({ title, actionLabel, className = "" }) {
  const navigate = useNavigate();

  const handleActionClick = () => {
    navigate("/cart");
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <h3 className="text-xl font-extrabold">{title}</h3>
      </div>
      <button
        className="text-sm font-semibold text-neutral-600"
        onClick={handleActionClick}
      >
        {actionLabel}
      </button>
    </div>
  );
}

/**
 * HScroll – list cuộn ngang, thiết lập số cột trên một màn hình bằng thuộc tính columns
 * columns=2 => mỗi item chiếm 50% width (trừ gap), columns=1 => full width
 */
function HScroll({ children, columns = 2, className = "" }) {
  return (
    <div className={`overflow-x-auto -mx-4 px-4 ${className}`}>
      <div className="flex gap-4 snap-x snap-mandatory pr-4">
        {React.Children.map(children, (child) => (
          <div
            className="snap-start shrink-0"
            style={{ width: columns === 1 ? "100%" : "calc(50% - 0.5rem)" }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

function DealCard({
  image,
  name,
  description,
  required_points,
}: {
  image: string;
  name: string;
  description: string;
  required_points: number;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm">
      {/* Trên = ảnh */}
      <div className="h-28 bg-[#B21F2D]/10">
        <img
          src={image}
          alt="deal-top"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="px-3 pt-2">
        <div className="text-md mt-1 font-bold">{name}</div>
      </div>
      {/* description */}
      <div className="px-3 ">
        <div className="text-sm mt-1 line-clamp-2 text-neutral-700">
          {description}
        </div>
      </div>
      {/* Dưới = chữ */}
      <div className="p-3 flex items-center justify-between">
        <div>
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-100 text-xs">
            <span className="font-semibold">{required_points} 🏆</span>
          </div>
        </div>
        <button className="px-4 py-2 rounded-full bg-[#B21F2D] text-white text-sm font-semibold shadow">
          Đổi
        </button>
      </div>
    </div>
  );
}

function VoucherCard({
  image,
  name,
  description,
  required_points,
}: {
  image: string;
  name: string;
  description: string;
  required_points: number;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm">
      {/* Trên = ảnh */}
      <div className="h-28 bg-[#B21F2D]/10">
        <img
          src={image}
          alt="voucher-top"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="px-3 pt-2">
        <div className="text-md mt-1 font-bold">{name}</div>
      </div>
      {/* description */}
      <div className="px-3 ">
        <div className="text-sm mt-1 line-clamp-2 text-neutral-700">
          {description}
        </div>
      </div>
      {/* Dưới = chữ */}
      <div className="p-3 flex items-center justify-between">
        <div>
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-100 text-xs">
            <span className="font-semibold">{required_points} 🏆</span>
          </div>
        </div>
        <button className="px-4 py-2 rounded-full bg-[#B21F2D] text-white text-sm font-semibold shadow">
          Đổi
        </button>
      </div>
    </div>
  );
}

function NewsCard({ image }) {
  return (
    <article className="rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm">
      <div className="h-42 bg-[#B21F2D]/10 flex items-center justify-center">
        <img src={image} alt="news" className="h-full w-full object-cover" />
      </div>
    </article>
  );
}
