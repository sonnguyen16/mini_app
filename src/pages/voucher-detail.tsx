import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "zmp-ui";
import { Navigation } from "../components/navigation";

// Interface cho voucher data
interface VoucherData {
  id: string;
  image: string;
  brand: string;
  title: string;
  subtitle?: string;
  expiry: string;
  points?: number;
  discount?: string;
  description: string;
  location?: string;
  type: 'voucher' | 'deal' | 'gift';
}

// Component popup điều kiện sử dụng
function TermsPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal - slide up from bottom */}
      <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden transform transition-transform duration-300 ease-out translate-y-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-center flex-1">Điều kiện sử dụng</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#B21F2D] text-white flex items-center justify-center text-lg"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh] pb-20">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
              <span>Áp dụng cho khách hàng có hóa đơn từ <strong>500.000VNĐ</strong> trở lên khi dùng <strong>menu Buffet tại nhà hàng</strong>. Không áp dụng cho kênh delivery, take away & menu combo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
              <span>Áp dụng <strong>01 E-voucher/01 hóa đơn</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
              <span>Áp dụng giảm cho <strong>sản phẩm nguyên giá trên tổng hóa đơn</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
              <span>Áp dụng tại tất cả chi nhánh Aka House khu vực HCM.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
              <span>Không có giá trị quy đổi thành tiền mặt hoặc hoàn tiền khi không sử dụng hết mệnh giá.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
              <span>Không áp dụng chung với các chương trình ưu đãi khác.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
              <span>Không áp dụng cho các ngày Lễ, Tết, cụ thể: <strong>01-02/09</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
              <span>Quản lý nhà hàng có quyền từ chối áp dụng ưu đãi nếu phát hiện sai phạm bất kỳ.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
              <span>Được tích điểm <strong>TAPTAP</strong> và <strong>AKA XU</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
              <span>Giá <strong>chưa bao gồm VAT</strong>.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}


// Component chính màn hình chi tiết voucher
export default function VoucherDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);

  // Lấy dữ liệu từ navigation state hoặc dùng mock data
  const itemData = location.state?.item;
  const voucherData: VoucherData = itemData ? {
    id: itemData.id || "default-id",
    image: itemData.image || itemData.topImage || "/deal1.jpg",
    brand: itemData.brand || "Aka House",
    title: itemData.title || itemData.note || "Giảm 100K",
    subtitle: itemData.subtitle || "E-voucher giảm 100,000 VNĐ cho hóa đơn 500,000 VNĐ trở lên",
    expiry: itemData.expiry || "23:59 31/10/2025",
    description: itemData.description || "Các Cửa Hàng Aka House Tại Trung Tâm TP. HCM",
    type: itemData.type || "voucher"
  } : {
    id: "aka-house-100k",
    image: "/deal1.jpg",
    brand: "Aka House",
    title: "Giảm 100K",
    subtitle: "E-voucher giảm 100,000 VNĐ cho hóa đơn 500,000 VNĐ trở lên",
    expiry: "23:59 31/10/2025",
    description: "Các Cửa Hàng Aka House Tại Trung Tâm TP. HCM",
    type: "voucher"
  };

  const handleExchange = () => {
    // Logic đổi voucher
    console.log("Đổi voucher:", voucherData.id);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <Header 
        title="Quà Tặng" 
        showBackIcon 
        onBackClick={() => navigate(-1)}
        className="bg-white border-b border-neutral-200"
      />

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Voucher Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-200 mb-6">
          {/* Voucher Image - Recreating the red banner design */}
          <div className="relative h-48 bg-gradient-to-br from-[#B21F2D] to-[#8F1722] overflow-hidden">
            <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
              <div className="text-2xl font-bold leading-tight mb-2">
                ĐẠI TIỆC NƯỚNG NHẬT
              </div>
              <div className="text-2xl font-bold leading-tight mb-3">
                GIẢM 100.000 VNĐ
              </div>
              <div className="text-sm opacity-90 mb-4">
                Giảm 100.000 VNĐ cho hóa đơn<br />
                500.000 VNĐ trở lên
              </div>
              
              {/* Aka House logo area */}
              <div className="absolute bottom-4 left-6">
                <div className="bg-white text-[#B21F2D] px-3 py-1 rounded text-sm font-bold">
                  aka HOUSE
                </div>
              </div>
            </div>
            
            {/* Food image on the right */}
            <div className="absolute right-0 top-0 h-full w-1/2">
              <img 
                src={voucherData.image} 
                alt="Food" 
                className="h-full w-full object-cover opacity-80"
              />
            </div>
          </div>

          {/* Voucher Info */}
          <div className="p-4">
            <h2 className="text-lg font-bold mb-1">{voucherData.brand}</h2>
            <h3 className="text-xl font-bold text-[#B21F2D] mb-2">{voucherData.title}</h3>
            
            {/* Expiry and Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-neutral-600">
                Hạn sử dụng: <span className="font-medium">{voucherData.expiry}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <span className="flex items-center gap-1">
                  🏆 <span className="font-medium">75</span>
                </span>
                <span className="flex items-center gap-1 text-red-500">
                  ❤️ <span className="font-medium">3</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-700 mb-4">{voucherData.subtitle}</p>
            <p className="text-sm text-neutral-600 mb-6">{voucherData.description}</p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleExchange}
                className="w-full py-3 bg-[#B21F2D] text-white font-semibold rounded-full shadow-sm hover:bg-[#8F1722] transition-colors"
              >
                Đổi voucher ngay
              </button>
              
              <button 
                onClick={() => setShowTerms(true)}
                className="w-full py-3 bg-white border border-neutral-300 text-neutral-700 font-semibold rounded-full hover:bg-neutral-50 transition-colors"
              >
                Điều kiện sử dụng
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Navigation */}
      <Navigation />

      {/* Popups */}
      <TermsPopup isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}
