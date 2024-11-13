import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";

// 本地SVG图标
import "virtual:svg-icons-register";

// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";
import "@/styles/index.scss";
import "uno.css";
import "animate.css";
import { InstallCodeMirror } from "codemirror-editor-vue3";
import QrcodeVue from "qrcode.vue";
import AppContainer from "@/components/AppContainer/index.vue";

const app = createApp(App);
// 注册插件
app.use(setupPlugins);
app.use(InstallCodeMirror);
app.component("QrcodeVue", QrcodeVue);
app.component("AppContainer", AppContainer);
app.mount("#app");
