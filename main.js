"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");

function createWindow() {
  var win = new electron_1.BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      // preload: path.join(__dirname, 'preload.js')
    }
  });
  // win.webContents.openDevTools();

  win.loadFile('./windows/index.html');
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
