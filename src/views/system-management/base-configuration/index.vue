<template>
  <AppContainer>
    <el-form
      ref="elForm"
      :model="formData"
      label-width="200px"
      style="max-width: 1200px"
    >
      <el-row>
        <template v-for="(field, index) in formFieldsConfig" :key="index">
          <el-col :span="12">
            <el-form-item :label="$t(field.label)" :prop="field.prop">
              <component
                v-if="field.type === 'input'"
                :is="field.component"
                v-model="formData[field.prop]"
                :maxlength="field.maxlength"
                :show-word-limit="field.showWordLimit"
                :disabled="
                  field.disabled !== undefined ? field.disabled : roleId !== 0
                "
              />
              <el-select-v2
                v-else-if="field.type === 'select'"
                :props="props"
                value-ley="name"
                v-model="formData[field.prop]"
                :options="languageOptions"
                :placeholder="$t(field.placeholder || 'defaultPlaceholder')"
                style="width: 240px"
              />
              <qr-code
                v-else-if="field.type === 'qrcode'"
                :value="`sdfwefkweifewifjewifjweif`"
                qrcode-url="http://localhost:3000/favicon.ico"
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>

      <el-col :span="24">
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 120px"
            @click="submitForm(ruleFormRef)"
          >
            {{ $t("2.2.17") }}
          </el-button>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <div class="tab-line">
          <div>{{ $t("DeviceLimit") }}</div>
        </div>
      </el-col>
    </el-form>
  </AppContainer>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseConfigAPI, { BaseConfigFormVO, LanguageOption } from "@/api/system";
import { ElInput, ElSelect, FormInstance } from "element-plus";
import { useUserStore } from "@/store";
import QrCode from "@/views/system-management/base-configuration/components/qr-code.vue";
defineOptions({
  name: "BaseConfiguration",
  inheritAttrs: false,
});
const ruleFormRef = ref<FormInstance>();
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

const roleId = ref<number>(1); // 示例：roleId 的默认值为 1
const props = {
  label: "name",
  value: "value",
};
const loading = ref<Boolean>(false);
const languageOptions = ref<LanguageOption[]>([]);

const formFieldsConfig = [
  {
    label: "deviceName",
    prop: "deviceName",
    type: "input",
    component: ElInput,
    maxlength: 64,
    showWordLimit: true,
    disabled: false,
  },
  {
    label: "deviceNumber",
    prop: "deviceNum",
    type: "input",
    component: ElInput,
    disabled: true,
  },
  {
    label: "deviceModel",
    prop: "deviceModel",
    type: "input",
    component: ElInput,
    disabled: true,
  },
  {
    label: "softwareVersion",
    prop: "softwareVersion",
    type: "input",
    component: ElInput,
    disabled: true,
  },
  {
    label: "kernelVersion",
    prop: "kernelVersion",
    type: "input",
    component: ElInput,
    disabled: true,
  },
  {
    label: "webVersion",
    prop: "webVersion",
    type: "input",
    component: ElInput,
    disabled: true,
  },
  {
    label: "hardwareVersion",
    prop: "hardwareVersion",
    type: "input",
    component: ElInput,
    disabled: true,
  },
  {
    label: "algorithmVersion",
    prop: "algorithmVersion",
    type: "input",
    component: ElInput,
    disabled: true,
  },
  {
    label: "deviceLanguage",
    prop: "deviceLanguage",
    type: "select",
    component: ElSelect,
    placeholder: "2.2.251",
  },
  {
    label: "deviceQRCode",
    prop: "deviceQRCode",
    type: "qrcode",
    component: "qrcode",
    placeholder: "Device QR Code",
  },
  {
    label: "userManual",
    prop: "userManual",
    type: "qrcode",
    component: "qrcode",
    placeholder: "User Manual QR Code",
  },
];
const getBaseConfig = async () => {
  try {
    formData.value = await BaseConfigAPI.getBaseConfigApi();
    await useUserStore().getLanguageOptions();
    await nextTick(() => {
      languageOptions.value = useUserStore().languageOptions;
    });
  } catch (e) {
    console.log(e);
  }
};

const submitForm = async (ruleFormRef: FormInstance | undefined) => {
  // 直接传递 deviceName 和 deviceLanguage，而不是嵌套在 data 中
  const params = {
    data: {
      deviceName: formData.value.deviceName,
      deviceLanguage: formData.value.deviceLanguage,
    },
  };

  // 调用 updateBaseConfigApi 方法，并传递正确的参数结构
  const res = await BaseConfigAPI.updateBaseConfigApi(params);
  if (!res) return;
  ElMessage.success("成功");
};

onMounted(() => {
  getBaseConfig(); // Call to fetch the data
});
</script>
