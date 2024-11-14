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
              <component
                v-else-if="field.type === 'select'"
                :is="field.component"
                v-model="formData[field.prop]"
                :placeholder="$t(field.placeholder || 'defaultPlaceholder')"
                style="width: 100%"
                :key="formData.deviceLanguage"
              >
                <el-option
                  v-for="item in field.options"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                  :disabled="item.isDisabled"
                />
              </component>
              <qrcode-vue
                v-else-if="field.type === 'qrcode'"
                :value="`sdfwefkweifewifjewifjweif`"
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

      <el-col :span="24">
        <!--          <progress-bar-->
        <!--            :label="$t('personnel')"-->
        <!--            :percentage="personCount"-->
        <!--            :currentCount="res?.faceCount || 0"-->
        <!--            :totalCount="res?.devicesCount || 0"-->
        <!--          />-->
      </el-col>
    </el-form>
  </AppContainer>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseConfigAPI, { BaseConfigFormVO, LanguageOption } from "@/api/system";
import { ElInput, ElSelect, FormInstance } from "element-plus";
import { useUserStore } from "@/store";
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

const loading = ref<Boolean>(false);
const languageOptions = ref<LanguageOption>([]);

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
    options: languageOptions.value,
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
    languageOptions.value = useUserStore.languageOptions;
  } catch (e) {
    console.log(e);
  }
};

const submitForm = async (ruleFormRef: FormInstance | undefined) => {
  // 直接传递 deviceName 和 deviceLanguage，而不是嵌套在 data 中
  const params = {
    deviceName: formData.value.deviceName,
    deviceLanguage: formData.value.deviceLanguage,
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
