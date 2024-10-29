import AuthAPI, { LoginData } from "@/api/auth";
import UserAPI, { UserInfo } from "@/api/user";
import { resetRouter } from "@/router";
import { store } from "@/store";
import { Base64 } from "js-base64";

import { TOKEN_KEY } from "@/enums/CacheEnum";

export const useUserStore = defineStore("user", () => {
  const user = ref<UserInfo>({
    roles: [],
    perms: [],
  });

  /**
   * 登录
   *
   * @returns
   * @param loginData
   */
  async function login(loginData: LoginData): Promise<void> {
    try {
      const params = {
        sUserName: "",
        sPassword: "",
        iLanguage: 1,
      };
      params.sUserName = loginData.username.trim();
      params.sPassword = Base64.encode(loginData.password);
      const response = await AuthAPI.loginApi(params);
      const { tokenType, accessToken } = response;
      localStorage.setItem(TOKEN_KEY, `${tokenType} ${accessToken}`); // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
    } catch (error) {
      console.log(error);
    }
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      UserAPI.getInfo()
        .then((data) => {
          if (!data) {
            reject("Verification failed, please Login again.");
            return;
          }
          if (!data.roles || data.roles.length <= 0) {
            reject("getUserInfo: roles must be a non-null array!");
            return;
          }
          Object.assign(user.value, { ...data });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.logout()
        .then(() => {
          localStorage.setItem(TOKEN_KEY, "");
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // remove token
  function resetToken() {
    console.log("resetToken");
    return new Promise<void>((resolve) => {
      localStorage.setItem(TOKEN_KEY, "");
      resetRouter();
      resolve();
    });
  }

  return {
    user,
    login,
    getUserInfo,
    logout,
    resetToken,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
