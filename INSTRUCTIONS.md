Bạn là lập trình viên mobile senior (React + Zalo Mini App) có kinh nghiệm tích hợp API vào ứng dụng loyalty (điểm/voucher). Nhiệm vụ: **đấu nối API theo Postman collection** và **thay thế mock data** trên các màn hình hiện có, đảm bảo chạy thật trên Zalo Mini App và web build (H5) nếu có.

- State/Query: ưu tiên **React Query** (hoặc SWR).
- HTTP client: **fetch** hoặc **axios** (tùy chọn, mặc định axios).
- Chuẩn header: gắn **Bearer token** và **`X-App-Id`** vào mọi request (giá trị lấy từ config/ENV hoặc sau đăng nhập).
- Nguồn API: API_DOCUMENTATION.md
- Không hardcode URL; đọc từ `.env` (VD: `VITE_API_BASE_URL`, `VITE_APP_ID`).
- Code sạch, tách **/api client**, **/services**, **/hooks**, **/types**; có **loading/error states**, **retry**, **throttling** cho search.
- Mặc định tất cả endpoint **scope theo app_id** (qua header `X-App-Id`).

## Context mã nguồn cần gắn API

- **Trang chủ** (hiển thị deal/voucher -> điều hướng chi tiết): thay mock ở component trang Home.&#x20;
- **Chi tiết voucher** (đổi voucher, xem điều kiện): bind hành vi `Đổi voucher ngay`;
- **QR tích điểm** (hiển thị QR/ID người dùng): thay QR mock bằng dữ liệu thật (gen QR theo profile lấy từ api /me thành { "phone": phone, "app_id": app_id }).;
- **Tài khoản (Profile)** (xem/cập nhật thông tin, xem policy): thay user mock, thêm gọi API me + update.&#x20;
- **Quà tặng/Gifts** (filter theo danh mục, tên, đổi quà, tabs đã đổi/đã dùng): thay mock list bằng API categories/vouchers/wallet.&#x20;

## Bản đồ endpoint → màn hình (theo mô tả yêu cầu & collection)

> _Dùng collection làm nguồn sự thật để lấy **đúng path, method, schema**; dưới đây là ánh xạ chức năng → nhóm endpoint cần gọi._

1. **Auth & Profile**

   - `POST /auth/login`,
   - `GET /me`, `PUT /me` → màn **Profile** (đọc/cập nhật); bind vào file profile.;

2. **Danh mục & Voucher**

   - `GET /categories?active=1` → filter ở **Gifts**.&#x20;
   - `GET /vouchers` (query: `category_id`, `keyword`) → thay list VOUCHER Dành cho bạn ở **Home** và list ở gift
   - `GET /vouchers/latest` → “HOT DEAL” trên Home.&#x20;
   - `GET /vouchers/{id}` → data màn **chi tiết**.&#x20;

3. **Đổi/Sử dụng & Ví voucher**

   - `POST /vouchers/{id}/redeem` → nút **Đổi voucher ngay** ở chi tiết.&#x20;
   - `GET /wallet` (filter theo `status=owned/redeemed/used/expired`) → tabs **Redeemed/Used** trong Gifts.&#x20;
   - `POST /wallet/{code}/use` → hành vi **Sử dụng** (sau này thêm nút trong chi tiết hoặc ví).
   - `GET /history` → **Lịch sử** (nút ở Home/Profile sau này, cần thêm màn hình lịch sử);

4. **Chính sách**

   - `GET /policies/membership`, `GET /policies/privacy` → popup ở **Profile**.&#x20;

5. **QR tích điểm**

   - Hiển thị {"phone": phone, "app_id": app_id} lấy từ api /profile dưới dạng QR:
   - Dùng lib `qrcode.react` hoặc ảnh từ API nếu trả về `qr_url`. Gắn vào file QR.&#x20;

## Yêu cầu triển khai

### 1) Tầng cấu hình & HTTP client

- Tạo `src/config/env.ts` (đọc `VITE_API_BASE_URL`, `VITE_APP_ID`), `src/libs/http.ts` (axios instance).
- Interceptor: gắn `Authorization: Bearer ${token}` và `X-App-Id: ${APP_ID}`.
- Xử lý **401**: Unauthenticated; **422**: show validation; **429/5xx**: retry/backoff (axios-retry).

### 2) Tầng dịch vụ & hooks

- `src/services/auth.ts`: `login`, `logout`, `register`(opt), `getMe`, `updateMe`.
- `src/services/catalog.ts`: `getCategories`, `getVouchers`, `getLatestVouchers`, `getVoucherById`.
- `src/services/wallet.ts`: `redeemVoucher`, `useVoucher`, `getWallet`, `getHistory`.
- `src/services/policies.ts`: `getMembershipPolicy`, `getPrivacyPolicy`.
- `src/hooks/useAuth.ts`, `useProfile.ts`, `useVouchers.ts`, `useWallet.ts` (React Query).
- `src/types/*.ts`: sinh types từ **Postman** (có thể export schema và tinh chỉnh).

### 3) Thay mock bằng data API — theo từng màn hình

**a) Home** (file trang chủ):

- Thay arrays `deals`, `vouchers`, `news` bằng query:

  - `useQuery(['vouchers/latest'], getLatestVouchers)` cho “HOT DEAL”.
  - `useQuery(['vouchers'], getVouchers)` cho “Voucher dành cho bạn”.

- Khi click item → chuyển sang `/voucher-detail` và truyền **id**; trên **VoucherDetail** sẽ fetch theo `id` thay vì state mock.&#x20;

**b) Voucher Detail**:

- Lấy `voucherId` từ router params/state → `useQuery(['voucher', id], getVoucherById)`.
- Nút **Đổi voucher ngay** → gọi `redeemVoucher(id)`; on success:

  - Hiện toast “Đổi thành công”, **navigate** đến “Ví voucher” tab (hoặc hiển thị code + QR).

- Nút “Điều kiện sử dụng” → đọc từ field `usage_condition` (HTML) trả về API, render an toàn (sanitize).&#x20;

**c) QR Page**:

- Hiển thị {"phone": phone, "app_id": app_id} lấy từ api /profile dưới dạng QR.

**d) Profile**:

- Thay object `user` cứng bằng `GET /me`; show loading skeleton.
- Nút **Cập nhật** → mở form sheet/modal, submit `PUT /me`; sync cache `me`.
- Hai nút “Chính sách…” → gọi `GET /policies/membership`, `GET /policies/privacy` và render nội dung trong popup (CKEditor HTML).&#x20;

**e) Gifts**:

- Tabs:

  - **Ưu đãi**: `getVouchers` + query `category_id`, `keyword`; map categories từ `getCategories`, nếu chọn tất cả thì không cần query `category_id`.
  - **Đã đổi**: `getWallet({ status:'redeemed' })`.
  - **Đã dùng**: `getWallet({ status:'used' })`.

- Nút **Đổi** trên mỗi card → `redeemVoucher(voucher.id)`; success: refetch `wallet`.&#x20;

### 4) Trải nghiệm & trạng thái

- **Loading**: shimmer/skeleton cho thẻ voucher, profile, QR.
- **Error**: toast + nút `Thử lại`; với 401 → điều hướng login (nếu có).
- **Empty state**: dùng component `EmptyState` sẵn có (Gifts) cho danh sách rỗng.&#x20;

### 5) Zalo Mini App lưu trữ & login

- Lưu token & appId bằng **zmp-sdk** `Storage` (hoặc secure store tuỳ môi trường).

### 6) Kiểm thử end-to-end

- Luồng: **Login → /me → List vouchers → Detail → Redeem → Wallet → Use**.
- Kiểm tra query params: filter theo category, keyword
- Test thời hạn voucher (expire), số lượng, điểm không đủ (422).
- Đảm bảo mọi request có `Authorization` + `X-App-Id`.

## Deliverables

1. **/libs/http.ts** (axios instance + interceptors).
2. **/services/\*.ts**, **/hooks/\*.ts**, **/types/\*.ts** sinh từ collection.
3. **Chỉnh sửa các file UI** để dùng data thật, loại bỏ mock (các file: Home, VoucherDetail, QR, Profile, Gifts). &#x20;
4. **.env.example** với `VITE_API_BASE_URL`, `VITE_APP_ID`.
5. **README**: hướng dẫn chạy Mini App & H5, cấu hình token, cách swap môi trường (staging/prod).

## Tiêu chí hoàn thành

- Không còn dữ liệu mock; tất cả danh sách/chi tiết/QR/policy/profile dùng API thật.
- Redeem/Use hoạt động, trạng thái ví phản ánh đúng sau refetch.
- Code tách lớp rõ ràng, dễ thay đổi endpoint.
- Lỗi/empty/loading hiển thị chuẩn, không crash khi 401/422/429.
