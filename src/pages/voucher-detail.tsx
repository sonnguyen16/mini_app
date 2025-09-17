import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header, Modal } from "zmp-ui";
import { getImageUrl } from "../utils/utils";
import { useRedeemVoucher } from "../hooks/useVouchers";
import { useUseVoucher } from "../hooks/useWallet";
import QRCode from "qrcode";

// Interface cho voucher data
interface VoucherData {
  id: string;
  image: string;
  name: string;
  description: string;
  detail: string;
  expire_at?: string;
  required_points?: number;
  usage_condition?: string;
  category?: any;
  redeemed?: boolean;
  used?: boolean;
  code?: string;
}

// Component popup điều kiện sử dụng
function TermsPopup({
  isOpen,
  onClose,
  usageCondition,
}: {
  isOpen: boolean;
  onClose: () => void;
  usageCondition?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal - slide up from bottom */}
      <div
        className={`relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden transform transition-transform duration-300 ease-out ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 className="text-lg font-bold text-center flex-1">
            Điều kiện sử dụng
          </h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#B21F2D] text-white flex items-center justify-center text-lg"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh] pb-20">
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: usageCondition || "" }}
          />
        </div>
      </div>
    </div>
  );
}

// Component chính màn hình chi tiết voucher
export default function VoucherDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [localVoucherData, setLocalVoucherData] = useState<VoucherData | null>(
    null
  );

  // Hooks cho mutations
  const redeemMutation = useRedeemVoucher();
  const useMutation = useUseVoucher();

  // Lấy dữ liệu từ navigation state hoặc dùng mock data
  const itemData = location.state?.item;
  const initialVoucherData: VoucherData = itemData ?? {
    id: "aka-house-100k",
    image: "/deal1.jpg",
    name: "Aka House",
    detail: "",
    description: "Các Cửa Hàng Aka House Tại Trung Tâm TP. HCM",
    expire_at: "23:59 31/10/2025",
    points_required: 100,
  };

  // Sử dụng local state để cập nhật trạng thái voucher ngay lập tức
  const voucherData = localVoucherData || initialVoucherData;

  // Initialize local data
  useEffect(() => {
    if (!localVoucherData) {
      setLocalVoucherData(initialVoucherData);
    }
  }, [initialVoucherData, localVoucherData]);

  const handleRedeem = () => {
    setShowRedeemModal(true);
  };

  const handleConfirmRedeem = async () => {
    try {
      const result = await redeemMutation.mutateAsync(parseInt(voucherData.id));
      // Cập nhật trạng thái local ngay lập tức
      setLocalVoucherData((prev) => ({
        ...prev!,
        redeemed: true,
        used: false,
        code: result.code || prev!.code,
      }));
      setShowRedeemModal(false);
      // Navigate về /cart và chuyển sang tab "đã đổi"
      navigate("/cart", { state: { activeTab: "redeemed" } });
    } catch (error) {
      console.error("Lỗi khi đổi voucher:", error);
    }
  };

  const handleUseVoucher = async () => {
    try {
      const result = await useMutation.mutateAsync(
        voucherData.code || voucherData.id
      );
      const code = result.code || voucherData.code || voucherData.id;
      setGeneratedCode(code);

      // Tạo QR code
      const qrDataUrl = await QRCode.toDataURL(code, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeDataUrl(qrDataUrl);

      // Cập nhật trạng thái local ngay lập tức
      setLocalVoucherData((prev) => ({
        ...prev!,
        used: true,
        redeemed: false,
      }));

      setShowQRModal(true);
    } catch (error) {
      console.error("Lỗi khi sử dụng voucher:", error);
    }
  };

  const handleViewQRCode = async () => {
    const code = voucherData.code || voucherData.id;
    setGeneratedCode(code);

    // Tạo QR code
    const qrDataUrl = await QRCode.toDataURL(code, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    setQrCodeDataUrl(qrDataUrl);
    setShowQRModal(true);
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
            {/* Food image on the right */}
            <div className="absolute right-0 top-0 h-full w-full">
              <img
                src={getImageUrl(voucherData.image)}
                alt="Food"
                className="h-full w-full object-cover opacity-80"
              />
            </div>
          </div>

          {/* Voucher Info */}
          <div className="p-4">
            <h2 className="text-lg font-bold mb-1">
              {voucherData.category?.name || voucherData.name}
            </h2>
            <h3 className="text-xl font-bold text-[#B21F2D] mb-2">
              {voucherData.name}
            </h3>

            {/* expire_at and Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-neutral-600">
                Hạn sử dụng:{" "}
                <span className="font-medium">
                  {new Date(voucherData.expire_at || "").toLocaleString(
                    "vi-VN"
                  )}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <span className="flex items-center gap-1">
                  🏆{" "}
                  <span className="font-medium">
                    {voucherData.required_points}
                  </span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="max-h-[calc(100vh-650px)] mb-5 overflow-y-auto">
              <p className="text-sm text-neutral-700 mb-4">
                {voucherData.description}
              </p>
              <p className="text-sm text-neutral-600 mb-6">
                {voucherData.detail}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {voucherData.redeemed && (
                <button
                  onClick={handleUseVoucher}
                  disabled={useMutation.isPending}
                  className="w-full py-3 bg-[#B21F2D] text-white font-semibold rounded-full shadow-sm hover:bg-[#8F1722] transition-colors disabled:opacity-50"
                >
                  {useMutation.isPending ? "Đang xử lý..." : "Sử dụng"}
                </button>
              )}
              {voucherData.used && (
                <button
                  onClick={handleViewQRCode}
                  className="w-full py-3 bg-[#B21F2D] text-white font-semibold rounded-full shadow-sm hover:bg-[#8F1722] transition-colors"
                >
                  Xem mã QR
                </button>
              )}
              {!voucherData.redeemed && !voucherData.used && (
                <button
                  onClick={handleRedeem}
                  disabled={redeemMutation.isPending}
                  className="w-full py-3 bg-[#B21F2D] text-white font-semibold rounded-full shadow-sm hover:bg-[#8F1722] transition-colors disabled:opacity-50"
                >
                  {redeemMutation.isPending
                    ? "Đang đổi..."
                    : "Đổi voucher ngay"}
                </button>
              )}

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

      {/* Terms Popup */}
      <TermsPopup
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        usageCondition={voucherData.usage_condition}
      />

      {/* Modal xác nhận redeem voucher */}
      <Modal
        visible={showRedeemModal}
        title="Xác nhận đổi voucher"
        description={`Bạn có chắc chắn muốn đổi voucher "${voucherData.name}" với ${voucherData.required_points} điểm không?`}
        coverSrc={getImageUrl(voucherData.image)}
        actions={[
          {
            text: "Hủy",
            onClick: () => setShowRedeemModal(false),
          },
          {
            text: redeemMutation.isPending ? "Đang xử lý..." : "Đồng ý",
            highLight: true,
            onClick: handleConfirmRedeem,
          },
        ]}
        onClose={() => setShowRedeemModal(false)}
      />

      {/* Modal QR Code cho sử dụng voucher */}
      <Modal
        visible={showQRModal}
        title="Mã QR Voucher"
        description="Vui lòng xuất trình mã QR này tại cửa hàng để sử dụng voucher"
        actions={[
          {
            text: "Đóng",
            close: true,
            onClick: () => setShowQRModal(false),
          },
        ]}
        onClose={() => setShowQRModal(false)}
      >
        <div className="flex flex-col items-center py-6">
          {/* QR Code thực tế */}
          <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4 p-4">
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2">📱</div>
                <div className="text-sm font-mono break-all px-2">
                  {generatedCode}
                </div>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600 text-center">
            Mã voucher:{" "}
            <span className="font-mono font-semibold">{generatedCode}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
