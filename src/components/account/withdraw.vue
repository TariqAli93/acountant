<template>
  <v-container>
    <v-form
      ref="withdrawRef"
      v-model="withdrawModel.valid"
      lazy-validation
      @submit.prevent="withdraw"
    >
      <v-row>
        <v-col cols="12" sm="12" md="4" lg="4" xl="4">
          <v-text-field
            outlined
            color="secondary"
            label="المبلغ"
            placeholder="المبلغ"
            :rules="rules"
            v-model="withdrawModel.amount"
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
            v-model="withdrawModel.activitieBy"
            type="text"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="12" md="4" lg="4" xl="4">
          <v-combobox
            outlined
            :items="customers"
            item-text="customerName"
            item-value="customerId"
            color="secondary"
            item-color="secondary"
            label="العميل"
            placeholder="العميل"
            :rules="rules"
            v-model="withdrawModel.idCustomer"
            type="text"
          ></v-combobox>
        </v-col>

        <v-col cols="12">
          <v-textarea
            outlined
            color="secondary"
            label="الملاحظات"
            placeholder="الملاحظات"
            :rules="rules"
            v-model="withdrawModel.note"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-btn
        type="submit"
        color="success"
        large
        :disabled="!withdrawModel.valid"
      >
        سحب المبلغ
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { GetCustomers, DecrementCustomerBalance } from "@/api/customers.js";
import { withdrawAccount, createActivities } from "@/api/accounts.js";
import { bus } from "@/plugins/bus.js";
export default {
  props: {
    theCustomer: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    rules: [(v) => !!v || "لا يمكن ترك الحقل فارغ"],
    customers: [],
    withdrawModel: {
      activitieBy: null,
      activitieType: 1,
      idCustomer: null,
      amount: 0,
      note: "لا يوجد ملاحظات",
      createdAt: new Date().toISOString(),
      valid: false,
    },
  }),

  mounted() {
    this.getCustomer();
    this.withdrawModel.idCustomer = this.theCustomer || null;
  },

  methods: {
    async getCustomer() {
      try {
        const customers = await GetCustomers();
        this.customers = customers;
      } catch (error) {
        console.log(error);
      }
    },

    async withdraw() {
      try {
        // handel all withdraw status
        if (this.$store.getters.getSelectedAccount == null) {
          this.$toasted.error("يجب تحديد حساب", {
            position: "top-center",
            duration: 5000,
          });
          return;
        } else if (this.withdrawModel.amount <= 0) {
          this.$toasted.error("يجب تحديد المبلغ", {
            position: "top-center",
            duration: 5000,
          });
          return;
        } else if (this.withdrawModel.idCustomer == null) {
          this.$toasted.error("يجب تحديد العميل", {
            position: "top-center",
            duration: 5000,
          });
          return;
        } else if (
          this.$store.getters.getSelectedAccount.amount * 1 <
          this.withdrawModel.amount
        ) {
          this.$toasted.error("المبلغ أكبر من الحساب", {
            position: "top-center",
            duration: 5000,
          });
          return;
        } else {
          const withdrawData = {
            accountId:
              this.$store.getters.getSelectedAccount == null
                ? ""
                : this.$store.getters.getSelectedAccount.accountId,
            amount: this.withdrawModel.amount * 1,
            userId: this.$store.getters.getUser.id,
          };

          const activitieData = {
            activitieType: this.withdrawModel.activitieType,
            activitieBy: this.withdrawModel.activitieBy,
            note: this.withdrawModel.note,
            amount: this.withdrawModel.amount * 1,
            createdAt: this.withdrawModel.createdAt,
            customerId: this.withdrawModel.idCustomer.customerId,
            accountId: this.$store.getters.getSelectedAccount.accountId,
          };

          await withdrawAccount(withdrawData);
          await createActivities(activitieData);
          await DecrementCustomerBalance({
            customerId: this.withdrawModel.idCustomer.customerId,
            customerAmount: this.withdrawModel.amount * 1,
          });
          this.$toasted.success("تم سحب المبلغ", {
            position: "top-center",
            duration: 5000,
          });

          bus.$emit("withdraw");
        }
      } catch (error) {
        this.$toasted.error("حدث خطأ أثناء السحب", {
          position: "top-center",
          duration: 5000,
        });
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>