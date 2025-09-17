import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Modal, Input, Select, DatePicker } from "zmp-ui";
import { Navigation } from "../components/navigation";
import { useMembershipPolicy, usePrivacyPolicy } from "../hooks/usePolicies";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import { userService } from "../services/user";
import { initializeApp } from "../services";

// Component popup chính sách thành viên
function MemberPolicyPopup({
  isOpen,
  onClose,
  membershipPolicy,
  membershipLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  membershipPolicy?: string;
  membershipLoading: boolean;
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
            Chính sách thành viên
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
          {membershipLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-gray-500">Đang tải...</div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: membershipPolicy || "" }} />
          )}
        </div>
      </div>
    </div>
  );
}

// Component popup chính sách bảo mật
function PrivacyPolicyPopup({
  isOpen,
  onClose,
  privacyPolicy,
  privacyLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  privacyPolicy?: string;
  privacyLoading: boolean;
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
            Chính sách bảo mật
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
          {privacyLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-gray-500">Đang tải...</div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: privacyPolicy || "" }} />
          )}
        </div>
      </div>
    </div>
  );
}

// Component popup cập nhật thông tin
function UpdateProfilePopup({
  isOpen,
  onClose,
  profileForm,
  setProfileForm,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  profileForm: { gender: string; birthday: string; address: string };
  setProfileForm: (form: {
    gender: string;
    birthday: string;
    address: string;
  }) => void;
  onSave: () => void;
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
            Cập nhật thông tin
          </h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#B21F2D] text-white flex items-center justify-center text-lg"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh] space-y-4">
          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới tính
            </label>
            <select
              value={profileForm.gender}
              onChange={(e) =>
                setProfileForm({ ...profileForm, gender: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B21F2D] focus:border-transparent"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sinh
            </label>
            <input
              type="date"
              value={
                new Date(profileForm.birthday || "").toISOString().split("T")[0]
              }
              onChange={(e) =>
                setProfileForm({ ...profileForm, birthday: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B21F2D] focus:border-transparent"
            />
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <textarea
              value={profileForm.address}
              onChange={(e) =>
                setProfileForm({ ...profileForm, address: e.target.value })
              }
              placeholder="Nhập địa chỉ của bạn"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B21F2D] focus:border-transparent resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                onSave();
                handleClose();
              }}
              className="flex-1 py-3 px-4 bg-[#B21F2D] text-white rounded-lg font-medium hover:bg-[#8F1722] transition-colors"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showMemberPolicy, setShowMemberPolicy] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    gender: "",
    birthday: "",
    address: "",
  });

  // Sử dụng React Query hooks
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const { data: membershipPolicy, isLoading: membershipLoading } =
    useMembershipPolicy();
  const { data: privacyPolicy, isLoading: privacyLoading } = usePrivacyPolicy();

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
            name: "Sơn",
            avatar: "avatar.jpg",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const cachedUserData = userService.getCachedUserData();
  const user = {
    name:
      profileData?.name ||
      cachedUserData.userInfo?.name ||
      userData.userInfo?.name ||
      "Người dùng",
    avatar:
      cachedUserData.userInfo?.avatar ||
      userData.userInfo?.avatar ||
      "avatar.jpg",
    phone:
      profileData?.user?.phone ||
      cachedUserData.phoneNumber ||
      userData.phoneNumber ||
      "",
    gender: profileData?.gender || userData.userInfo?.gender || "",
    birthday: profileData?.birthday || userData.userInfo?.birthday || "",
    address: profileData?.address || userData.userInfo?.address || "",
    points_total:
      profileData?.points_total || userData.userInfo?.points_total || 0,
  };

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        gender: user.gender || "",
        birthday: user.birthday || "",
        address: user.address || "",
      });
    }
  }, [user.gender, user.birthday, user.address]);

  const handleUpdateProfile = () => {
    setShowUpdateProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        name: user.name, // Giữ nguyên tên hiện tại
        gender: profileForm.gender || undefined,
        birthday: profileForm.birthday || undefined,
        address: profileForm.address || undefined,
      });

      setShowUpdateProfile(false);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      // TODO: Hiển thị thông báo lỗi cho user
    }
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
              Member
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
                  {user.points_total} điểm
                </div>
              </div>
            </div>
          </div>

          {/* Progress to next tier */}
          {/* <div className="p-4">
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
                <div className="font-semibold">Silver</div>
                <div className="text-neutral-500 text-xs">Trên 700k</div>
              </div>
            </div>
          </div> */}
        </section>

        {/* Policy list */}
        <section className="space-y-3">
          <button
            onClick={() => navigate("/transaction-history")}
            className="w-full rounded-2xl bg-white border border-neutral-200 shadow-sm px-4 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
          >
            <div className="text-[15px] font-medium flex items-center gap-3">
              Lịch sử giao dịch
            </div>
            <div className="text-neutral-400">›</div>
          </button>
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
            <button
              onClick={handleUpdateProfile}
              className="text-sm font-semibold flex items-center gap-2"
            >
              <span>✎</span> Cập nhật
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm divide-y divide-neutral-200">
            <Row label="Họ tên" value={user.name} />
            <Row
              label="Giới tính"
              value={
                user.gender === "male"
                  ? "Nam"
                  : user.gender === "female"
                  ? "Nữ"
                  : "Khác"
              }
            />
            <Row
              label="Ngày sinh"
              value={new Date(user.birthday || "").toLocaleDateString("vi-VN")}
            />
            <Row label="Số điện thoại" value={user.phone} />
            <Row label="Địa chỉ" value={user.address || ""} />
            <Row label="Tổng điểm" value={`${user.points_total} điểm`} />
          </div>
        </section>
      </main>

      <Navigation />

      {/* Popups */}
      <MemberPolicyPopup
        isOpen={showMemberPolicy}
        onClose={() => setShowMemberPolicy(false)}
        membershipPolicy={membershipPolicy}
        membershipLoading={membershipLoading}
      />
      <PrivacyPolicyPopup
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        privacyPolicy={privacyPolicy}
        privacyLoading={privacyLoading}
      />
      <UpdateProfilePopup
        isOpen={showUpdateProfile}
        onClose={() => setShowUpdateProfile(false)}
        profileForm={profileForm}
        setProfileForm={setProfileForm}
        onSave={handleSaveProfile}
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
