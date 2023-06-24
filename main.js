const robot = require('robotjs');
const fs = require('fs-extra');

let commands = [];

function recordCommand() {
  const command = {
    mouse: robot.getMousePos(),
    keyboard: robot.keyToggle,
  };
  commands.push(command);
}

function saveCommandsToFile() {
  const fileName = 'bot.exe';
  fs.writeJSONSync(fileName, commands);
  console.log(`Comandos gravados no arquivo: ${fileName}`);
}

console.log('Gravador de comandos iniciado. Pressione Ctrl+C para parar.');

setInterval(recordCommand, 100); // Grava um comando a cada 100ms

process.on('SIGINT', () => {
  saveCommandsToFile();
  process.exit();
});
