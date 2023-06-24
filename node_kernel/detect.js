const http = require('http');
const { spawn } = require('child_process');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      const parsedData = JSON.parse(data);
      const texto = parsedData.data?.texto;
      res.end(texto || '');
      console.log(texto);
      // Caminho para o executável que deseja executar
const caminhoExecutavel = 'exe/detect.exe';

// Argumentos para passar ao executável
const args = ['-n', texto];

// Executando o executável com os argumentos usando spawn
const processo = spawn(caminhoExecutavel, args);

    });
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});
