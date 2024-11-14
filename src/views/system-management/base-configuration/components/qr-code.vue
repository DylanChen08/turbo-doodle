<template>
  <div class="qrcode-wrapper">
    <!-- 小的二维码展示 -->
    <div class="qrcode-thumbnail-container">
      <el-image
        :src="qrcodeUrl"
        fit="contain"
        preview-src-list="[qrcodeUrl]"
        class="qrcode-thumbnail"
        @click="handleShowModal"
      />
      <!-- 按钮组 -->
      <div class="button-group">
        <el-button
          icon="el-icon-view"
          type="primary"
          size="small"
          @click="handlePreview"
        >
          预览
        </el-button>
        <el-button
          icon="el-icon-download"
          type="success"
          size="small"
          @click="handleDownload"
        >
          下载
        </el-button>
      </div>
    </div>

    <!-- 弹框展示放大的二维码 -->
    <el-dialog v-model="isDialogVisible" title="二维码详情" width="400px">
      <div class="qrcode-container">
        <qrcode-vue :value="qrcodeUrl" :size="200" />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from "vue";
import QrcodeVue from "qrcode.vue";
import { ElMessage } from "element-plus";

const props = defineProps<{
  qrcodeUrl: string;
}>();

const isDialogVisible = ref<boolean>(false);

// 显示弹框
const handleShowModal = () => {
  isDialogVisible.value = true;
};

// 打开新标签页预览链接
const handlePreview = () => {
  window.open(props.qrcodeUrl, "_blank");
};

// 下载二维码图片
const handleDownload = () => {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  if (!canvas) {
    ElMessage.error("二维码生成失败");
    return;
  }
  const url = canvas.toDataURL("image/png"); // 转为图片地址
  const a = document.createElement("a");
  a.href = url;
  a.download = "qrcode.png";
  a.click();
  ElMessage.success("下载成功");
};
</script>

<style lang="scss" scoped>
.qrcode-wrapper {
  display: flex;
  align-items: center;

  .qrcode-thumbnail-container {
    display: flex;
    gap: 10px;
    align-items: center;

    .qrcode-thumbnail {
      width: 100px;
      height: 100px;
      cursor: pointer;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 10px;

      el-button {
        padding: 5px 10px;

        &.el-icon-view {
          color: #409eff;
        }

        &.el-icon-download {
          color: #67c23a;
        }
      }
    }
  }

  .qrcode-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
