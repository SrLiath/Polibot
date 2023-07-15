"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var { spawn } = require('child_process');

var server = http.createServer(function (req, res) {
  if (req.method === 'POST') {
    var data = '';
    req.on('data', function (chunk) {
      data += chunk;
    });

    req.on('end', function () {
      var parsedData = JSON.parse(data);
      var texto = parsedData.data?.texto;
      res.end(texto || '');
      console.log(texto);

      // Caminho para o executável que deseja executar
      var caminhoExecutavel = 'exe/detect.exe';

      // Argumentos para passar ao executável
      var args = ['-n', texto];

      // Executando o executável com os argumentos usando spawn
      var processo = spawn(caminhoExecutavel, args);
    });
  }
});

var port = 3000;
server.listen(port, function () {
  console.log("Servidor escutando na porta " + port);
});
