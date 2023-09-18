"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const ipcMain = require('electron').ipcMain;
let win; 


function createWindow() {
  win = new electron_1.BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });
  // win.webContents.openDevTools();

  win.loadFile('./windows/index.html');
  ipcMain.on('minimize-window', () => {
    win.minimize()
  })

}

electron_1.app.whenReady().then(function () {
  createWindow();

  electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

electron_1.app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    electron_1.app.quit();
  }
});

