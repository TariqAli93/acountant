<template>
  <div class="page--home">
    <v-card class="mb-10" elevation="1">
      <v-toolbar color="primary" dense flat elevation="0">
        <v-toolbar-title style="width: 260px">الكشوفات اليوميه</v-toolbar-title>
      </v-toolbar>
      <v-divider class="mb-3 mt-2" />
      <v-container>
        <v-form ref="filRef" lazy-validation @submit.prevent="filterActivites">
          <v-row>
            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-select
                v-model="activitieType"
                :items="activitieTypes"
                outlined
                label="نوع الكشف"
                color="secondary"
                item-color="secondary"
                clearable
              ></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-select
                v-model="customerId"
                :items="customers"
                item-text="customerName"
                item-value="customerId"
                outlined
                label="العميل"
                color="secondary"
                item-color="secondary"
                clearable
              ></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-select
                v-model="accountId"
                :items="accounts"
                item-text="accountName"
                item-value="accountId"
                outlined
                label="الحساب"
                color="secondary"
                item-color="secondary"
                clearable
              ></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="6" lg="6" xl="6">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    v-model="date1"
                    label="من تاريخ..."
                    placeholder="من"
                    persistent-placeholder
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="secondary"
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date1"
                  no-title
                  dark
                  :active-picker.sync="activePicker"
                  :max="
                    new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .substr(0, 10)
                  "
                  min="1950-01-01"
                  @change="save1"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" sm="12" md="6" lg="6" xl="6">
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    v-model="date2"
                    label="الى تاريخ ..."
                    placeholder="الى"
                    persistent-placeholder
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="secondary"
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date2"
                  no-title
                  dark
                  :active-picker.sync="activePicker"
                  :max="
                    new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .substr(0, 10)
                  "
                  min="1950-01-01"
                  @change="save2"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-btn large color="success" type="submit"> تصفية الكشوفات </v-btn>
        </v-form>
      </v-container>
    </v-card>
    <v-card elevation="1">
      <v-toolbar color="primary" dense flat elevation="0">
        <v-toolbar-title style="width: 160px">الكشوفات اليوميه</v-toolbar-title>

        <v-spacer />
        <v-btn icon @click="exportTable">
          <v-icon>print</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />
      <v-data-table
        :items="transactions"
        :headers="headers"
        :search="search"
        :items-per-page="50"
      >
        <template #top>
          <v-container>
            <v-text-field
              v-model="search"
              label="بحث"
              outlined
              hide-details
              color="secondary"
            ></v-text-field>
          </v-container>
        </template>
        <template #[`item.activitieType`]="{ item }">
          <v-chip
            :color="item.activitieType === 1 ? 'error' : 'success'"
            class="white--text"
          >
            {{ item.activitieType === 1 ? "سحب" : "ايداع" }}
          </v-chip>
        </template>

        <template #[`item.createdAt`]="{ item }">
          {{ item.createdAt | formatDate }}
        </template>

        <template #[`item.isDeleted`]="{ item }">
          <v-chip
            :color="item.isDeleted === 1 ? 'error' : 'success'"
            class="white--text"
          >
            {{ item.isDeleted === 1 ? "حساب محذوف" : "طبيعي" }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn icon color="error" @click="confirmDelete(item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import {
  GetActivities,
  GetActivitiesByQuery,
  DeleteActivity,
} from "@/api/activities";
import {
  GetCustomers,
  DecrementCustomerBalance,
  IncrementCustomerBalance,
} from "@/api/customers";
import { GetAccount, withdrawAccount, depositAccount } from "@/api/accounts";
import exportExcel from "@/plugins/excel.js";
import moment from "moment";
import { remote } from "electron";
import { bus } from "@/plugins/bus.js";
export default {
  data: () => ({
    transactions: [],
    headers: [
      { text: "نوع الحركة", value: "activitieType" },
      { text: "تاريخ الحركة", value: "createdAt" },
      { text: "المبلغ", value: "amount" },
      { text: "الملاحظات", value: "note" },
      { text: "بواسطة", value: "activitieBy" },
      { text: "العميل", value: "customerName" },
      { text: "الحساب", value: "accountName" },
      { text: "حالة الحساب", value: "isDeleted" },
      { text: "الاجرائات", value: "actions" },
    ],
    activitieTypes: [
      { text: "سحب", value: 1 },
      { text: "ايداع", value: 2 },
    ],
    date1: "",
    date2: "",
    activitieType: "",
    menu1: false,
    menu2: false,
    customers: [],
    accounts: [],
    accountId: "",
    customerId: "",
    activePicker: null,

    rules: [(v) => !!v || "التاريخ مطلوب"],
    search: "",
  }),

  watch: {
    menu1(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },

    menu2(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },

  filters: {
    formatDate(value) {
      if (!value) return "";
      return moment(value).format("YYYY-MM-DD");
    },
  },

  mounted() {
    this.getTransactions();
    this.getCustomers();
    this.getAccounts();
  },

  methods: {
    save1(date) {
      this.$refs.menu1.save(date);
    },

    save2(date) {
      this.$refs.menu2.save(date);
    },

    async getTransactions() {
      try {
        const transaction = await GetActivities();
        this.transactions = transaction;
        console.log(this.transactions);
      } catch (error) {
        console.error(error);
      }
    },

    exportTable() {
      exportExcel(this.transactions, 1);
    },

    async filterActivites() {
      try {
        if (this.$refs.filRef.validate()) {
          const query = {
            startDate: this.date1,
            endDate: this.date2,
            activitieType: this.activitieType,
            customerId: this.customerId,
            accountId: this.accountId,
          };
          const transaction = await GetActivitiesByQuery(query);
          this.transactions = transaction;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getCustomers() {
      try {
        const customers = await GetCustomers();
        this.customers = customers;
      } catch (error) {
        console.error(error);
      }
    },

    async getAccounts() {
      try {
        const accounts = await GetAccount();
        this.accounts = accounts;
      } catch (error) {
        console.error(error);
      }
    },

    confirmDelete(item) {
      const dialogOpts = {
        type: "warning",
        buttons: ["إلغاء", "حذف العملية"],
        title: "حذف العملية",
        message: "هل أنت متأكد من أنك تريد خذف العملية؟",
        detail: "سيتم خذف العملية بعد الضغط على زر الحذف",
      };

      remote.dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 1) {
          this.deleteActivities(item);
        }
      });
    },

    async deleteActivities(item) {
      const { activitieId, activitieType, amount, accountId, customerId } =
        item;
      const depositData = {
        accountId: accountId * 1,
        amount: amount * 1,
        userId: this.$store.getters.getUser.id,
      };

      const withdrawData = {
        accountId: accountId * 1,
        amount: amount * 1,
        userId: this.$store.getters.getUser.id,
      };

      // if 1 then call deposit function else call withdraw
      if (activitieType === 1) {
        IncrementCustomerBalance({
          customerId: customerId * 1,
          customerAmount: amount * 1,
        });

        await depositAccount(depositData);

        this.$toasted.success("تم حذف العملية بنجاح", {
          position: "top-center",
          duration: 5000,
        });

        bus.$emit("deposit");
        await DeleteActivity(activitieId * 1);
      } else {
        DecrementCustomerBalance({
          customerId: customerId * 1,
          customerAmount: amount * 1,
        });

        withdrawAccount(withdrawData);

        this.$toasted.success("تم حذف العملية بنجاح", {
          position: "top-center",
          duration: 5000,
        });

        bus.$emit("withdraw");
        await DeleteActivity(activitieId * 1);
      }

      this.getTransactions();
    },
  },
};
</script>

<style>
</style>