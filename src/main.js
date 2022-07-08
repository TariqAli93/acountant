import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify'
import Toasted from 'vue-toasted';

Vue.config.productionTip = false;

Vue.use(Toasted);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    // Prevent blank screen in Electron builds
    if (this.$route.path !== '/') {
      this.$router.push('/');
    }
  }
}).$mount("#app");
