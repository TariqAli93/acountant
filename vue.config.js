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
        extraResources: ['./src/accountant.db', './node_modules/roboto-fontface/*', './node_modules/material-design-icons-iconfont/dist/*'],
        publish: ['github'],

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
