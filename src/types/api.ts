// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | Record<string, string>;
}

// Pagination
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Auth
export interface LoginRequest {
  phone: string;
  secret_key: string;
  name: string;
}

export interface LoginResponse {
  user: User;
  profile: Profile;
  token: string;
}

export interface User {
  id: number;
  email?: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: number;
  user_id: number;
  app_id: number;
  name: string;
  birthday?: string;
  gender?: string;
  address?: string;
  points_total: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  app?: App;
}

export interface UpdateProfileRequest {
  name?: string;
  birthday?: string;
  gender?: string;
  address?: string;
}

export interface App {
  id: number;
  name: string;
  description: string;
  logo?: string;
  owner_email: string;
  owner_name: string;
  mini_app_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Categories
export interface Category {
  id: number;
  app_id: number;
  name: string;
  description?: string;
  icon?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Vouchers
export interface Voucher {
  id: number;
  app_id: number;
  category_id: number;
  name: string;
  description: string;
  image: string;
  detail: string;
  required_points: number;
  expire_at: string;
  usage_condition: string;
  quantity: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  app?: App;
}

export interface VouchersQuery {
  category_id?: number;
  keyword?: string;
  page?: number;
  per_page?: number;
}

export interface LatestVouchersQuery {
  limit?: number;
}

// Wallet
export interface WalletItem {
  id: number;
  user_id: number;
  app_id: number;
  voucher_id: number;
  code: string;
  status: "redeemed" | "used" | "expired";
  redeemed_at: string;
  used_at?: string;
  expire_at: string;
  created_at: string;
  updated_at: string;
  voucher: Voucher;
  app: App;
}

export interface WalletQuery {
  status?: "redeemed" | "used" | "expired";
  page?: number;
  keyword?: string;
  per_page?: number;
}

export interface RedeemVoucherResponse {
  user_id: number;
  app_id: string;
  voucher_id: number;
  code: string;
  status: "redeemed";
  redeemed_at: string;
  expire_at: string;
  updated_at: string;
  created_at: string;
  id: number;
  voucher: Voucher;
  app: App;
}

// History
export interface HistoryItem {
  id: number;
  user_id: number;
  app_id: number;
  voucher_id: number;
  type: "redeem" | "use" | "points_earned" | "points_spent";
  status: "success" | "failed";
  metadata: {
    code?: string;
    points_used?: number;
    [key: string]: any;
  };
  created_by?: number;
  created_at: string;
  updated_at: string;
  voucher?: Voucher;
  app?: App;
}

export interface HistoryQuery {
  type?: "redeem" | "use";
  keyword?: string;
  limit?: number;
  page?: number;
  per_page?: number;
}

// Policies
export interface PolicyResponse {
  success: boolean;
  data?: string; // HTML content
  error?: string;
}
