<template>
  <div class="login-component">
    <v-dialog
      persistent
      v-model="loginDialog"
      max-width="350px"
      overlay-opacity="1"
      overlay-color="secondary"
    >
      <v-card>
        <v-card-title>
          <span class="headline">تسجيل الدخول</span>
        </v-card-title>
        <v-divider class="mt-2 mb-4" />
        <v-card-text>
          <v-form
            ref="form"
            v-model="form"
            lazy-validation
            @submit.prevent="login"
          >
            <v-text-field
              v-model="userName"
              :rules="[(v) => !!v || 'لا يمكنك ترك الحقل فارغ']"
              label="اسم المستخدم"
              required
              color="secondary"
              outlined
              autofocus
            ></v-text-field>

            <v-text-field
              v-model="password"
              :rules="[(v) => !!v || 'لا يمكنك ترك الحقل فارغ']"
              label="كلمة المرور"
              color="secondary"
              required
              outlined
              type="password"
            ></v-text-field>

            <v-btn color="success" type="submit" :disabled="!form"
              >تسجيل الدخول</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { bus } from "@/plugins/bus.js";
import Login from "@/api/users.js";
export default {
  data: () => ({
    loginDialog: true,
    userName: "",
    password: "",
    form: false,
  }),

  methods: {
    IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    async login() {
      bus.$emit("loading-start");
      try {
        const user = await Login(this.userName, this.password);
        this.$store.dispatch("login", user);
        bus.$emit("loading-end");
      } catch (error) {
        bus.$emit("loading-end");
        this.$toasted.error("خطأ في اسم المستخدم او كلمة المرور", {
          position: "top-center",
          duration: 5000,
        });
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss">
.login-component {
  .v-dialog__content {
    z-index: 3000 !important;
  }
}
</style>