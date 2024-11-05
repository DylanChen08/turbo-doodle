<template>
  <el-form
    ref="elForm"
    :model="formData"
    label-width="200px"
    style="max-width: 1200px"
  >
    <!-- Loop through the formFieldsConfig array to render the form fields dynamically -->
    <el-row>
      <template v-for="(field, index) in formFieldsConfig" :key="index">
        <el-col :span="12" v-if="field.type === 'input'">
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
              :placeholder="$t(field.placeholder)"
              style="width: 100%"
            >
              <el-option
                v-for="item in field.options"
                :key="item.value"
                :label="item.name"
                :value="item.value"
                :disabled="item.isDisabled"
              />
            </component>
            <!--              <qrcode v-else-if="field.type === 'qrcode'" :value="formData[field.prop]" :options="{ width: 100 }"></qrcode>-->
          </el-form-item>
        </el-col>
      </template>
    </el-row>

    <!-- Submit and Progress Bars -->
    <el-col :span="24">
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 120px"
          @click="submitForm('elForm')"
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

    <!-- Other progress bars as needed -->
  </el-form>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseConfigAPI, { BaseConfigFormVO } from "@/api/system";
import { ElInput } from "element-plus";

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

const roleId = ref<number>(1); // 示例：roleId 的默认值为 1

const loading = ref<Boolean>(false);
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
    component: "el-select",
    options: [], // Assuming you have a `languageOptions` array defined somewhere
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
  } catch (e) {
    console.log(e);
  }
};

onMounted(() => {
  getBaseConfig(); // Call to fetch the data
});
</script>
