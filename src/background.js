"use strict";
import { app, protocol, BrowserWindow, globalShortcut, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
import exportdb from './api/exportdb';

import { autoUpdater } from "electron-updater"
import log from 'electron-log'

log.transports.file.level = "debug"
autoUpdater.logger = log

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: false, standard: true, stream: true } },
]);

let win;
let splash;


async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 800,
    minWidth: 700,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
    },
  });

  win.setMenu(null);
  win.setTitle('برنامج امين الصندوق')
  win.setIcon(__static + '/icons/icon.ico')
  win.maximize();

  win.on('maximize', () => {
    win.webContents.send('maximize', true)
  })

  win.on('unmaximize', () => {
    win.webContents.send('maximize', false)
  })

  ipcMain.on('maximize', () => {
    win.maximize()
  });

  ipcMain.on('restore', () => {
    win.unmaximize()
  });

  ipcMain.on('minimize', () => {
    win.minimize()
  })

  ipcMain.on('quit', () => {
    const dialogOpts = {
      type: 'warning',
      buttons: ['إلغاء', 'خروج'],
      title: 'خروج',
      message: 'هل أنت متأكد من أنك تريد إغلاق البرنامج؟',
      detail: 'سيتم إغلاق البرنامج بعد الضغط على زر الخروج',
    }

    dialog.showMessageBox(dialogOpts).then(returnValue => {
      if (returnValue.response === 1) {
        app.quit()
      }
    });
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
    autoUpdater.checkForUpdatesAndNotify().then(() => {
      exportdb()
    }).catch((err) => {
      log.error(err);
    })
  }
}

async function createSplash() {
  splash = new BrowserWindow({
    width: 500,
    height: 300,
    show: true,
    frame: false,
    alwaysOnTop: true,
    center: true,
  })

  splash.loadURL(__static + '/splashscreen.html')
  splash.setMenu(null)
  splash.setTitle('برنامج امين الصندوق')
  splash.setIcon(__static + '/icons/icon.ico')
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});



app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }

  globalShortcut.register('CommandOrControl+Shift+X', () => {
    console.log('CommandOrControl+Shift+X is pressed')
    win.webContents.openDevTools()
  })


  createSplash()

  setTimeout(() => {
    createWindow()
    win.show()
    splash.close()
  }, 4500)

});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
