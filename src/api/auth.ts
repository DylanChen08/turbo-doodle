import request from "@/utils/request";

const AUTH_BASE_URL = "/cgi-bin/entry.cgi";

class AuthAPI {
  /** 登录 接口*/
  static loginApi(data: LoginData) {
    return request<any, LoginResult>({
      url: `${AUTH_BASE_URL}/system/login`,
      method: "put",
      data,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });
  }

  /** 注销 接口*/
  static logout() {
    return request({
      url: `${AUTH_BASE_URL}/logout`,
      method: "delete",
    });
  }

  /** 获取验证码 接口*/
  static getCaptcha() {
    return request<any, CaptchaResult>({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get",
    });
  }
}

export default AuthAPI;

/** 登录请求参数 */
export interface LoginData {
  /** 用户名 */
  sUserName: string;
  /** 密码 */
  sPassword: string;
  /** 语言 */
  iLanguage: number;
  // /** 验证码缓存key */
  // captchaKey: string;
  // /** 验证码 */
  // captchaCode: string;
}

/** 登录响应 */
export interface LoginResult {
  /** 访问token */
  accessToken?: string;
  /** 过期时间(单位：毫秒) */
  expires?: number;
  /** 刷新token */
  refreshToken?: string;
  /** token 类型 */
  tokenType?: string;
}

/** 验证码响应 */
export interface CaptchaResult {
  /** 验证码缓存key */
  captchaKey: string;
  /** 验证码图片Base64字符串 */
  captchaBase64: string;
}
