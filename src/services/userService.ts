import {
  AppError,
  authorize,
  getUserInfo,
  getAccessToken,
  getPhoneNumber,
  getSetting,
  closeApp,
} from "zmp-sdk/apis";

export interface UserInfo {
  id?: string;
  name?: string;
  avatar?: string;
}

export interface UserData {
  userInfo?: UserInfo;
  phoneNumber?: string;
}

export interface Scope {
  userPhonenumber: boolean | undefined;
  userInfo: boolean | undefined;
}

class UserService {
  private userData: UserData = {};
  private accessToken: string = "";
  private code: string = "";
  private scope: Scope = { userPhonenumber: false, userInfo: false };

  constructor() {
    this.requestPermissions();
  }

  async getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = await getAccessToken();
    }
    return this.accessToken;
  }

  async getApiToken() {
    const apiURL = import.meta.env.VITE_API_URL;
    const response = await fetch(apiURL + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Id": import.meta.env.VITE_APP_ID,
      },
      body: JSON.stringify({
        secret_key: import.meta.env.VITE_SECRET_KEY,
        name: this.userData.userInfo?.name,
        phone: this.userData.phoneNumber,
      }),
    });
    const result = await response.json();
    console.log(result);
  }

  async getPhoneNumber() {
    const endpoint = "https://graph.zalo.me/v2.0/me/info";
    const { token } = await getPhoneNumber();
    this.code = token as string;
    const userAccessToken = await this.getAccessToken();
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        access_token: userAccessToken,
        code: this.code,
        secret_key: import.meta.env.VITE_SECRET_KEY,
      },
    });
    const result = await response.json();
    const { number } = result.data;
    this.userData.phoneNumber = number;
    return number;
  }

  async requestPermissions() {
    const { authSetting } = await getSetting();
    this.scope.userPhonenumber = authSetting["scope.userPhonenumber"];
    this.scope.userInfo = authSetting["scope.userInfo"];
    if (this.scope.userPhonenumber) {
      return;
    }
    try {
      const data = await authorize({
        scopes: ["scope.userPhonenumber"],
      });
      console.log(data["scope.userPhonenumber"]); // `true` nếu người dùng đồng ý cấp số điện thoại
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

  async getUserInfo(): Promise<UserInfo> {
    let userIf: UserInfo = {};
    if (this.scope.userInfo) {
      const { userInfo } = await getUserInfo();
      userIf = userInfo;
    } else {
      const { userInfo } = await getUserInfo({
        autoRequestPermission: true,
      });
      userIf = userInfo;
    }
    this.userData.userInfo = userIf;
    return userIf;
  }

  /**
   * Lấy dữ liệu đã cache
   */
  getCachedUserData(): UserData {
    return this.userData;
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
