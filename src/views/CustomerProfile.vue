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
        <v-form ref="customerFormRef" v-model="customerTrans.valid" validate-on="submit lazy"
          @submit.prevent="customerTransaction">
          <v-row>
            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-text-field outlined color="secondary" label="المبلغ" placeholder="المبلغ" :rules="rules"
                v-model="customerTrans.amount" type="number"></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-text-field outlined color="secondary" label="بواسطة" placeholder="بواسطة" :rules="rules"
                v-model="customerTrans.activitieBy"></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-select :items="customer" item-text="customerName" item-value="customerId" item-color="secondary" outlined
                color="secondary" label="العميل" placeholder="العميل" :rules="rules"
                v-model="customerTrans.idCustomer"></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-select :items="activitieTypes" item-color="secondary" outlined color="secondary" label="نوع الحركة"
                placeholder="نوع الحركة" :rules="rules" v-model="customerTrans.activitieType"></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y
                min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="customerTrans.createdAt" outlined color="secondary" label="تاريخ الحركة" readonly
                    v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker color="secondary" v-model="customerTrans.createdAt" :active-picker.sync="activePicker"
                  :max="new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .substr(0, 10)
                    " min="1950-01-01" @change="save"></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-select :items="accounts" item-text="accountName" item-value="accountId" item-color="secondary" outlined
                color="secondary" label="الحساب" placeholder="الحساب" :rules="rules"
                v-model="customerTrans.accountId"></v-select>
            </v-col>

            <v-col cols="12">
              <v-textarea outlined color="secondary" label="الملاحظات" placeholder="الملاحظات" :rules="rules"
                v-model="customerTrans.note"></v-textarea>
            </v-col>
          </v-row>

          <v-btn large color="success" type="submit" :disabled="customerTrans.valid != true"
            :loading="customerTrans.loading"> اضافة الكشف </v-btn>
        </v-form>
      </v-container>
    </v-card>
    <!-- create customer activites -->

    <!-- customer activites list -->
    <v-card elevation="1">
      <v-toolbar color="primary" dense flat elevation="0">
        <v-toolbar-title style="width: 160px">كشوفات {{ $route.params.name }}</v-toolbar-title>

        <v-spacer />
        <v-btn icon @click="exportTable">
          <v-icon>print</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />
      <v-data-table :items="transactions" :headers="headers" :items-per-page="50">
        <template #[`item.activitieType`]="{ item }">
          <v-chip :color="item.activitieType === 1 ? 'error' : 'success'" class="white--text">
            {{ item.activitieType === 1 ? "سحب" : "ايداع" }}
          </v-chip>
        </template>

        <template #[`item.isDeleted`]="{ item }">
          <v-chip :color="item.isDeleted === 1 ? 'error' : 'success'" class="white--text">
            {{ item.isDeleted === 1 ? "حساب محذوف" : "طبيعي" }}
          </v-chip>
        </template>

        <template #[`item.createdAt`]="{ item }">
          {{ item.createdAt | formatDate }}
        </template>

        <template #[`item.activitieStatus`]="{ item }">
          <v-chip :color="item.activitieStatus === 1 ? 'success' : 'error'" class="white--text">

            {{ item.activitieStatus === 1 ? "حقيقي" : "وهمي" }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn icon color="error" @click="confirmDelete(item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <!-- customer activites list -->
  </div>
</template>

<script>
import { GetActivitiesByCustomer, DeleteActivity } from "@/api/activities";
import {
  GetCustomerById,
  DecrementCustomerBalance,
  IncrementCustomerBalance,
} from "@/api/customers.js";
import {
  GetAccount,
  createActivities,
  withdrawAccount,
  depositAccount,
} from "../api/accounts.js";
import withdraw from "@/components/account/withdraw.vue";
import deposit from "@/components/account/deposit.vue";
import exportExcel from "@/plugins/excel.js";
import moment from "moment";
import { bus } from "@/plugins/bus.js";
import { remote } from "electron";
export default {
  components: {
    withdraw,
    deposit,
  },
  data: () => ({
    transactions: [],
    accounts: [],
    customer: [],
    customerAmount: 0,
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
      loading: false,
    },
    headers: [
      { text: "رقم الحركة", value: "activitieId" },
      { text: "نوع الحركة", value: "activitieType" },
      { text: "تاريخ الحركة", value: "createdAt" },
      { text: "حالة الحركة", value: "activitieStatus" },
      { text: "المبلغ", value: "amount" },
      { text: "الملاحظات", value: "note" },
      { text: "بواسطة", value: "activitieBy" },
      { text: "العميل", value: "customerName" },
      { text: "الحساب", value: "accountName" },
      { text: "حالة الحساب", value: "isDeleted" },
      { text: "الاجرائات", value: "actions" },
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
      const amount = this.customerAmount !== undefined ? this.customerAmount * 1 : 0;
      return amount < 0 ? `مطلوب ${amount}` : `يطلب ${amount}`;
    },

    isDisabled() {
      // evaluate whatever you need to determine disabled here...
      return this.$refs.customerFormRef.validate();
    }
  },

  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },

    async getActivities() {
      try {
        const activities = await GetActivitiesByCustomer(this.$route.params.id);
        this.transactions = activities;
      } catch (error) {
        console.log(error);
      }
    },

    exportTable() {
      exportExcel(this.transactions, 2, this.customerAmountStatus);
    },

    async getCustomerById() {
      try {
        const customer = await GetCustomerById(this.$route.params.id * 1);
        this.customer = customer;
        this.customerAmount = customer[0].customerAmount;
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
      this.customerTrans.loading = true;
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
            activitieStatus: 0
          };


          await createActivities(activitiesData);

          if (this.customerTrans.activitieType === 1) {
            await DecrementCustomerBalance({
              customerId: this.$route.params.id,
              customerAmount: this.customerTrans.amount * 1,
            });

            setTimeout(() => {

              this.customerTrans.loading = false;
            }, 3000)
          } else {
            await IncrementCustomerBalance({
              customerId: this.$route.params.id,
              customerAmount: this.customerTrans.amount * 1,
            });

            setTimeout(() => {

              this.customerTrans.loading = false;
            }, 3000)
          }

          this.getActivities();
          this.getCustomerById();
          setTimeout(() => {

            this.customerTrans.amount = "";
            this.customerTrans.activitieBy = "";
            this.customerTrans.loading = false;
          }, 3000)

        }
      } catch (error) {
        console.error(error);
        this.customerTrans.loading = false;
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
      const { activitieId, activitieType, amount, accountId, customerId, activitieStatus } =
        item;

      if (activitieStatus === 0) {
        if (activitieType === 1) {
          IncrementCustomerBalance({
            customerId: customerId * 1,
            customerAmount: amount * 1,
          });



          this.$toasted.success("تم حذف العملية بنجاح", {
            position: "top-center",
            duration: 5000,
          });

          await DeleteActivity(activitieId * 1);
        } else {
          DecrementCustomerBalance({
            customerId: customerId * 1,
            customerAmount: amount * 1,
          });


          this.$toasted.success("تم حذف العملية بنجاح", {
            position: "top-center",
            duration: 5000,
          });

          await DeleteActivity(activitieId * 1);
        }
      }
      else {
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
      }

      this.getActivities();
      this.getCustomerById();
    },
  },

  mounted() {
    this.getActivities();
    this.getAccounts();
    this.getCustomerById();

    this.customerTrans.idCustomer = this.$route.params.id;

    bus.$on("withdraw", () => this.getActivities());
    bus.$on("deposit", () => this.getActivities());
  },
};
</script>

<style></style>