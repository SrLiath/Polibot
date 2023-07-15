"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
function createWindow() {
<<<<<<< HEAD
    var win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './windows/preload.js')
        }
    });
    win.loadFile('./windows/index.html');
    // win.webContents.openDevTools();
=======
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, //remove border
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('windows/main.html');
>>>>>>> parent of 636fe55 (Merge branch 'main' of https://github.com/SrLiath/Polibot)
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
<<<<<<< HEAD
=======

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
>>>>>>> parent of 636fe55 (Merge branch 'main' of https://github.com/SrLiath/Polibot)
