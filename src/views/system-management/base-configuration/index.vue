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
                value-key="name"
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
            @click="submitForm"
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
import BaseConfigAPI, {
  BaseConfigFormVO,
  LanguageOptionVO,
} from "@/api/system";
import { FormInstance } from "element-plus";
import { useUserStore } from "@/store";
import QrCode from "@/views/system-management/base-configuration/components/qr-code.vue";
import { formFieldsConfigs } from "@/views/system-management/base-configuration/form-fields-configs";
import { useRequest } from "@/hooks/use-request";

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
});

const { commonRequest, loading } = useRequest(
  BaseConfigAPI.getBaseConfigApi,
  formData
);

const roleId = ref<number>(1);
const props = { label: "name", value: "value" };
const languageOptions = ref<LanguageOptionVO[]>([]);
const formFieldsConfig = formFieldsConfigs;

const getBaseConfig = async () => {
  try {
    formData.value = await commonRequest();

    const userStore = useUserStore();
    await userStore.getLanguageOptions();
    languageOptions.value = userStore.languageOptions;
  } catch (e) {
    ElMessage.error("获取基础配置失败，请重试");
    console.error(e);
  }
};

const submitForm = async () => {
  if (!ruleFormRef.value) return;

  const valid = await ruleFormRef.value.validate();
  if (!valid) return;

  const params = {
    data: {
      deviceName: formData.value.deviceName,
      deviceLanguage: formData.value.deviceLanguage,
    },
  };

  const res = await BaseConfigAPI.updateBaseConfigApi(params);
  if (res) {
    ElMessage.success("成功");
  }
};

onMounted(async () => {
  await getBaseConfig();
});
</script>
