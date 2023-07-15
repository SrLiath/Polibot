"use strict";
(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var child_process_1 = require("child_process");
var backgroundProcess;
function startBackgroundProcess() {
    backgroundProcess = (0, child_process_1.spawn)('nodemon', ['node_kernel/detect.js']);
    backgroundProcess.stdout.on('data', function (data) {
        // Lida com os dados de saída do processo em segundo plano, se necessário
        console.log("Sa\u00EDda do processo em segundo plano: ".concat(data));
    });
    backgroundProcess.stderr.on('data', function (data) {
        // Lida com os erros do processo em segundo plano, se necessário
        console.error("Erro no processo em segundo plano: ".concat(data));
    });
    backgroundProcess.on('close', function (code) {
        // O processo em segundo plano foi fechado
        console.log("O processo em segundo plano foi fechado com c\u00F3digo de sa\u00EDda ".concat(code));
        // Reinicia o processo em segundo plano após um pequeno atraso 
        setTimeout(startBackgroundProcess, 1000);
    });
}
function createWindow() {
    var win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './windows/assets/js/preload.js')
        }
    });
    win.loadFile('./windows/index.html');
    // win.webContents.openDevTools();
}
startBackgroundProcess();
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
