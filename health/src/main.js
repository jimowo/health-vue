import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/utils/ajax";
import "@/utils/elementui";
import "@/utils/fontAwesome";
import "@/assets/global.css";
import "@/utils/permission";


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
