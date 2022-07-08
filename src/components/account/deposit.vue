<template>
  <v-container>
    <v-form
      ref="depositRef"
      v-model="depositModel.valid"
      lazy-validation
      @submit.prevent="deposit"
    >
      <v-row>
        <v-col cols="12" sm="12" md="4" lg="4" xl="4">
          <v-text-field
            outlined
            color="secondary"
            label="المبلغ"
            placeholder="المبلغ"
            :rules="rules"
            v-model="depositModel.amount"
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
            v-model="depositModel.activitieBy"
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
            v-model="depositModel.idCustomer"
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
            v-model="depositModel.note"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-btn
        type="submit"
        color="success"
        large
        :disabled="!depositModel.valid"
      >
        ايداع المبلغ
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { GetCustomers, IncrementCustomerBalance } from "@/api/customers.js";
import { depositAccount, createActivities } from "@/api/accounts.js";
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
    depositModel: {
      activitieBy: null,
      activitieType: 2,
      idCustomer: null,
      amount: 0,
      note: "لا يوجد ملاحظات",
      createdAt: new Date().toISOString(),
      valid: false,
    },
  }),

  mounted() {
    this.getCustomer();
    this.depositModel.idCustomer = this.theCustomer || null;
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

    async deposit() {
      try {
        // handel all withdraw status
        if (this.$store.getters.getSelectedAccount == null) {
          this.$toasted.error("يجب تحديد حساب", {
            position: "top-center",
            duration: 5000,
          });
          return;
        } else if (this.depositModel.amount <= 0) {
          this.$toasted.error("يجب تحديد المبلغ", {
            position: "top-center",
            duration: 5000,
          });
          return;
        } else if (this.depositModel.idCustomer == null) {
          this.$toasted.error("يجب تحديد العميل", {
            position: "top-center",
            duration: 5000,
          });
          return;
        } else {
          const depositData = {
            accountId:
              this.$store.getters.getSelectedAccount == null
                ? ""
                : this.$store.getters.getSelectedAccount.accountId,
            amount: this.depositModel.amount * 1,
            userId: this.$store.getters.getUser.id,
          };

          const activitieData = {
            activitieType: this.depositModel.activitieType,
            activitieBy: this.depositModel.activitieBy,
            note: this.depositModel.note,
            amount: this.depositModel.amount * 1,
            createdAt: this.depositModel.createdAt,
            customerId: this.depositModel.idCustomer.customerId,
            accountId: this.$store.getters.getSelectedAccount.accountId,
          };

          await depositAccount(depositData);
          await createActivities(activitieData);
          await IncrementCustomerBalance({
            customerId: this.depositModel.idCustomer.customerId,
            customerAmount: this.depositModel.amount * 1,
          });

          this.$toasted.success("تم ايداع المبلغ", {
            position: "top-center",
            duration: 5000,
          });

          bus.$emit("deposit");
        }
      } catch (error) {
        this.$toasted.error("حدث خطأ ما", {
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