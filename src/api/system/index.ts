import request from "@/utils/request";

const BASE_API = "/cgi-bin/entry.cgi";

class BaseConfigAPI {
  static getBaseConfigApi(): Promise<BaseConfigFormVO> {
    return request.get(`${BASE_API}/system/device-info`);
  }

  static updateBaseConfigApi(data: {
    deviceName: string;
    deviceLanguage: number;
  }): Promise<BaseConfigFormVO> {
    return request({
      url: `${BASE_API}/system/device-info`,
      method: "post",
      data: data,
    });
  }
}

export default BaseConfigAPI;

export interface BaseConfigFormVO {
  /** 算法版本 */
  algorithmVersion: string;

  /** 设备容量 */
  deviceCapacity: number;

  /** 设备语言 */
  deviceLanguage: number;

  /** 设备型号 */
  deviceModel: string;

  /** 设备名称 */
  deviceName: string;

  /** 设备编号 */
  deviceNum: string;

  /** 硬件版本 */
  hardwareVersion: string;

  /** ID */
  id: number;

  /** 内核版本 */
  kernelVersion: string;

  /** 模块版本 */
  modleVersions: string;

  /** 备注 */
  reserve: string;

  /** 软件版本 */
  softwareVersion: string;

  /** Web版本 */
  webVersion: string;

  [key: string]: string | number; // Index signature to allow any string key
}
