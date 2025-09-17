import { nativeStorage } from "zmp-sdk/apis";
import { userService } from "./user";
import { authService } from "./auth";
import { env } from "../config/env";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  lastAuthTime: number;
}

class AuthManager {
  private state: AuthState = {
    token: null,
    isAuthenticated: false,
    isAuthenticating: false,
    lastAuthTime: 0,
  };

  private readonly TOKEN_KEY = "auth_token";
  private readonly TOKEN_expire_at = 24 * 60 * 60 * 1000; // 24 hours
  private pendingRequests: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      const storedToken = await nativeStorage.getItem(this.TOKEN_KEY);
      const storedTime = await nativeStorage.getItem("auth_time");

      if (storedToken && storedTime) {
        const authTime = parseInt(storedTime);
        const now = Date.now();

        // Kiểm tra token có hết hạn không
        if (now - authTime < this.TOKEN_expire_at) {
          this.state.token = storedToken;
          this.state.isAuthenticated = true;
          this.state.lastAuthTime = authTime;
        } else {
          // Token hết hạn, xóa
          await this.clearToken();
        }
      }
    } catch (error) {
      console.warn("Failed to initialize auth manager:", error);
    }
  }

  async getValidToken(): Promise<string> {
    console.log("getValidToken called, state:", this.state);

    //Kiểm tra xem có token hợp lệ VÀ có user data không
    if (this.state.isAuthenticated && this.state.token && this.isTokenValid()) {
      const userData = userService.getCachedUserData();
      if (userData.userInfo?.name && userData.phoneNumber) {
        console.log("Returning existing valid token with user data");
        return this.state.token;
      } else {
        console.log(
          "Have token but missing user data, need to re-authenticate"
        );
        // Clear token và authenticate lại
        await this.clearToken();
      }
    }

    // Nếu đang authenticate, đợi trong queue
    if (this.state.isAuthenticating) {
      console.log("Authentication in progress, queuing request");
      return new Promise((resolve, reject) => {
        this.pendingRequests.push({ resolve, reject });
      });
    }

    // Bắt đầu authenticate
    console.log("Starting authentication");
    return this.authenticate();
  }

  private async authenticate(): Promise<string> {
    this.state.isAuthenticating = true;

    try {
      // Luôn lấy thông tin user từ Zalo để đảm bảo có data
      console.log("Getting user data from Zalo...");
      await userService.requestPermissions();
      await userService.getUserInfo();
      await userService.getPhoneNumber();
      await userService.saveAuthData();

      const userData = userService.getCachedUserData();
      console.log("User data after getting from Zalo:", userData);

      if (!userData.userInfo?.name || !userData.phoneNumber) {
        throw new Error("Missing user data for authentication");
      }

      // Login với API
      const loginData = await authService.login({
        phone: userData.phoneNumber,
        secret_key: env.SECRET_KEY,
        name: userData.userInfo.name,
      });

      // Lưu token
      await this.setToken(loginData.token);

      // Resolve tất cả pending requests
      this.pendingRequests.forEach(({ resolve }) => {
        resolve(loginData.token);
      });
      this.pendingRequests = [];

      return loginData.token;
    } catch (error) {
      // Reject tất cả pending requests
      this.pendingRequests.forEach(({ reject }) => {
        reject(error);
      });
      this.pendingRequests = [];

      throw error;
    } finally {
      this.state.isAuthenticating = false;
    }
  }

  private async setToken(token: string) {
    this.state.token = token;
    this.state.isAuthenticated = true;
    this.state.lastAuthTime = Date.now();

    try {
      await nativeStorage.setItem(this.TOKEN_KEY, token);
      await nativeStorage.setItem(
        "auth_time",
        this.state.lastAuthTime.toString()
      );
    } catch (error) {
      console.warn("Failed to save token:", error);
    }
  }

  async clearToken() {
    this.state.token = null;
    this.state.isAuthenticated = false;
    this.state.lastAuthTime = 0;

    try {
      await nativeStorage.removeItem(this.TOKEN_KEY);
      await nativeStorage.removeItem("auth_time");
      await userService.clearAuthData();
    } catch (error) {
      console.warn("Failed to clear token:", error);
    }
  }

  // Force refresh token
  async refreshToken(): Promise<string> {
    await this.clearToken();
    return this.authenticate();
  }

  isTokenValid(): boolean {
    if (!this.state.isAuthenticated || !this.state.token) {
      return false;
    }

    const now = Date.now();
    return now - this.state.lastAuthTime < this.TOKEN_expire_at;
  }

  getToken(): string | null {
    return this.state.token;
  }

  isAuthenticating(): boolean {
    return this.state.isAuthenticating;
  }
}

// Export singleton instance
export const authManager = new AuthManager();
export default authManager;
