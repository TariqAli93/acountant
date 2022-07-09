<template>
  <div class="custome-title d-flex" :class="{ 'no-transparent': isLoggedIn }">
    <div class="custome-title-icon d-flex">
      <img src="@/assets/icon.png" />
      <h1>{{ title }}</h1>
    </div>

    <v-spacer />

    <button class="control-button minimize" @click="minimize">
      <div class="codicon codicon-chrome-minimize"></div>
    </button>

    <button class="control-button maximize" @click="maximizeOrRestore">
      <div class="codicon codicon-chrome-restore" v-if="isMaximized"></div>
      <div class="codicon codicon-chrome-maximize" v-else></div>
    </button>

    <button class="control-button close" @click="quitApp">
      <div class="codicon codicon-chrome-close"></div>
    </button>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data: () => ({
    title: "برنامج امين الصندوق",
    isMaximized: true,
  }),

  mounted() {
    ipcRenderer.on("maximize", (event, arg) => {
      this.isMaximized = arg;
    });
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },

  methods: {
    minimize() {
      ipcRenderer.send("minimize");
    },

    maximizeOrRestore() {
      if (this.isMaximized) {
        ipcRenderer.send("restore");
      } else {
        ipcRenderer.send("maximize");
      }
    },

    quitApp() {
      ipcRenderer.send("quit");
    },
  },
};
</script>

<style lang="scss">
@import url("../../../node_modules/@vscode/codicons/dist/codicon.css");
.custome-title {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0px 0px 15px;
  background-color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  -webkit-app-region: drag;

  &.no-transparent {
    background-color: #fff;
  }

  .custome-title-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    h1 {
      font-size: 0.5rem;
      font-weight: bold;
      color: #000;
    }

    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }

  .control-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    padding: 0;
    margin-inline: 10px;
    cursor: pointer;
    -webkit-app-region: no-drag;
    width: 30px;
    height: 30px;
  }
}
</style>