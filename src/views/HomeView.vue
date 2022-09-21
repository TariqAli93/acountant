<template>
  <div class="page--home">
    <v-card elevation="1">
      <v-toolbar color="primary" dense flat elevation="0">
        <v-toolbar-title style="width: 120px">الصندوق</v-toolbar-title>

        <v-spacer />

        <v-tabs v-model="accountTab" id="accountTab" color="secondary" right>
          <v-tab href="#tab1">
            <v-icon class="ml-4">credit_card</v-icon>
            <span>سحب</span>
          </v-tab>

          <v-tab href="#tab2">
            <v-icon class="ml-4">account_balance_wallet</v-icon>
            <span>ايداع</span>
          </v-tab>
        </v-tabs>

        <v-divider vertical class="mr-5" />

        <v-chip color="primary" light id="balanceText">
          <v-select
            v-model="account"
            label="الحساب"
            :items="accounts"
            dense
            eager
            flat
            color="secondary"
            item-color="secondary"
            item-text="accountName"
            item-value="accountId"
            hide-details
            return-object
            @change="selectAccount"
          ></v-select>
          <span class="secondary--text">الرصيد:</span>
          <span class="secondary--text">{{ balanceAmount }}</span>
        </v-chip>
      </v-toolbar>

      <v-divider />

      <v-tabs-items v-model="accountTab">
        <v-tab-item value="tab1" transition="fade-transition">
          <v-card flat>
            <withdraw />
          </v-card>
        </v-tab-item>

        <v-tab-item value="tab2" transition="fade-transition">
          <v-card flat>
            <deposit />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import withdraw from "@/components/account/withdraw.vue";
import deposit from "@/components/account/deposit.vue";
import { GetAccount } from "@/api/accounts.js";
import { bus } from "@/plugins/bus.js";
export default {
  data: () => ({
    accountTab: null,
    balance: 0,
    accounts: [],
    account: null,
  }),

  components: {
    withdraw,
    deposit,
  },

  computed: {
    balanceAmount() {
      return this.$store.getters.getSelectedAccount
        ? Math.floor(this.$store.getters.getSelectedAccount.amount)
        : 0;
    },
  },

  mounted() {
    bus.$on("withdraw", async () => {
      GetAccount().then((res) => {
        const oldAccount = this.account;
        const newAccount = res.filter((account) => {
          return account.accountId == oldAccount.accountId;
        });

        localStorage.removeItem("selectedAccount");
        this.$store.dispatch("setSelectedAccount", newAccount[0]);
      });
    });

    bus.$on("deposit", async () => {
      GetAccount().then((res) => {
        const oldAccount = this.account;
        const newAccount = res.filter((account) => {
          return account.accountId == oldAccount.accountId;
        });

        localStorage.removeItem("selectedAccount");
        this.$store.dispatch("setSelectedAccount", newAccount[0]);
      });
    });

    this.getAccounts();
    this.account = this.$store.getters.getSelectedAccount || 0;
  },

  methods: {
    async getAccounts() {
      try {
        const account = await GetAccount();
        this.accounts = account;
      } catch (error) {
        console.error(error);
      }
    },

    selectAccount(account) {
      this.getAccounts();
      this.$store.dispatch("setSelectedAccount", account);
    },
  },
};
</script>

<style lang="scss">
#accountTab {
  width: 270px;
}

#balanceText {
  font-size: 1rem;
  font-weight: bolder;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  padding: 0 10px !important;
  width: fit-content;

  .v-chip__content {
    padding-block: 10px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100%;

    & > span {
      margin-inline: 5px !important;
    }
  }
}
</style>