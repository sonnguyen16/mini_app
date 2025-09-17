# API Documentation - Mini App API

## Base URL

```
https://mini.alwaysdata.net/api/v1
```

## Authentication

Hầu hết các API yêu cầu authentication token thông qua Bearer Token trong header:

```
Authorization: Bearer {token}
```

## Headers chung

```
Content-Type: application/json
Accept: application/json
X-App-Id: {app_id} (bắt buộc cho các API protected)
```

---

## 🔐 Authentication APIs

### 1. Đăng nhập qua Secret Key

**Endpoint:** `POST /auth/login`

**Headers:**

```
Content-Type: application/json
Accept: application/json
```

**Request Body:**

```json
{
  "phone": "0123456789", // (lấy trong userService)
  "secret_key": "your_secret_key", // (lấy trong env import.meta.env.VITE_SECRET_KEY)
  "name": "Nguyễn Văn A" // (lấy trong userService)
}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "phone": "0123456789",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    "profile": {
      "id": 1,
      "user_id": 1,
      "app_id": 1,
      "name": "Nguyễn Văn A",
      "points_total": 0,
      "active": true,
      "created_at": "2024-01-01T00:00:00.000000Z"
    },
    "token": "1|abcdef123456..."
  }
}
```

**Response Error (401):**

```json
{
  "success": false,
  "error": "Invalid secret key"
}
```

---

## 👤 Profile APIs

### 1. Lấy thông tin profile

**Endpoint:** `GET /me`

**Headers:**

```
Authorization: Bearer {token}
X-App-Id: {app_id}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "id": 41,
    "user_id": 25,
    "app_id": 1,
    "name": "Sơn",
    "birthday": null,
    "gender": null,
    "address": null,
    "points_total": 0,
    "active": true,
    "created_at": "2025-09-16T09:00:43.000000Z",
    "updated_at": "2025-09-16T09:00:43.000000Z",
    "user": {
      "id": 25,
      "email": null,
      "phone": "84817702334",
      "created_at": "2025-09-16T09:00:43.000000Z",
      "updated_at": "2025-09-16T09:00:43.000000Z"
    },
    "app": {
      "id": 1,
      "name": "Coffee Shop Rewards",
      "description": "Hệ thống tích điểm cho chuỗi cà phê",
      "logo": null,
      "owner_email": "coffee@owner.com",
      "owner_name": "Coffee Shop",
      "mini_app_id": "coffee_app_001",
      "active": true,
      "created_at": "2025-09-11T21:54:35.000000Z",
      "updated_at": "2025-09-11T21:54:35.000000Z"
    }
  }
}
```

**Response Error (404):**

```json
{
  "success": false,
  "error": "Profile not found in this app"
}
```

### 2. Cập nhật profile

**Endpoint:** `PUT /me`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
X-App-Id: {app_id}
```

**Request Body:**

```json
{
  "name": "Nguyễn Văn B",
  "birthday": "1990-01-01",
  "gender": "male",
  "address": "456 Đường XYZ, Quận 2, TP.HCM"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "id": 41,
    "user_id": 25,
    "app_id": 1,
    "name": "Sơn Nguyễn",
    "birthday": null,
    "gender": null,
    "address": null,
    "points_total": 0,
    "active": true,
    "created_at": "2025-09-16T09:00:43.000000Z",
    "updated_at": "2025-09-16T09:15:24.000000Z"
  }
}
```

---

## 📂 Categories APIs

### 1. Lấy danh sách danh mục

**Endpoint:** `GET /categories`

**Headers:**

```
Authorization: Bearer {token}
X-App-Id: {app_id}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "app_id": 1,
      "name": "Ẩm thực",
      "description": "Voucher ẩm thực",
      "active": true,
      "created_at": "2024-01-01T00:00:00.000000Z"
    },
    {
      "id": 2,
      "app_id": 1,
      "name": "Giải trí",
      "description": "Voucher giải trí",
      "active": true,
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

---

## 🎫 Vouchers APIs

### 1. Lấy danh sách vouchers

**Endpoint:** `GET /vouchers`

**Headers:**

```
Authorization: Bearer {token}
X-App-Id: {app_id}
```

**Query Parameters:**

- `category_id` (optional): ID danh mục
- `keyword` (optional): Từ khóa tìm kiếm

**Example:** `GET /vouchers?category_id=1&keyword=pizza`

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 5,
        "app_id": 1,
        "category_id": 1,
        "name": "Voucher 5 - Coffee Shop Rewards",
        "description": "Nostrum incidunt ea aut quam.",
        "image": "vouchers/voucher4.jpg",
        "detail": "Voluptatem corrupti numquam impedit cum rerum. Est vel excepturi sit voluptatem quo placeat. Dolores voluptate vel minima rerum numquam. Numquam aliquam similique officiis sapiente qui.\n\nFacilis et dolorum aut autem et. Tenetur quia nisi ut unde eius sunt. Dolore aut dolor rerum aliquam omnis velit. Quam aut dolores aut iusto qui unde est.\n\nConsectetur ut dolor harum aut consequatur. Eum excepturi corporis fuga sint facilis incidunt provident. Qui fugit quo qui ducimus ea voluptas.",
        "required_points": 100,
        "expire_at": "2026-02-04T00:26:04.000000Z",
        "usage_condition": "Nesciunt inventore aut quia recusandae. Beatae est voluptas nulla qui dolor eius. Et voluptas dolorum necessitatibus sint fugiat. Et sunt id est eaque voluptatem dolores molestias impedit.\n\nQui quia sed et voluptatem iste non. Magnam est eos qui distinctio enim sit excepturi. Quisquam voluptas non cum sunt ea earum dolores in. Modi rerum similique animi voluptates quas numquam.",
        "quantity": 29,
        "active": true,
        "created_at": "2025-09-11T21:54:39.000000Z",
        "updated_at": "2025-09-11T21:54:39.000000Z",
        "category": {
          "id": 1,
          "app_id": 1,
          "name": "Đồ uống",
          "icon": "fas fa-coffee",
          "active": true,
          "created_at": "2025-09-11T21:54:38.000000Z",
          "updated_at": "2025-09-11T21:54:38.000000Z"
        },
        "app": {
          "id": 1,
          "name": "Coffee Shop Rewards",
          "description": "Hệ thống tích điểm cho chuỗi cà phê",
          "logo": null,
          "owner_email": "coffee@owner.com",
          "owner_name": "Coffee Shop",
          "mini_app_id": "coffee_app_001",
          "active": true,
          "created_at": "2025-09-11T21:54:35.000000Z",
          "updated_at": "2025-09-11T21:54:35.000000Z"
        }
      },
      {
        "id": 15,
        "app_id": 1,
        "category_id": 1,
        "name": "Voucher 15 - Coffee Shop Rewards",
        "description": "Consequuntur quia aut cum dolor molestiae praesentium.",
        "image": "vouchers/voucher1.jpg",
        "detail": "Vitae sint est cupiditate omnis ut. Sequi sapiente minus harum voluptatem quae nostrum et. Ut nihil repellat hic est voluptas qui porro et.\n\nAut est quia commodi soluta non quod. Fugiat reiciendis non accusamus ipsa nulla. Accusamus quasi saepe eaque voluptatem ducimus praesentium earum.\n\nRecusandae autem et suscipit vitae nemo. Rerum minus sit nisi nisi. Ut error sit corrupti.",
        "required_points": 50,
        "expire_at": "2025-10-06T22:22:11.000000Z",
        "usage_condition": "Et ad quibusdam ea iste quas. Provident in molestias maxime porro. Aut repudiandae similique autem iure consectetur odit cupiditate. Vel saepe corporis quos assumenda eligendi.\n\nMaiores sapiente sed possimus ipsam laborum voluptas. Aliquid voluptate qui qui aperiam et magnam iure. Et quis omnis sed architecto doloribus qui dolore. Autem perspiciatis eos dolorem suscipit sapiente sit velit impedit.",
        "quantity": 12,
        "active": true,
        "created_at": "2025-09-11T21:54:39.000000Z",
        "updated_at": "2025-09-11T21:54:39.000000Z",
        "category": {
          "id": 1,
          "app_id": 1,
          "name": "Đồ uống",
          "icon": "fas fa-coffee",
          "active": true,
          "created_at": "2025-09-11T21:54:38.000000Z",
          "updated_at": "2025-09-11T21:54:38.000000Z"
        },
        "app": {
          "id": 1,
          "name": "Coffee Shop Rewards",
          "description": "Hệ thống tích điểm cho chuỗi cà phê",
          "logo": null,
          "owner_email": "coffee@owner.com",
          "owner_name": "Coffee Shop",
          "mini_app_id": "coffee_app_001",
          "active": true,
          "created_at": "2025-09-11T21:54:35.000000Z",
          "updated_at": "2025-09-11T21:54:35.000000Z"
        }
      }
    ],
    "first_page_url": "https://mini.alwaysdata.net/api/v1/vouchers?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "https://mini.alwaysdata.net/api/v1/vouchers?page=1",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "https://mini.alwaysdata.net/api/v1/vouchers?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "next_page_url": null,
    "path": "https://mini.alwaysdata.net/api/v1/vouchers",
    "per_page": 20,
    "prev_page_url": null,
    "to": 2,
    "total": 2
  }
}
```

### 2. Lấy vouchers mới nhất

**Endpoint:** `GET /vouchers/latest`

**Headers:**

```
Authorization: Bearer {token}
X-App-Id: {app_id}
```

**Query Parameters:**

- `limit` (optional): Số lượng voucher (default: 10)

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "app_id": 1,
      "category_id": 5,
      "name": "Voucher 1 - Coffee Shop Rewards",
      "description": "Rem aliquid ut laudantium et laborum maiores autem.",
      "image": "vouchers/voucher4.jpg",
      "detail": "Et dignissimos placeat doloremque officia cumque deserunt fugiat minima. Dolore quisquam maxime adipisci consequatur consequatur ipsum enim. Aut aliquid eveniet a voluptatem. Expedita dolor sint sunt itaque.\n\nOfficiis hic dolores et architecto. Impedit tenetur enim praesentium. Sed modi architecto quae sunt.\n\nEligendi occaecati minima qui illum. Amet temporibus sequi eum voluptas nisi ut harum. Deserunt est quasi qui. Quo ipsam placeat culpa beatae voluptas delectus quis.",
      "required_points": 100,
      "expire_at": "2026-01-10T08:00:28.000000Z",
      "usage_condition": "Optio officia deserunt consequatur eum omnis quia ea. Culpa doloremque sit ratione quaerat et. Voluptate perferendis nisi et culpa odit ipsam iure. Quis laboriosam explicabo iusto quo excepturi.\n\nCum quos corrupti ex ut perferendis quos. Delectus mollitia sunt facere enim porro. Totam excepturi qui iste in voluptatem sequi quia.",
      "quantity": 39,
      "active": true,
      "created_at": "2025-09-11T21:54:39.000000Z",
      "updated_at": "2025-09-11T21:54:39.000000Z",
      "category": {
        "id": 5,
        "app_id": 1,
        "name": "Dịch vụ",
        "icon": "fas fa-concierge-bell",
        "active": true,
        "created_at": "2025-09-11T21:54:39.000000Z",
        "updated_at": "2025-09-11T21:54:39.000000Z"
      },
      "app": {
        "id": 1,
        "name": "Coffee Shop Rewards",
        "description": "Hệ thống tích điểm cho chuỗi cà phê",
        "logo": null,
        "owner_email": "coffee@owner.com",
        "owner_name": "Coffee Shop",
        "mini_app_id": "coffee_app_001",
        "active": true,
        "created_at": "2025-09-11T21:54:35.000000Z",
        "updated_at": "2025-09-11T21:54:35.000000Z"
      }
    }
  ]
}
```

### 3. Đổi voucher

**Endpoint:** `POST /vouchers/{id}/redeem`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
X-App-Id: {app_id}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "user_id": 25,
    "app_id": "1",
    "voucher_id": 11,
    "code": "ZYXGH6NH",
    "status": "redeemed",
    "redeemed_at": "2025-09-16T09:31:11.000000Z",
    "expire_at": "2026-02-15T13:27:37.000000Z",
    "updated_at": "2025-09-16T09:31:11.000000Z",
    "created_at": "2025-09-16T09:31:11.000000Z",
    "id": 4,
    "voucher": {
      "id": 11,
      "app_id": 1,
      "category_id": 5,
      "name": "Voucher 11 - Coffee Shop Rewards",
      "description": "Delectus autem est et error.",
      "image": "vouchers/voucher1.jpg",
      "detail": "Expedita aliquid est itaque sunt ipsum magnam voluptas. Totam sed vero est aliquam nostrum. Reprehenderit itaque sunt maxime voluptatem ratione tenetur dicta sint. Hic repellat dolor enim numquam aut.\n\nQuo sint voluptas saepe inventore cum. Velit at sint quisquam. Explicabo rem qui dolor vel modi quis. Dicta molestias aliquam excepturi ut ipsa.\n\nDolorum qui enim cum et blanditiis qui. Hic harum qui delectus ad. Adipisci modi aperiam alias nam autem ea aliquid.",
      "required_points": 50,
      "expire_at": "2026-02-15T13:27:37.000000Z",
      "usage_condition": "Dolore eum natus dicta. Et impedit totam repellendus id deleniti.\n\nOccaecati dolor sunt consectetur ad nihil. Aliquam culpa alias deserunt debitis in. Quia exercitationem officia nesciunt esse. Eius rerum voluptates nulla est.",
      "quantity": 90,
      "active": true,
      "created_at": "2025-09-11T21:54:39.000000Z",
      "updated_at": "2025-09-11T23:44:25.000000Z"
    },
    "app": {
      "id": 1,
      "name": "Coffee Shop Rewards",
      "description": "Hệ thống tích điểm cho chuỗi cà phê",
      "logo": null,
      "owner_email": "coffee@owner.com",
      "owner_name": "Coffee Shop",
      "mini_app_id": "coffee_app_001",
      "active": true,
      "created_at": "2025-09-11T21:54:35.000000Z",
      "updated_at": "2025-09-11T21:54:35.000000Z"
    }
  }
}
```

**Response Error (400):**

```json
{
  "success": false,
  "error": "Không đủ điểm để đổi voucher"
}
```

### 4. Sử dụng voucher

**Endpoint:** `POST /wallet/{code}/use`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
X-App-Id: {app_id}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "id": 4,
    "user_id": 25,
    "app_id": 1,
    "voucher_id": 11,
    "code": "ZYXGH6NH",
    "status": "used",
    "redeemed_at": "2025-09-16T09:31:11.000000Z",
    "used_at": "2025-09-16T09:31:46.000000Z",
    "expire_at": "2026-02-15T13:27:37.000000Z",
    "created_at": "2025-09-16T09:31:11.000000Z",
    "updated_at": "2025-09-16T09:31:46.000000Z",
    "voucher": {
      "id": 11,
      "app_id": 1,
      "category_id": 5,
      "name": "Voucher 11 - Coffee Shop Rewards",
      "description": "Delectus autem est et error.",
      "image": "vouchers/voucher1.jpg",
      "detail": "Expedita aliquid est itaque sunt ipsum magnam voluptas. Totam sed vero est aliquam nostrum. Reprehenderit itaque sunt maxime voluptatem ratione tenetur dicta sint. Hic repellat dolor enim numquam aut.\n\nQuo sint voluptas saepe inventore cum. Velit at sint quisquam. Explicabo rem qui dolor vel modi quis. Dicta molestias aliquam excepturi ut ipsa.\n\nDolorum qui enim cum et blanditiis qui. Hic harum qui delectus ad. Adipisci modi aperiam alias nam autem ea aliquid.",
      "required_points": 50,
      "expire_at": "2026-02-15T13:27:37.000000Z",
      "usage_condition": "Dolore eum natus dicta. Et impedit totam repellendus id deleniti.\n\nOccaecati dolor sunt consectetur ad nihil. Aliquam culpa alias deserunt debitis in. Quia exercitationem officia nesciunt esse. Eius rerum voluptates nulla est.",
      "quantity": 90,
      "active": true,
      "created_at": "2025-09-11T21:54:39.000000Z",
      "updated_at": "2025-09-11T23:44:25.000000Z"
    },
    "app": {
      "id": 1,
      "name": "Coffee Shop Rewards",
      "description": "Hệ thống tích điểm cho chuỗi cà phê",
      "logo": null,
      "owner_email": "coffee@owner.com",
      "owner_name": "Coffee Shop",
      "mini_app_id": "coffee_app_001",
      "active": true,
      "created_at": "2025-09-11T21:54:35.000000Z",
      "updated_at": "2025-09-11T21:54:35.000000Z"
    }
  }
}
```

**Response Error (400):**

```json
{
  "success": false,
  "error": "Voucher đã được sử dụng"
}
```

### 5. Lấy ví voucher

**Endpoint:** `GET /wallet`

**Headers:**

```
Authorization: Bearer {token}
X-App-Id: {app_id}
```

**Query Parameters:**

- `status` (optional): Trạng thái (redeemed, used, expired)
- `per_page` (optional): Số lượng voucher mỗi trang

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 5,
        "user_id": 25,
        "app_id": 1,
        "voucher_id": 11,
        "code": "DILH4MTR",
        "status": "redeemed",
        "redeemed_at": "2025-09-16T09:32:08.000000Z",
        "used_at": null,
        "expire_at": "2026-02-15T13:27:37.000000Z",
        "created_at": "2025-09-16T09:32:08.000000Z",
        "updated_at": "2025-09-16T09:32:08.000000Z",
        "voucher": {
          "id": 11,
          "app_id": 1,
          "category_id": 5,
          "name": "Voucher 11 - Coffee Shop Rewards",
          "description": "Delectus autem est et error.",
          "image": "vouchers/voucher1.jpg",
          "detail": "Expedita aliquid est itaque sunt ipsum magnam voluptas. Totam sed vero est aliquam nostrum. Reprehenderit itaque sunt maxime voluptatem ratione tenetur dicta sint. Hic repellat dolor enim numquam aut.\n\nQuo sint voluptas saepe inventore cum. Velit at sint quisquam. Explicabo rem qui dolor vel modi quis. Dicta molestias aliquam excepturi ut ipsa.\n\nDolorum qui enim cum et blanditiis qui. Hic harum qui delectus ad. Adipisci modi aperiam alias nam autem ea aliquid.",
          "required_points": 50,
          "expire_at": "2026-02-15T13:27:37.000000Z",
          "usage_condition": "Dolore eum natus dicta. Et impedit totam repellendus id deleniti.\n\nOccaecati dolor sunt consectetur ad nihil. Aliquam culpa alias deserunt debitis in. Quia exercitationem officia nesciunt esse. Eius rerum voluptates nulla est.",
          "quantity": 90,
          "active": true,
          "created_at": "2025-09-11T21:54:39.000000Z",
          "updated_at": "2025-09-11T23:44:25.000000Z"
        },
        "app": {
          "id": 1,
          "name": "Coffee Shop Rewards",
          "description": "Hệ thống tích điểm cho chuỗi cà phê",
          "logo": null,
          "owner_email": "coffee@owner.com",
          "owner_name": "Coffee Shop",
          "mini_app_id": "coffee_app_001",
          "active": true,
          "created_at": "2025-09-11T21:54:35.000000Z",
          "updated_at": "2025-09-11T21:54:35.000000Z"
        }
      },
      {
        "id": 4,
        "user_id": 25,
        "app_id": 1,
        "voucher_id": 11,
        "code": "ZYXGH6NH",
        "status": "used",
        "redeemed_at": "2025-09-16T09:31:11.000000Z",
        "used_at": "2025-09-16T09:31:46.000000Z",
        "expire_at": "2026-02-15T13:27:37.000000Z",
        "created_at": "2025-09-16T09:31:11.000000Z",
        "updated_at": "2025-09-16T09:31:46.000000Z",
        "voucher": {
          "id": 11,
          "app_id": 1,
          "category_id": 5,
          "name": "Voucher 11 - Coffee Shop Rewards",
          "description": "Delectus autem est et error.",
          "image": "vouchers/voucher1.jpg",
          "detail": "Expedita aliquid est itaque sunt ipsum magnam voluptas. Totam sed vero est aliquam nostrum. Reprehenderit itaque sunt maxime voluptatem ratione tenetur dicta sint. Hic repellat dolor enim numquam aut.\n\nQuo sint voluptas saepe inventore cum. Velit at sint quisquam. Explicabo rem qui dolor vel modi quis. Dicta molestias aliquam excepturi ut ipsa.\n\nDolorum qui enim cum et blanditiis qui. Hic harum qui delectus ad. Adipisci modi aperiam alias nam autem ea aliquid.",
          "required_points": 50,
          "expire_at": "2026-02-15T13:27:37.000000Z",
          "usage_condition": "Dolore eum natus dicta. Et impedit totam repellendus id deleniti.\n\nOccaecati dolor sunt consectetur ad nihil. Aliquam culpa alias deserunt debitis in. Quia exercitationem officia nesciunt esse. Eius rerum voluptates nulla est.",
          "quantity": 90,
          "active": true,
          "created_at": "2025-09-11T21:54:39.000000Z",
          "updated_at": "2025-09-11T23:44:25.000000Z"
        },
        "app": {
          "id": 1,
          "name": "Coffee Shop Rewards",
          "description": "Hệ thống tích điểm cho chuỗi cà phê",
          "logo": null,
          "owner_email": "coffee@owner.com",
          "owner_name": "Coffee Shop",
          "mini_app_id": "coffee_app_001",
          "active": true,
          "created_at": "2025-09-11T21:54:35.000000Z",
          "updated_at": "2025-09-11T21:54:35.000000Z"
        }
      }
    ],
    "first_page_url": "https://mini.alwaysdata.net/api/v1/wallet?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "https://mini.alwaysdata.net/api/v1/wallet?page=1",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "https://mini.alwaysdata.net/api/v1/wallet?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "next_page_url": null,
    "path": "https://mini.alwaysdata.net/api/v1/wallet",
    "per_page": 20,
    "prev_page_url": null,
    "to": 2,
    "total": 2
  }
}
```

### 6. Lịch sử giao dịch

**Endpoint:** `GET /history`

**Headers:**

```
Authorization: Bearer {token}
X-App-Id: {app_id}
```

**Query Parameters:**

- `type` (optional): Loại giao dịch (redeem, use)
- `per_page` (optional): Số lượng bản ghi (default: 20)

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 8,
        "user_id": 25,
        "app_id": 1,
        "voucher_id": 11,
        "type": "redeem",
        "status": "success",
        "metadata": {
          "code": "DILH4MTR",
          "points_used": 50
        },
        "created_by": null,
        "created_at": "2025-09-16T09:32:08.000000Z",
        "updated_at": "2025-09-16T09:32:08.000000Z",
        "voucher": {
          "id": 11,
          "app_id": 1,
          "category_id": 5,
          "name": "Voucher 11 - Coffee Shop Rewards",
          "description": "Delectus autem est et error.",
          "image": "vouchers/voucher1.jpg",
          "detail": "Expedita aliquid est itaque sunt ipsum magnam voluptas. Totam sed vero est aliquam nostrum. Reprehenderit itaque sunt maxime voluptatem ratione tenetur dicta sint. Hic repellat dolor enim numquam aut.\n\nQuo sint voluptas saepe inventore cum. Velit at sint quisquam. Explicabo rem qui dolor vel modi quis. Dicta molestias aliquam excepturi ut ipsa.\n\nDolorum qui enim cum et blanditiis qui. Hic harum qui delectus ad. Adipisci modi aperiam alias nam autem ea aliquid.",
          "required_points": 50,
          "expire_at": "2026-02-15T13:27:37.000000Z",
          "usage_condition": "Dolore eum natus dicta. Et impedit totam repellendus id deleniti.\n\nOccaecati dolor sunt consectetur ad nihil. Aliquam culpa alias deserunt debitis in. Quia exercitationem officia nesciunt esse. Eius rerum voluptates nulla est.",
          "quantity": 90,
          "active": true,
          "created_at": "2025-09-11T21:54:39.000000Z",
          "updated_at": "2025-09-11T23:44:25.000000Z"
        },
        "app": {
          "id": 1,
          "name": "Coffee Shop Rewards",
          "description": "Hệ thống tích điểm cho chuỗi cà phê",
          "logo": null,
          "owner_email": "coffee@owner.com",
          "owner_name": "Coffee Shop",
          "mini_app_id": "coffee_app_001",
          "active": true,
          "created_at": "2025-09-11T21:54:35.000000Z",
          "updated_at": "2025-09-11T21:54:35.000000Z"
        }
      },
      {
        "id": 7,
        "user_id": 25,
        "app_id": 1,
        "voucher_id": 11,
        "type": "use",
        "status": "success",
        "metadata": {
          "code": "ZYXGH6NH"
        },
        "created_by": null,
        "created_at": "2025-09-16T09:31:46.000000Z",
        "updated_at": "2025-09-16T09:31:46.000000Z",
        "voucher": {
          "id": 11,
          "app_id": 1,
          "category_id": 5,
          "name": "Voucher 11 - Coffee Shop Rewards",
          "description": "Delectus autem est et error.",
          "image": "vouchers/voucher1.jpg",
          "detail": "Expedita aliquid est itaque sunt ipsum magnam voluptas. Totam sed vero est aliquam nostrum. Reprehenderit itaque sunt maxime voluptatem ratione tenetur dicta sint. Hic repellat dolor enim numquam aut.\n\nQuo sint voluptas saepe inventore cum. Velit at sint quisquam. Explicabo rem qui dolor vel modi quis. Dicta molestias aliquam excepturi ut ipsa.\n\nDolorum qui enim cum et blanditiis qui. Hic harum qui delectus ad. Adipisci modi aperiam alias nam autem ea aliquid.",
          "required_points": 50,
          "expire_at": "2026-02-15T13:27:37.000000Z",
          "usage_condition": "Dolore eum natus dicta. Et impedit totam repellendus id deleniti.\n\nOccaecati dolor sunt consectetur ad nihil. Aliquam culpa alias deserunt debitis in. Quia exercitationem officia nesciunt esse. Eius rerum voluptates nulla est.",
          "quantity": 90,
          "active": true,
          "created_at": "2025-09-11T21:54:39.000000Z",
          "updated_at": "2025-09-11T23:44:25.000000Z"
        },
        "app": {
          "id": 1,
          "name": "Coffee Shop Rewards",
          "description": "Hệ thống tích điểm cho chuỗi cà phê",
          "logo": null,
          "owner_email": "coffee@owner.com",
          "owner_name": "Coffee Shop",
          "mini_app_id": "coffee_app_001",
          "active": true,
          "created_at": "2025-09-11T21:54:35.000000Z",
          "updated_at": "2025-09-11T21:54:35.000000Z"
        }
      },
      {
        "id": 6,
        "user_id": 25,
        "app_id": 1,
        "voucher_id": 11,
        "type": "redeem",
        "status": "success",
        "metadata": {
          "code": "ZYXGH6NH",
          "points_used": 50
        },
        "created_by": null,
        "created_at": "2025-09-16T09:31:11.000000Z",
        "updated_at": "2025-09-16T09:31:11.000000Z",
        "voucher": {
          "id": 11,
          "app_id": 1,
          "category_id": 5,
          "name": "Voucher 11 - Coffee Shop Rewards",
          "description": "Delectus autem est et error.",
          "image": "vouchers/voucher1.jpg",
          "detail": "Expedita aliquid est itaque sunt ipsum magnam voluptas. Totam sed vero est aliquam nostrum. Reprehenderit itaque sunt maxime voluptatem ratione tenetur dicta sint. Hic repellat dolor enim numquam aut.\n\nQuo sint voluptas saepe inventore cum. Velit at sint quisquam. Explicabo rem qui dolor vel modi quis. Dicta molestias aliquam excepturi ut ipsa.\n\nDolorum qui enim cum et blanditiis qui. Hic harum qui delectus ad. Adipisci modi aperiam alias nam autem ea aliquid.",
          "required_points": 50,
          "expire_at": "2026-02-15T13:27:37.000000Z",
          "usage_condition": "Dolore eum natus dicta. Et impedit totam repellendus id deleniti.\n\nOccaecati dolor sunt consectetur ad nihil. Aliquam culpa alias deserunt debitis in. Quia exercitationem officia nesciunt esse. Eius rerum voluptates nulla est.",
          "quantity": 90,
          "active": true,
          "created_at": "2025-09-11T21:54:39.000000Z",
          "updated_at": "2025-09-11T23:44:25.000000Z"
        },
        "app": {
          "id": 1,
          "name": "Coffee Shop Rewards",
          "description": "Hệ thống tích điểm cho chuỗi cà phê",
          "logo": null,
          "owner_email": "coffee@owner.com",
          "owner_name": "Coffee Shop",
          "mini_app_id": "coffee_app_001",
          "active": true,
          "created_at": "2025-09-11T21:54:35.000000Z",
          "updated_at": "2025-09-11T21:54:35.000000Z"
        }
      }
    ],
    "first_page_url": "https://mini.alwaysdata.net/api/v1/history?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "https://mini.alwaysdata.net/api/v1/history?page=1",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "https://mini.alwaysdata.net/api/v1/history?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "next_page_url": null,
    "path": "https://mini.alwaysdata.net/api/v1/history",
    "per_page": 20,
    "prev_page_url": null,
    "to": 3,
    "total": 3
  }
}
```

---

## 📋 Policies APIs

### 1. Lấy điều khoản thành viên

**Endpoint:** `GET /policies/membership`

**Headers:**

```
Authorization: Bearer {token}
X-App-Id: {app_id}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": "<p>Test</p>"
}
```

**Response Error (404):**

```json
{
  "success": false,
  "error": "Chính sách không tồn tại"
}
```

### 2. Lấy chính sách bảo mật

**Endpoint:** `GET /policies/privacy`

**Headers:**

```
Authorization: Bearer {token}
X-App-Id: {app_id}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": "<p>Test</p>"
}
```

---

## 🚨 Error Responses

### Validation Error (422)

```json
{
  "success": false,
  "error": {
    "phone": "The phone field is required.",
    "name": "The name field is required."
  }
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "error": "Unauthenticated."
}
```

### Forbidden (403)

```json
{
  "success": false,
  "error": "This action is unauthorized."
}
```

### Not Found (404)

```json
{
  "success": false,
  "error": "Resource not found"
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 📝 Notes

1. **App Scope**: Tất cả API protected đều yêu cầu header `X-App-Id` để xác định app context
2. **Authentication**: Sử dụng Sanctum token authentication
3. **Rate Limiting**: API có thể áp dụng rate limiting tùy theo cấu hình
4. **Pagination**: Một số API có thể hỗ trợ pagination với query parameters `page` và `per_page`
5. **Date Format**: Tất cả date/time đều sử dụng format ISO 8601 (UTC)

```

```
