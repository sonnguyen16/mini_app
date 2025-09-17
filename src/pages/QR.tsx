import React, { FC, useState, useEffect } from "react";
import { Page, Header, Box, Text } from "zmp-ui";
import { useProfile } from "../hooks/useAuth";
import { initializeApp } from "../services";
import userService from "../services/user";
import QRCode from "qrcode";
import { env } from "../config/env";

const PointsQRPage: FC = () => {
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  // Sử dụng React Query hooks
  const { profile, isLoading: profileLoading } = useProfile();

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

  // Tạo user object từ userData và profile
  const cachedUserData = userService.getCachedUserData();
  const user = {
    ...profile,
    name:
      cachedUserData.userInfo?.name || userData.userInfo?.name || "Người dùng",
    avatar:
      cachedUserData.userInfo?.avatar ||
      userData.userInfo?.avatar ||
      "avatar.jpg",
    phone: cachedUserData.phoneNumber || userData.phoneNumber || "",
  };

  // Generate QR code when user data is available
  useEffect(() => {
    const generateQRCode = async () => {
      if (!loading && user.phone) {
        try {
          const qrData = {
            phone: user.phone,
            app_id: env.APP_ID,
          };

          const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
            width: 256,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });

          setQrCodeDataUrl(qrDataUrl);
        } catch (error) {
          console.error("Lỗi tạo QR code:", error);
        }
      }
    };

    generateQRCode();
  }, [loading, user.phone, userData.userInfo?.id]);
  return (
    <Page className="bg-background">
      <Header title="QR Tích điểm" showBackIcon />

      {/* thẻ QR */}
      <Box className="px-4 py-4">
        <div className="rounded-3xl bg-white shadow-sm border border-neutral-200 p-4">
          <div className="rounded-2xl bg-neutral-50 p-3">
            <div className="aspect-square w-full rounded-xl bg-white flex items-center justify-center">
              {loading ? (
                <div className="text-gray-500">Đang tải QR...</div>
              ) : qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📱</div>
                  <div className="text-sm">Không thể tạo QR code</div>
                </div>
              )}
            </div>

            {/* đường gạch đứt */}
            <div className="my-4 border-t border-dashed border-neutral-300" />

            {/* dòng điểm */}
            <Text className="text-center text-neutral-500">
              {loading ? "Đang tải..." : `Bạn có ${user.points_total} điểm`}
            </Text>
          </div>
        </div>
      </Box>

      {/* chừa chỗ cho bottom navigation */}
      <div className="h-24" />
    </Page>
  );
};

export default PointsQRPage;
