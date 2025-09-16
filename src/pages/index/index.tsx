import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService, UserData } from "../../services/userService";

// DỮ LIỆU MẪU — bạn chỉ cần thay URL ảnh cho đúng dự án
const deals = [
  {
    id: 1,
    topImage: "deal1.jpg",
    brand: "Swensen",
    subtitle: "Áp dụng cho hoá đơn từ 150.000 VNĐ",
    note: "Giảm 50K",
  },
  {
    id: 2,
    topImage: "deal2.jpg",
    brand: "Chang Modern",
    subtitle: "Áp dụng cho hoá đơn từ 500.000 VNĐ",
    note: "Giảm 100K",
  },
  {
    id: 1,
    topImage: "deal3.jpg",
    brand: "Swensen",
    subtitle: "Áp dụng cho hoá đơn từ 150.000 VNĐ",
    note: "Giảm 50K",
  },
];

const vouchers = [
  {
    id: 1,
    topImage: "deal1.jpg",
    brand: "Highlands",
    title: "Cà Phê Hoà Tan",
    points: 259,
  },
  {
    id: 2,
    topImage: "deal2.jpg",
    brand: "ALDO",
    title: "Voucher 50.000",
    points: 65,
  },
  {
    id: 3,
    topImage: "deal3.jpg",
    brand: "Khác",
    title: "Ưu đãi khác",
    points: 120,
  },
];

const news = [
  {
    id: 4,
    image: "promo.jpg", // ảnh chứa toàn bộ text của banner tin tức
  },
  { id: 5, image: "promo.jpg" },
];

export default function HighlandsHome() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = userService.getCachedUserData();
        if (data.userInfo) {
          setUserData(data);
        } else {
          await userService.getUserInfo();
          await userService.getPhoneNumber();
          setUserData(userService.getCachedUserData());
        }
        await userService.getApiToken();
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
        // Sử dụng dữ liệu mặc định nếu không lấy được
        setUserData({
          userInfo: {
            id: "default",
            name: "Sơn",
            avatar: "avatar.jpg",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleItemClick = (item: any, type: "deal" | "voucher") => {
    navigate("/voucher-detail", {
      state: {
        item: {
          ...item,
          type,
          image: item.topImage,
          expiry: "23:59 31/10/2025",
          description:
            type === "deal" ? item.subtitle : `${item.brand} - ${item.title}`,
        },
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900 relative flex flex-col">
      {/* BANNER */}
      <section className="relative w-full">
        <div className="relative w-full h-60 bg-[#B21F2D] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B21F2D] via-[#B21F2D] to-[#8F1722]" />
          <div className="absolute left-5 top-20 text-white select-none">
            <div className="text-2xl font-extrabold leading-none">
              HIGHLANDS
            </div>
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
              src={userData.userInfo?.avatar || "avatar.jpg"}
              alt="Avatar"
              className="h-12 w-12 rounded-full object-cover border"
            />
            <div className="flex-1">
              <div className="text-lg font-semibold">
                {loading ? "Đang tải..." : userData.userInfo?.name || "Sơn"}
              </div>
              <div className="text-sm text-neutral-500">Thành viên</div>
              <div className="mt-2 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-[#B21F2D]" />
              </div>
              <div className="mt-1 text-xs text-neutral-500">0đ / 700.000đ</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="px-3 py-1 rounded-full bg-neutral-100 text-sm font-semibold">
                0 điểm
              </div>
              <button className="mt-2 text-xs text-[#B21F2D] font-semibold">
                Lịch sử giao dịch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      {/* Thêm pt-16 để tiêu đề Hot Deal không bị card user che mất */}
      <main className="-mt-20 pt-12 pb-20 px-4 flex-1 overflow-y-auto">
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
        <SectionHeader title="Hot Deal 00:00:00" actionLabel="Tất cả >" />
        <HScroll columns={2} className="mt-3">
          {deals.map((d) => (
            <div
              key={d.id}
              onClick={() => handleItemClick(d, "deal")}
              className="cursor-pointer"
            >
              <DealCard topImage={d.topImage} brand={d.brand} note={d.note} />
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
          {vouchers.map((v) => (
            <div
              key={v.id}
              onClick={() => handleItemClick(v, "voucher")}
              className="cursor-pointer"
            >
              <VoucherCard
                topImage={v.topImage}
                brand={v.brand}
                title={v.title}
                points={v.points}
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
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <h3 className="text-xl font-extrabold">{title}</h3>
      </div>
      <button className="text-sm font-semibold text-neutral-600">
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

function DealCard({ topImage, brand, note }) {
  return (
    <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm">
      {/* Trên = ảnh */}
      <div className="h-28 bg-[#B21F2D]/10">
        <img
          src={topImage}
          alt="deal-top"
          className="h-full w-full object-cover"
        />
      </div>
      {/* Dưới = chữ */}
      <div className="p-3">
        <div className="text-base font-bold leading-tight">{brand}</div>
        <div className="text-sm mt-1 text-neutral-700">{note}</div>
      </div>
    </div>
  );
}

function VoucherCard({ topImage, brand, title, points }) {
  return (
    <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm">
      {/* Trên = ảnh */}
      <div className="h-28 bg-[#B21F2D]/10">
        <img
          src={topImage}
          alt="voucher-top"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="px-3 pt-3">
        <div className="text-base font-bold leading-tight">{brand}</div>
        <div className="text-sm mt-1 text-neutral-700">{title}</div>
      </div>
      {/* Dưới = chữ */}
      <div className="p-3 flex items-center justify-between">
        <div>
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-100 text-xs">
            <span className="font-semibold">{points}</span>
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
