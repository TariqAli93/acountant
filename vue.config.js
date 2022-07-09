const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
});


module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      nodeModulesPath: ['./node_modules', '../node_modules', '../../node_modules'],
      externals: ['pg', 'sqlite3', 'tedious', 'pg-hstore', 'better-sqlite3'],
      customFileProtocol: './',
      builderOptions: {
        appId: "com.codel.accountant",
        productName: "برنامج امين الصندوق",
        extraResources: ['./src/accountant.db', './node_modules/roboto-fontface/*', './node_modules/material-design-icons-iconfont/dist/*', './node_modules/@vscode/codicons/dist/*'],
        publish: {
          provider: "github",
          owner: "TariqAli93",
          repo: "acountant",
          token: "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",
          releaseType: "release",
        },

        win: {
          target: 'nsis',
          icon: './public/icon.ico',
        },
        nsis: {
          oneClick: false,
          artifactName: "accountant.exe",
          allowElevation: false,
          deleteAppDataOnUninstall: true,
          runAfterFinish: true,
          allowToChangeInstallationDirectory: true,
          installerIcon: "./public/icons/icon.ico",
          uninstallerIcon: "./public/icons/edit_delete.ico",
          installerHeaderIcon: "./public/icons/icon.ico",
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "برنامج امين الصندوق",
          perMachine: false,
        },
      }
    }
  },

  transpileDependencies: [
    'vuetify'
  ]
}
