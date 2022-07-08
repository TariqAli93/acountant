<template>
  <div class="page--customers">
    <v-card class="mb-10" elevation="1">
      <v-toolbar color="primary" dense flat elevation="0">
        <v-toolbar-title>اضافة عميل جديد</v-toolbar-title>
      </v-toolbar>

      <v-divider />
      <v-container>
        <v-form
          ref="newCustomer"
          v-model="customer"
          lazy-validation
          @submit.prevent="createCustomer"
        >
          <v-row>
            <v-col cols="12" sm="12" md="6" lg="6" xl="6">
              <v-text-field
                v-model="customerName"
                label="اسم العميل"
                outlined
                color="secondary"
                :rules="rules"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="6" lg="6" xl="6">
              <v-select
                v-model="customerType"
                label="نوع العميل"
                :items="customerTypes"
                outlined
                item-color="secondary"
                color="secondary"
                :rules="rules"
              ></v-select>
            </v-col>
          </v-row>

          <v-btn large color="success" type="submit" :disabled="!customer">
            اضافة العميل
          </v-btn>
        </v-form>
      </v-container>
    </v-card>

    <v-card elevation="1">
      <v-toolbar color="primary" dense flat elevation="0">
        <v-toolbar-title style="width: 120px">العملاء</v-toolbar-title>

        <v-spacer />

        <v-chip color="primary" class="black--text">
          <span class="ml-3">عدد العملاء:</span>
          <span>{{ customersCount }}</span>
        </v-chip>
      </v-toolbar>

      <v-divider />

      <v-container>
        <v-text-field
          class="mt-5"
          v-model="search"
          outlined
          label="ابحث عن عميل"
          color="secondary"
        ></v-text-field>
      </v-container>

      <v-divider />

      <v-list nav dense width="100%">
        <v-list-item
          v-for="cus in filterdCustomers"
          :key="cus.customerId"
          class="d-flex border_bottom"
        >
          <span>{{ cus.customerName }}</span>
          <v-spacer />
          <span>{{ cus.customerType === 1 ? "موظف" : "اخر" }}</span>

          <v-divider vertical class="mr-5 ml-5" />

          <v-btn color="secondary" small @click="openProfile(cus)">
            <v-icon>analytics</v-icon>
            <span>الكشوفات</span>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { GetCustomers, CreateCustomer } from "../api/customers.js";
export default {
  data: () => ({
    customers: [], // customer list
    customer: false, // customer form
    customerType: "", // customer type
    customerName: "", // customer name
    search: "", // search field
    customerTypes: [
      { text: "موظف", value: 1 },
      { text: "اخر", value: 2 },
    ],
    rules: [(v) => !!v || "لا يمكنك ترك الحقل فارغ"],
    headers: [
      { text: "الاسم", value: "name" },
      { text: "العنوان", value: "address" },
      { text: "الهاتف", value: "phone" },
      { text: "البريد الإلكتروني", value: "email" },
      { text: "المدينة", value: "city" },
      { text: "المنطقة", value: "area" },
      { text: "الحالة", value: "status" },
      { text: "الخيارات", value: "options" },
    ],
  }),

  computed: {
    customersCount() {
      return this.customers.length;
    },

    filterdCustomers() {
      return this.customers.filter((cus) => {
        return cus.customerName
          .toLowerCase()
          .includes(this.search.toLowerCase());
      });
    },
  },

  mounted() {
    this.getCustomer();
  },

  methods: {
    async createCustomer() {
      try {
        if (this.$refs.newCustomer.validate()) {
          const customer = {
            customerName: this.customerName,
            customerType: this.customerType,
          };

          await CreateCustomer(customer);

          this.$toasted.success("تمت إضافة العميل بنجاح", {
            position: "top-center",
            duration: 5000,
          });

          this.$refs.newCustomer.reset();
          this.getCustomer();
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getCustomer() {
      try {
        const response = await GetCustomers();
        this.customers = response;
      } catch (error) {
        console.log(error);
      }
    },

    openProfile(customer) {
      this.$router.push({
        name: "customer-profile",
        params: {
          id: customer.customerId,
          name: customer.customerName,
          theCustomer: customer,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.border_bottom {
  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>