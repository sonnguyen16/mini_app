import {
  AppError,
  authorize,
  getUserInfo,
  getAccessToken,
  getPhoneNumber,
  getSetting,
  closeApp,
} from "zmp-sdk/apis";
import { nativeStorage } from "zmp-sdk/apis";
interface UserData {
  userInfo?: {
    id: string;
    name: string;
    avatar: string;
  };
  phoneNumber?: string;
}

interface StoredUserData {
  userInfo?: {
    id: string;
    name: string;
    avatar: string;
  };
  phoneNumber?: string;
  apiToken?: string;
}

class UserService {
  private userData: UserData = {};
  private apiToken: string = "";
  private accessToken: string = "";
  private scope = {
    userInfo: false as boolean,
    userPhonenumber: false as boolean,
  };

  private readonly STORAGE_KEY = "user_data";

  constructor() {
    // Không gọi async function trong constructor
    console.log("UserService initialized");
    // Load data từ storage khi khởi tạo
    this.loadFromStorage();
  }

  private async loadFromStorage() {
    try {
      const stored = await this.getFromStorage();
      if (stored && stored.userInfo && stored.phoneNumber) {
        this.userData = {
          userInfo: stored.userInfo,
          phoneNumber: stored.phoneNumber,
        };
        console.log("Loaded user data from storage:", this.userData);
      }
    } catch (error) {
      console.warn("Failed to load user data from storage:", error);
    }
  }

  async getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = await getAccessToken();
    }
    return this.accessToken;
  }

  async getPhoneNumber() {
    const endpoint = "https://graph.zalo.me/v2.0/me/info";
    const { token } = await getPhoneNumber();
    const userAccessToken = await this.getAccessToken();
    console.log("Getting phone number from Zalo...");
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        access_token: userAccessToken,
        code: token,
        secret_key: import.meta.env.VITE_SECRET_KEY,
      } as Record<string, string>,
    });
    const result = await response.json();
    console.log("Zalo phone response:", result);
    const { number } = result.data;
    this.userData.phoneNumber = number;
    return number;
  }

  async requestPermissions() {
    const { authSetting } = await getSetting();
    this.scope.userPhonenumber = Boolean(authSetting["scope.userPhonenumber"]);
    this.scope.userInfo = Boolean(authSetting["scope.userInfo"]);
    if (!this.scope.userPhonenumber || !this.scope.userInfo) {
      try {
        await authorize({
          scopes: ["scope.userPhonenumber", "scope.userInfo"],
        });
      } catch (error) {
        const code = (error as AppError).code;
        if (code === -201) {
          console.log("Người dùng đã từ chối cấp quyền");
          closeApp();
        } else {
          console.log("Lỗi khác");
        }
      }
    }
  }

  async getUserInfo(): Promise<UserData["userInfo"]> {
    if (!this.userData.userInfo) {
      console.log("Getting user info from Zalo...");
      const { userInfo } = await getUserInfo();
      console.log("Zalo userInfo:", userInfo);
      this.userData.userInfo = userInfo;
    }
    return this.userData.userInfo;
  }

  /**
   * Lấy dữ liệu đã cache
   */
  getCachedUserData() {
    return this.userData;
    // const userData = {
    //   userInfo: {
    //     id: "273754147305996554",
    //     name: "Sơn",
    //     avatar:
    //       "https://s120-ava-talk.zadn.vn/2/d/e/c/11/120/1524865dea363cf11ab98d8e5ccaefbf.jpg",
    //     followedOA: false,
    //     isSensitive: false,
    //   },
    //   phoneNumber: "84817702334",
    // };
    // return userData;
  }

  // Lưu thông tin user vào native storage
  private async saveToStorage(data: StoredUserData) {
    try {
      await nativeStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save user data to storage:", error);
    }
  }

  // Lấy thông tin user từ native storage
  private async getFromStorage(): Promise<StoredUserData | null> {
    try {
      const data = await nativeStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn("Failed to get user data from storage:", error);
      return null;
    }
  }

  // Kiểm tra xem có cần login lại không
  async needsReauth(): Promise<boolean> {
    // Kiểm tra xem đã có data trong memory chưa
    if (this.userData.userInfo && this.userData.phoneNumber) {
      console.log("User data already in memory:", this.userData);
      return false;
    }

    // Kiểm tra storage
    const stored = await this.getFromStorage();
    if (!stored || !stored.userInfo || !stored.phoneNumber) {
      console.log("No user data in storage, need reauth");
      return true;
    }

    // Load data từ storage
    this.userData = {
      userInfo: stored.userInfo,
      phoneNumber: stored.phoneNumber,
    };
    console.log("Loaded user data from storage in needsReauth:", this.userData);
    return false;
  }

  // Lưu thông tin sau khi login thành công
  async saveAuthData() {
    const dataToSave: StoredUserData = {
      userInfo: this.userData.userInfo,
      phoneNumber: this.userData.phoneNumber,
    };

    await this.saveToStorage(dataToSave);
  }

  // Xóa thông tin auth (logout)
  async clearAuthData() {
    try {
      await nativeStorage.removeItem(this.STORAGE_KEY);
      this.userData = {};
    } catch (error) {
      console.warn("Failed to clear auth data:", error);
    }
  }

  getApiToken() {
    return this.apiToken;
  }
  /**
   * Xóa cache dữ liệu người dùng
   */
  clearCache(): void {
    this.userData = {};
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
