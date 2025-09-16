import React, { FC } from "react";
import { Page, Header, Box, Text } from "zmp-ui";

// Nếu bạn đã có userId/qrUrl thật, truyền vào đây
const USER_ID = "1955813018143113216";
const QR_IMAGE = "qr.png"; // đổi thành ảnh QR thật của bạn

const PointsQRPage: FC = () => {
  return (
    <Page className="bg-background">
      <Header title="QR Tích điểm" showBackIcon />

      {/* phần giới thiệu */}
      <Box className="px-4 pt-2">
        <Text className="text-center text-neutral-600">
          Bạn cần chi tiêu thêm
        </Text>
        <Text className="text-center font-semibold text-neutral-700">
          700.000 VNĐ để thăng hạng Silver
        </Text>
      </Box>

      {/* thẻ QR */}
      <Box className="px-4 py-4">
        <div className="rounded-3xl bg-white shadow-sm border border-neutral-200 p-4">
          <div className="rounded-2xl bg-neutral-50 p-3">
            <div className="aspect-square w-full rounded-xl bg-white ">
              {/* Dùng ảnh QR (thay URL) hoặc tích hợp lib qrcode.react nếu muốn render động */}
              <img src={QR_IMAGE} alt="QR tích điểm" className="h-auto" />
            </div>

            {/* ID ở dưới QR */}
            <Text className="mt-3 text-center font-semibold text-neutral-800">
              ID: {USER_ID}
            </Text>

            {/* đường gạch đứt */}
            <div className="my-4 border-t border-dashed border-neutral-300" />

            {/* dòng drips */}
            <Text className="text-center text-neutral-500">
              Bạn có 0 điểm Drips
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
