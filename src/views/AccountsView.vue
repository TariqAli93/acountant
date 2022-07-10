<template>
  <div class="page--accounts">
    <v-card elevation="1" class="mb-10">
      <v-toolbar color="primary" dense flat elevation="0">
        <v-toolbar-title>اضافة حساب جديد</v-toolbar-title>
      </v-toolbar>

      <v-divider />

      <v-container>
        <v-form
          ref="accountFormRef"
          v-model="account.valid"
          lazy-validation
          @submit.prevent="upsertAccount"
        >
          <v-row>
            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-text-field
                outlined
                color="secondary"
                label="اسم الحساب"
                placeholder="اسم الحساب"
                :rules="rules"
                v-model="account.name"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-text-field
                outlined
                color="secondary"
                label="المبلغ"
                placeholder="المبلغ"
                :rules="rules"
                v-model="account.amount"
                type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-select
                :items="account_type"
                outlined
                color="secondary"
                label="نوع الحساب"
                placeholder="نوع الحساب"
                v-model="account.accountType"
                type="number"
                item-color="secondary"
              ></v-select>
            </v-col>
          </v-row>

          <div class="d-flex">
            <v-btn large color="success" type="submit"> حفظ البيانات </v-btn>
            <v-spacer />
            <v-btn
              large
              color="secondary"
              v-if="account.type === 2"
              @click="clearAccount"
            >
              انشاء حساب جديد
            </v-btn>
          </div>
        </v-form>
      </v-container>
    </v-card>

    <v-card elevation="1">
      <v-toolbar color="primary" dense flat elevation="0">
        <v-toolbar-title>الحسابات</v-toolbar-title>
      </v-toolbar>

      <v-divider />

      <v-container>
        <v-data-table :headers="headers" :items="accounts" :items-per-page="50">
          <template #[`item.actions`]="{ item }">
            <v-btn icon>
              <v-icon @click="editAccount(item)">edit</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon @click="deleteAccount(item)">delete</v-icon>
            </v-btn>
          </template>

          <template #[`item.isDefault`]="{ item }">
            <v-chip>{{
              item.isDefault === 1 ? "حساب اساسي" : "حساب فرعي"
            }}</v-chip>
          </template>
        </v-data-table>

        <v-divider />

        <div class="d-flex pt-5">
          <v-chip color="secondary">
            المجموع: {{ countAccountsBalance }}
          </v-chip>

          <v-spacer />

          <v-chip color="secondary">
            المجموع كتابة: {{ countAccountsBalance | formatAmount }}
          </v-chip>
        </div>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import {
  CreateAccount,
  UpdateAccount,
  GetAccount,
  DeleteAccount,
} from "@/api/accounts";

import tafqeet from "@/plugins/tafqeet";
import { truncateSync } from "original-fs";
export default {
  data: () => ({
    account: {
      name: "",
      amount: "",
      accountId: "",
      accountType: 0,
      type: 1, // 1 is create || 2 is update
      valid: false,
    },
    account_type: [
      { text: "حساب اساسي", value: 1 },
      { text: "حساب فرعي", value: 0 },
    ],
    rules: [(v) => !!v || "الرجاء ادخال البيانات"],
    accounts: [],
    customers: [],
    headers: [
      { text: "رقم الحساب", value: "accountId" },
      { text: "اسم الحساب", value: "accountName" },
      { text: "المبلغ", value: "amount" },
      { text: "نوع الحساب", value: "isDefault" },
      { text: "الاجرائات", value: "actions" },
    ],
  }),

  computed: {
    userId() {
      return this.$store.getters.getUser.id;
    },

    countAccountsBalance() {
      return this.accounts.reduce((acc, cur) => {
        return acc + cur.amount * 1;
      }, 0);
    },
  },

  filters: {
    formatAmount(value) {
      return tafqeet(value);
    },
  },

  mounted() {
    this.getAccounts();
  },

  methods: {
    async upsertAccount() {
      try {
        if (this.$refs.accountFormRef.validate()) {
          if (this.account.type === 1) {
            await CreateAccount({
              userId: this.userId,
              accountName: this.account.name,
              amount: this.account.amount,
              isDefault: this.account.accountType,
            });
            this.account.type = 1;
            this.account.name = "";
            this.account.amount = "";
            this.getAccounts();
            this.$toasted.success("تم انشاء الحساب بنجاح", {
              position: "top-center",
              duration: 5000,
            });
          } else {
            await UpdateAccount({
              accountId: this.account.accountId,
              accountName: this.account.name,
              amount: this.account.amount,
              isDefault: this.account.accountType,
            });
            this.getAccounts();
            this.clearAccount();
            this.$toasted.success("تم تعديل البيانات بنجاح", {
              position: "top-center",
              duration: 5000,
            });
          }
        }
      } catch (e) {
        console.error(e);
        this.$toasted.error(e, {
          duration: 5000,
          position: "top-center",
        });
      }
    },

    async getAccounts() {
      try {
        const accounts = await GetAccount();
        this.accounts = accounts;
      } catch (error) {
        console.log(error);
      }
    },

    editAccount(account) {
      this.account.type = 2;
      this.account.name = account.accountName;
      this.account.amount = account.amount;
      this.account.accountId = account.accountId;
      this.account.accountType = account.isDefault;
      this.$vuetify.goTo(0);
    },

    async deleteAccount(account) {
      console.log(account)
      try {
        await DeleteAccount(account.accountId);
        this.getAccounts();
        this.$toasted.success("تم حذف الحساب بنجاح", {
          position: "top-center",
          duration: 5000,
        });
      } catch (e) {
        console.error(e);
        this.$toasted.error(e, {
          duration: 5000,
          position: "top-center",
        });
      }
    },

    clearAccount() {
      this.account.type = 1;
      this.account.name = "";
      this.account.amount = "";
    },
  },
};
</script>

<style>
</style>