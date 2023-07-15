import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { spawn } from 'child_process';

let backgroundProcess;

function startBackgroundProcess() {
  backgroundProcess = spawn('nodemon', ['node_kernel/detect.js']);

  backgroundProcess.stdout.on('data', (data) => {
    // Lida com os dados de saída do processo em segundo plano, se necessário
    console.log(`Saída do processo em segundo plano: ${data}`);
  });

  backgroundProcess.stderr.on('data', (data) => {
    // Lida com os erros do processo em segundo plano, se necessário
    console.error(`Erro no processo em segundo plano: ${data}`);
  });

  backgroundProcess.on('close', (code) => {
    // O processo em segundo plano foi fechado
    console.log(`O processo em segundo plano foi fechado com código de saída ${code}`);
    // Reinicia o processo em segundo plano após um pequeno atraso 
    setTimeout(startBackgroundProcess, 1000);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // remove border
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './windows/assets/js/preload.js')
    }
  });

  win.loadFile('./windows/index.html');

  // win.webContents.openDevTools();
}
startBackgroundProcess();

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
