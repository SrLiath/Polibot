const { app, BrowserWindow } = require('electron/main')
const ipcMain  = require('electron').ipcMain;
let win



app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  app.allowRendererProcessReuse = false

  win.webContents.openDevTools();
  win.loadFile('app/index.html')

  ipcMain.on('minimize-window', () => {
    win.minimize()
  })
  
})