<template>
  <div class="page--profile">
    <v-toolbar class="mb-10" dense elevation="1">
      <v-toolbar-title>ملف العميل ({{ $route.params.name }})</v-toolbar-title>
      <v-spacer />
      <v-chip>
        {{ customerAmountStatus }}
      </v-chip>
      <v-btn icon large @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- withdraw and deposit components -->
    <v-row class="mb-10">
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <v-card elevation="1">
          <v-toolbar color="primary" dense flat elevation="0">
            <v-toolbar-title>سحب</v-toolbar-title>
          </v-toolbar>

          <v-divider />

          <v-container>
            <withdraw :theCustomer="$route.params.theCustomer" />
          </v-container>
        </v-card>
      </v-col>

      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <v-card elevation="1">
          <v-toolbar color="primary" dense flat elevation="0">
            <v-toolbar-title>ايداع</v-toolbar-title>
          </v-toolbar>

          <v-divider />

          <v-container>
            <deposit :theCustomer="$route.params.theCustomer" />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <!-- withdraw and deposit components -->

    <!-- create customer activites -->
    <v-card elevation="1" class="mb-10">
      <v-toolbar color="primary" dense flat elevation="0">
        <v-toolbar-title>اضافة كشف للعميل</v-toolbar-title>
      </v-toolbar>

      <v-divider />

      <v-container>
        <v-form
          ref="customerFormRef"
          v-model="customerTrans.valid"
          lazy-validation
          @submit.prevent="customerTransaction"
        >
          <v-row>
            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-text-field
                outlined
                color="secondary"
                label="المبلغ"
                placeholder="المبلغ"
                :rules="rules"
                v-model="customerTrans.amount"
                type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-text-field
                outlined
                color="secondary"
                label="بواسطة"
                placeholder="بواسطة"
                :rules="rules"
                v-model="customerTrans.activitieBy"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-select
                :items="customers"
                item-text="customerName"
                item-value="customerId"
                item-color="secondary"
                outlined
                color="secondary"
                label="العميل"
                placeholder="العميل"
                :rules="rules"
                v-model="customerTrans.idCustomer"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-select
                :items="activitieTypes"
                item-color="secondary"
                outlined
                color="secondary"
                label="نوع الحركة"
                placeholder="نوع الحركة"
                :rules="rules"
                v-model="customerTrans.activitieType"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="customerTrans.createdAt"
                    outlined
                    color="secondary"
                    label="تاريخ الحركة"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                color="secondary"
                  v-model="customerTrans.createdAt"
                  :active-picker.sync="activePicker"
                  :max="
                    new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .substr(0, 10)
                  "
                  min="1950-01-01"
                  @change="save"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-select
                :items="accounts"
                item-text="accountName"
                item-value="accountId"
                item-color="secondary"
                outlined
                color="secondary"
                label="الحساب"
                placeholder="الحساب"
                :rules="rules"
                v-model="customerTrans.accountId"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-textarea
                outlined
                color="secondary"
                label="الملاحظات"
                placeholder="الملاحظات"
                :rules="rules"
                v-model="customerTrans.note"
              ></v-textarea>
            </v-col>
          </v-row>

          <v-btn large color="success" type="submit"> اضافة الكشف </v-btn>
        </v-form>
      </v-container>
    </v-card>
    <!-- create customer activites -->

    <!-- customer activites list -->
    <v-card elevation="1">
      <v-toolbar color="primary" dense flat elevation="0">
        <v-toolbar-title style="width: 160px"
          >كشوفات {{ $route.params.name }}</v-toolbar-title
        >

        <v-spacer />
        <v-btn icon @click="exportTable">
          <v-icon>print</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />
      <v-data-table
        :items="transactions"
        :headers="headers"
        :items-per-page="50"
      >
        <template #[`item.activitieType`]="{ item }">
          <v-chip
            :color="item.activitieType === 1 ? 'error' : 'success'"
            class="white--text"
          >
            {{ item.activitieType === 1 ? "سحب" : "ايداع" }}
          </v-chip>
        </template>

        <template #[`item.isDeleted`]="{ item }">
          <v-chip
            :color="item.isDeleted === 1 ? 'error' : 'success'"
            class="white--text"
          >
            {{ item.isDeleted === 1 ? "حساب محذوف" : "طبيعي" }}
          </v-chip>
        </template>

        <template #[`item.createdAt`]="{ item }">
          {{ item.createdAt | formatDate }}
        </template>
      </v-data-table>
    </v-card>
    <!-- customer activites list -->
  </div>
</template>

<script>
import { GetActivitiesByCustomer } from "@/api/activities";
import {
  GetCustomers,
  DecrementCustomerBalance,
  IncrementCustomerBalance,
} from "@/api/customers.js";
import { GetAccount, createActivities } from "../api/accounts.js";
import withdraw from "@/components/account/withdraw.vue";
import deposit from "@/components/account/deposit.vue";
import exportExcel from "@/plugins/excel.js";
import moment from "moment";
import { bus } from "@/plugins/bus.js";
export default {
  components: {
    withdraw,
    deposit,
  },
  data: () => ({
    transactions: [],
    customers: [],
    accounts: [],
    rules: [(v) => !!v || "الحقل مطلوب"],
    activitieTypes: [
      {
        text: "سحب",
        value: 1,
      },
      {
        text: "ايداع",
        value: 2,
      },
    ],
    customerTrans: {
      activitieBy: null,
      activitieType: 1,
      idCustomer: null,
      amount: 0,
      note: "لا يوجد ملاحظات",
      accountId: null,
      createdAt: new Date().toISOString().split("T")[0],
      valid: false,
    },
    headers: [
      { text: "رقم الحركة", value: "activitieId" },
      { text: "نوع الحركة", value: "activitieType" },
      { text: "تاريخ الحركة", value: "createdAt" },
      { text: "المبلغ", value: "amount" },
      { text: "الملاحظات", value: "note" },
      { text: "بواسطة", value: "activitieBy" },
      { text: "العميل", value: "customerName" },
      { text: "الحساب", value: "accountName" },
      { text: "حالة الحساب", value: "isDeleted" },
    ],

    activePicker: null,
    menu: false,
  }),
  filters: {
    formatDate(value) {
      if (!value) return "";
      return moment(value).format("YYYY-MM-DD");
    },
  },

  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },

  computed: {
    customerAmountStatus() {
      const amount =
        this.transactions.length > 0
          ? this.transactions[0].customerAmount * 1
          : 0;
      return amount < 0 ? `مطلوب ${amount}` : `يطلب ${amount}`;
    },
  },

  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },

    async getActivities() {
      try {
        const activities = await GetActivitiesByCustomer(this.$route.params.id);
        this.transactions = activities;
        console.log(this.transactions);
      } catch (error) {
        console.log(error);
      }
    },

    exportTable() {
      exportExcel(this.transactions, 2);
    },

    async getCustomer() {
      try {
        const customers = await GetCustomers();
        this.customers = customers;
      } catch (error) {
        console.log(error);
      }
    },

    async getAccounts() {
      try {
        const account = await GetAccount();
        this.accounts = account;
      } catch (error) {
        console.error(error);
      }
    },

    async customerTransaction() {
      try {
        if (this.$refs.customerFormRef.validate()) {
          const activitiesData = {
            activitieBy: this.customerTrans.activitieBy,
            activitieType: this.customerTrans.activitieType,
            customerId: this.customerTrans.idCustomer,
            amount: this.customerTrans.amount,
            note: this.customerTrans.note,
            accountId: this.customerTrans.accountId,
            createdAt: this.customerTrans.createdAt,
          };

          console.log(activitiesData)
          await createActivities(activitiesData);

          if (this.customerTrans.activitieType === 1) {
            await DecrementCustomerBalance({
              customerId: this.$route.params.id,
              customerAmount: this.customerTrans.amount * 1,
            });
          } else {
            await IncrementCustomerBalance({
              customerId: this.$route.params.id,
              customerAmount: this.customerTrans.amount * 1,
            });
          }

          this.getActivities();
        }
      } catch (error) {
        console.error(error);
      }
    },
  },

  mounted() {
    this.getActivities();
    this.getCustomer();
    this.getAccounts();

    this.customerTrans.idCustomer = this.$route.params.id;

    bus.$on("withdraw", () => this.getActivities());
    bus.$on("deposit", () => this.getActivities());
  },
};
</script>

<style>
</style>