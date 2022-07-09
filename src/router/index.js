import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import TransactionView from "../views/TransactionView.vue";
import CustomersView from "../views/CustomersView.vue";
import AccountsView from "../views/AccountsView.vue";
import CustomerProfile from "../views/CustomerProfile.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/transaction",
    name: "transaction",
    component: TransactionView,
  },
  {
    path: "/customers",
    name: "customers",
    component: CustomersView,
  },
  {
    path: "/accounts",
    name: "accounts",
    component: AccountsView,
  },
  {
    path: "/customer/:id",
    name: "customer-profile",
    component: CustomerProfile,
  }
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
