import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import NProgress from "@/utils/nprogress";
import { TOKEN_KEY } from "@/enums/CacheEnum";
import router from "@/router";
import { usePermissionStore, useUserStore } from "@/store";

export function setupPermission() {
  const whiteList = ["/login"];

  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const hasToken = localStorage.getItem(TOKEN_KEY);

    if (hasToken) {
      await handleUserHasToken(to, from, next);
    } else {
      handleUserNoToken(to, next, whiteList);
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
}

/** 处理已登录用户 */
async function handleUserHasToken(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  const hasRoles = userStore.user.roles && userStore.user.roles.length > 0;
  if (to.path === "/login") {
    next({ path: "/" });
    NProgress.done();
    return;
  }

  if (hasRoles) {
    handleNavigation(to, from, next);
  } else {
    try {
      await userStore.getUserInfo();
      const dynamicRoutes = await permissionStore.generateRoutes();
      dynamicRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route));
      next({ ...to, replace: true });
    } catch (error) {
      console.error(error);
      await userStore.resetToken();
      redirectToLogin(to, next);
    } finally {
      NProgress.done();
    }
  }
}

/** 处理未登录用户 */
function handleUserNoToken(
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
  whiteList: string[]
) {
  if (whiteList.includes(to.path)) {
    next();
  } else {
    redirectToLogin(to, next);
  }
  NProgress.done();
}

/** 导航逻辑 */
function handleNavigation(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  if (to.matched.length === 0) {
    next(from.name ? { name: from.name } : "/404");
  } else {
    updateTitle(to);
    next();
  }
}

/** 更新页面标题 */
function updateTitle(to: RouteLocationNormalized) {
  const title = (to.params.title as string) || (to.query.title as string);
  if (title) {
    to.meta.title = title;
  }
}

/** 重定向到登录页 */
function redirectToLogin(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const queryString = new URLSearchParams(
    to.query as Record<string, string>
  ).toString();
  const redirect = queryString ? `${to.path}?${queryString}` : to.path;
  next(`/login?redirect=${encodeURIComponent(redirect)}`);
}

/** 判断是否有权限 */
export function hasAuth(
  value: string | string[],
  type: "button" | "role" = "button"
) {
  const { roles, perms } = useUserStore().user;

  if (type === "button" && roles.includes("ROOT")) {
    return true;
  }

  const auths = type === "button" ? perms : roles;
  return Array.isArray(value)
    ? value.some((perm) => auths.includes(perm))
    : auths.includes(value);
}
