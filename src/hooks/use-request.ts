import { reactive, toRefs, UnwrapRef } from "vue";

interface RequestState<T = any> {
  loading: boolean;
  total: number;
  sourceData: T | null;
}

/**
 * useRequest
 * @param apiFun - API 请求方法
 * @param params - 默认请求参数
 * @param arg - 其他额外参数
 * @returns 包含请求状态和请求方法的对象
 */
export function useRequest<T, P>(
  apiFun: (params: P, ...arg: any[]) => Promise<T>,
  params: P,
  ...arg: any[]
) {
  // 定义状态
  const state = reactive<RequestState<T>>({
    loading: false,
    total: 0,
    sourceData: null,
  });

  /**
   * 发起请求
   * @param innerParams - 内部请求参数（可覆盖默认的 params）
   */
  async function commonRequest(innerParams?: P) {
    try {
      state.loading = true;
      const res = await apiFun(innerParams || params, ...arg);

      // 根据实际情况更新 state
      state.sourceData = res as UnwrapRef<T>;
      state.total = (res as any)?.total ?? 0;
      state.loading = false;
      return res; // 返回原始数据格式
    } catch (error) {
      state.loading = false;
      return Promise.reject(error); // 返回错误，终止后续代码执行
    }
  }

  return {
    commonRequest,
    ...toRefs(state),
  };
}
