// translate router.meta.title, be used in breadcrumb sidebar tagsview
import i18n from "@/lang/index";

export function translateRouteTitle(title: any) {
  // 判断是否存在国际化配置，如果没有原生返回
  const hasKey = i18n.global.te("route." + title);
  if (hasKey) {
    return i18n.global.t("route." + title);
  }
  return title;
}

// 定义 data 类型为一个对象，其中每个键的值都是一个包含多个键的对象
interface TranslationData {
  [key: string]: {
    [translationType: number]: string; // 根据 translationType 存储翻译值
  };
}

// 根据后台返回的翻译数据转化成需要的语言对象
export function extractTranslations(
  data: TranslationData,
  translationType: number
) {
  const separatedTranslations: Record<string, string> = {};

  // 遍历数据源的每个键
  for (const key in data) {
    // 确保 key 是 data 的属性，并且是一个对象
    if (data.hasOwnProperty(key) && data[key]) {
      // 检查是否存在指定类型的翻译
      if (data[key][translationType] !== undefined) {
        // 将翻译添加到结果对象中
        separatedTranslations[key] = data[key][translationType];
      }
    }
  }

  return separatedTranslations;
}
