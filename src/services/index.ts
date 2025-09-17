// Export tất cả services
export * from "./auth";
export * from "./catalog";
export * from "./wallet";
export * from "./policies";

// Auto-login service sử dụng authManager
import { authManager } from "./authManager";
import { userService } from "./user";

export const initializeApp = async () => {
  try {
    // AuthManager sẽ tự động handle việc authenticate và lấy thông tin user
    const token = await authManager.getValidToken();
    const userData = userService.getCachedUserData();

    console.log("App initialized successfully, userData:", userData);
    return {
      userInfo: {
        id: userData.userInfo?.id || "default",
        name: userData.userInfo?.name || "User",
        avatar: userData.userInfo?.avatar || "avatar.jpg",
      },
      phoneNumber: userData.phoneNumber,
      token,
    };
  } catch (error) {
    console.warn("App initialization failed:", error);
    // Fallback data
    return {
      userInfo: {
        id: "default",
        name: "User",
        avatar: "avatar.jpg",
      },
      phoneNumber: undefined,
      token: null,
    };
  }
};
