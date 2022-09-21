<template>
  <div>
    <appTitle />
    <v-app>
      <v-layout v-if="loading" class="loading" justify-center align-center>
        <v-progress-circular indeterminate color="primary">
        </v-progress-circular>
      </v-layout>

      <v-navigation-drawer
        app
        color="primary"
        permanent
        right
        width="200"
        v-if="isLoggedIn"
        style="top: 36px"
      >
        <v-list nav dense class="transparent">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>face</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ userName }}</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list nav dense class="transparent">
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>account_balance_wallet</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>الصندوق</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/transaction">
            <v-list-item-icon>
              <v-icon>receipt_long</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>الكشوفات اليوميه</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/customers">
            <v-list-item-icon>
              <v-icon>group_add</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>العملاء</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/accounts">
            <v-list-item-icon>
              <v-icon>account_balance</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>حسابات القاصة</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <template #append>
          <div
            style="
              padding-bottom: 5rem;
              padding-right: 10px;
              padding-left: 10px;
            "
          >
            <v-btn
              depressed
              block
              color="warning"
              @click="exportDatabase"
              class="mb-2 secondary--text"
            >
              تصدير قاعدة البيانات
            </v-btn>

            <v-btn depressed block color="error" @click="logout">
              <v-icon color="white" class="ml-3">logout</v-icon>
              <span class="white--text">تسجيل الخروج</span>
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main v-if="isLoggedIn">
        <v-container>
          <router-view />
        </v-container>
      </v-main>

      <login v-if="!isLoggedIn" />
    </v-app>
  </div>
</template>

<script>
import login from "@/components/login/login.vue";
import { bus } from "@/plugins/bus";
import appTitle from "@/components/title/appTitle.vue";
import exportDb from "@/api/exportdb";
import { ipcRenderer, remote } from "electron";
export default {
  name: "App",
  components: {
    login,
    appTitle,
  },
  data: () => ({
    loading: false,
  }),

  created() {
    bus.$on("loading-start", () => (this.loading = true));
    bus.$on("loading-end", () => {
      setTimeout(() => (this.loading = false), 1000);
    });
  },

  computed: {
    userName() {
      return this.$store.getters.getUser.username;
    },

    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },

  methods: {
    exportDatabase() {
      exportDb();
      this.$toasted.success("تم تصدير قاعدة البيانات", {
        position: "top-center",
        duration: 5000,
      });
    },

    quitApp() {
      ipcRenderer.send("quit");
    },

    logout() {
      this.$store.dispatch("logout");
      remote.app.exit(0)
    },
  },
};
</script>
<style lang="scss">
@import url("./assets/fonts/style.css");
@import url("./assets/material-design-icons-iconfont/dist/material-design-icons.css");
@import url("../node_modules/@vscode/codicons/dist/codicon.css");
/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #d6d6d6 #ffffff;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 10px;
}

*::-webkit-scrollbar-track {
  background: #ffffff;
}

*::-webkit-scrollbar-thumb {
  background-color: #d6d6d6;
  border-radius: 9px;
  border: 4px solid #ffffff;
}
.v-application {
  padding-top: 45px;
}

html,
body,
.v-application {
  font-family: "Cairo Regular" !important;
  font-weight: normal;
}

.v-application .elevation-1 {
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}
</style>
<style lang="scss" scoped>
.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  top: 0;
  left: 0;
}
</style>