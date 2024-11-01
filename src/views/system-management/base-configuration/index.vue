<template>
  <el-form
    ref="elForm"
    :model="formData"
    size="medium"
    label-width="200px"
    style="max-width: 1200px"
  >
    <el-col :span="12">
      <el-form-item :label="$t('deviceName')" prop="deviceName">
        <el-input
          v-model="formData.deviceName"
          :maxlength="64"
          show-word-limit
          :disabled="roleId !== 0"
        />
      </el-form-item>
    </el-col>
  </el-form>
</template>

<script setup lang="ts">
import BaseConfigAPI, { BaseConfigFormVO } from "@/api/system";

defineOptions({
  name: "BaseConfiguration",
  inheritAttrs: false,
});

const formData = ref<BaseConfigFormVO>({
  algorithmVersion: "",
  deviceCapacity: 0,
  deviceLanguage: 0,
  deviceModel: "",
  deviceNum: "",
  hardwareVersion: "",
  id: 0,
  kernelVersion: "",
  modleVersions: "",
  reserve: "",
  softwareVersion: "",
  webVersion: "",
  deviceName: "",
}); // 初始化 formData
const roleId = ref(1); // 示例：roleId 的默认值为 1

const getBaseConfig = async () => {
  formData.value = await BaseConfigAPI.getBaseConfigApi(); // 将获取的数据赋值给 formData
};

onMounted(() => {
  getBaseConfig(); // 调用函数以获取数据
});
</script>
