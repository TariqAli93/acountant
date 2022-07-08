import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    selectedAccount: JSON.parse(localStorage.getItem("selectedAccount")) || null,
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    getUser: (state) => state.user,
    getSelectedAccount: (state) => state.selectedAccount,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setSelectedAccount(state, selectedAccount) {
      state.selectedAccount = selectedAccount;
    }
  },
  actions: {
    login({ commit }, user) {
      localStorage.setItem("user", JSON.stringify(user));
      commit("setUser", user);
    },
    logout({ commit }) {
      localStorage.removeItem("user");
      commit("setUser", null);
    },
    setSelectedAccount({ commit }, selectedAccount) {
      localStorage.setItem("selectedAccount", JSON.stringify(selectedAccount));
      commit("setSelectedAccount", selectedAccount);
    }
  },
  modules: {},
});
