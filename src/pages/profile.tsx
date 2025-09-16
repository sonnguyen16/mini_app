import React, { useState, useEffect } from "react";
import { Navigation } from "../components/navigation";
import { Header } from "zmp-ui";
import { userService, UserData } from "../services/userService";

const defaultUser = {
  name: "Sơn",
  tier: "Member",
  nextTier: "Silver",
  avatar: "avatar.jpg",
  drips: 0,
  spend: 0,
  nextTierNeed: 700_000,
  gender: "Khác",
  birthday: "--",
  phone: "0909090909",
  address: "123 Đường ABC, Quận XYZ, TP. HCM",
};

// Component popup chính sách thành viên
function MemberPolicyPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal - slide up from bottom */}
      <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden transform transition-transform duration-300 ease-out translate-y-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-center flex-1">
            Chính sách thành viên
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#B21F2D] text-white flex items-center justify-center text-lg"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh] pb-20">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold mb-2">
              ĐIỀU KHOẢN VÀ ĐIỀU KIỆN CỦA CHƯƠNG TRÌNH THÀNH VIÊN HIGHLANDS
              COFFEE
            </h2>
            <div className="text-yellow-600 font-bold text-lg">
              👑 HIGHLANDS REWARDS 👑
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Ngày cập nhật: 02/06/2025
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-3">
              ĐẶC QUYỀN THÀNH VIÊN HIGHLANDS REWARDS
            </h3>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">
                      Hạng Thành Viên
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Member
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Phín Bạc
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 font-medium">
                      Mức Chi Tiêu
                    </td>
                    <td className="border border-gray-300 p-2">
                      0 - 699.999 VNĐ
                    </td>
                    <td className="border border-gray-300 p-2">
                      Từ 700.000 VNĐ trở lên
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-medium">
                      Quà Tặng Dành Cho Khách Hàng Mới
                    </td>
                    <td className="border border-gray-300 p-2">
                      Giảm 50% (tối đa 15k) áp dụng cho hóa đơn từ 30k
                    </td>
                    <td className="border border-gray-300 p-2">
                      <div className="text-xs">
                        <p>
                          *Khách hàng mới: Là các khách hàng chưa từng tham
                          gia/chia sẻ thông tin với Highlands thông qua các
                          chương trình:
                        </p>
                        <p>+ Chill Hè</p>
                        <p>+ Săn Vàng Highlands</p>
                        <p>+ Form điền thông tin Bạn Mới</p>
                        <p>
                          + Các khách hàng đã đăng ký tài khoản thành viên trên
                          ứng dụng Highlands Coffee
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-medium">
                      Đặc quyền
                    </td>
                    <td className="border border-gray-300 p-2">
                      Ưu đãi từ đối tác và
                    </td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component popup chính sách bảo mật
function PrivacyPolicyPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal - slide up from bottom */}
      <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden transform transition-transform duration-300 ease-out translate-y-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-center flex-1">
            Chính sách bảo mật
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#B21F2D] text-white flex items-center justify-center text-lg"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh] pb-20">
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-bold mb-2">1. Thu thập thông tin</h4>
              <p>
                Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài
                khoản, sử dụng dịch vụ hoặc tương tác với ứng dụng của chúng
                tôi.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">2. Sử dụng thông tin</h4>
              <p>
                Thông tin của bạn được sử dụng để cung cấp dịch vụ, cải thiện
                trải nghiệm người dùng và gửi thông báo về các chương trình
                khuyến mãi.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">3. Bảo mật thông tin</h4>
              <p>
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện
                pháp bảo mật phù hợp và không chia sẻ với bên thứ ba mà không có
                sự đồng ý của bạn.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">4. Quyền của người dùng</h4>
              <p>
                Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của
                mình bất kỳ lúc nào thông qua ứng dụng hoặc liên hệ với chúng
                tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [showMemberPolicy, setShowMemberPolicy] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = userService.getCachedUserData();
        if (data.userInfo) {
          setUserData(data);
        } else {
          await userService.getUserInfo();
          await userService.getPhoneNumber();
          setUserData(userService.getCachedUserData());
        }
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

  // Tạo user object từ userData và defaultUser
  const user = {
    ...defaultUser,
    name: userData.userInfo?.name || defaultUser.name,
    avatar: userData.userInfo?.avatar || defaultUser.avatar,
    phone: userData.phoneNumber || defaultUser.phone,
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Header */}
      <Header title="Tài khoản" showBackIcon />

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Member card */}
        <section className="rounded-3xl overflow-hidden shadow-sm bg-white border border-neutral-200">
          <div className="bg-[#B21F2D] text-white p-4">
            <div className="text-xs font-extrabold tracking-wider opacity-90">
              {user.tier.toUpperCase()}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <img
                src={user.avatar}
                alt="avatar"
                className="h-12 w-12 rounded-full object-cover border border-white/50"
              />
              <div className="flex-1">
                <div className="text-xl font-semibold leading-tight">
                  {loading ? "Đang tải..." : user.name}
                </div>
                <div className="text-sm text-white/90">Thành viên</div>
              </div>
              <div className="w-px self-stretch bg-white/40 mx-1" />
              <div className="flex flex-col items-end">
                <div className="px-3 py-1 rounded-full bg-white text-[#B21F2D] text-sm font-bold">
                  {user.drips}{" "}
                </div>
                <button className="mt-2 text-xs underline decoration-white/40/">
                  Lịch sử giao dịch
                </button>
              </div>
            </div>
          </div>

          {/* Progress to next tier */}
          <div className="p-4">
            <h3 className="text-base font-extrabold">LỘ TRÌNH THĂNG HẠNG</h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="text-2xl">🥤</div>
              <div className="flex-1 h-2 rounded-full bg-neutral-200" />
              <div className="text-2xl">🥤</div>
            </div>
            <div className="mt-3 flex items-end justify-between text-sm">
              <div>
                <div className="font-semibold">Member</div>
                <div className="text-neutral-500 text-xs">0 - 699k</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{user.nextTier}</div>
                <div className="text-neutral-500 text-xs">Trên 700k</div>
              </div>
            </div>
          </div>
        </section>

        {/* Policy list */}
        <section className="space-y-3">
          <button
            onClick={() => setShowMemberPolicy(true)}
            className="w-full rounded-2xl bg-white border border-neutral-200 shadow-sm px-4 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
          >
            <div className="text-[15px] font-medium">
              Chính sách chương trình thành viên
            </div>
            <div className="text-neutral-400">›</div>
          </button>
          <button
            onClick={() => setShowPrivacyPolicy(true)}
            className="w-full rounded-2xl bg-white border border-neutral-200 shadow-sm px-4 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
          >
            <div className="text-[15px] font-medium">Chính sách bảo mật</div>
            <div className="text-neutral-400">›</div>
          </button>
        </section>

        {/* Account info */}
        <section className="mt-2">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-xl font-extrabold">Tài Khoản</h3>
            <button className="text-sm font-semibold flex items-center gap-2">
              <span>✎</span> Cập nhật
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm divide-y divide-neutral-200">
            <Row label="Họ tên" value={user.name} />
            <Row label="Giới tính" value={user.gender} />
            <Row label="Ngày sinh" value={user.birthday} />
            <Row label="Số điện thoại" value={user.phone} />
            <Row label="Địa chỉ" value={user.address} />
          </div>
        </section>
      </main>

      <Navigation />

      {/* Popups */}
      <MemberPolicyPopup
        isOpen={showMemberPolicy}
        onClose={() => setShowMemberPolicy(false)}
      />
      <PrivacyPolicyPopup
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="text-neutral-600">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
