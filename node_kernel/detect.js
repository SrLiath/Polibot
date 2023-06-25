const http = require('http');
const { spawn } = require('child_process');
const { MongoClient } = require('mongodb');
const keypress = require('keypress');
const fs = require('fs');

const url = 'mongodb://fastmongoadmin:T5r4e3t5r4e3MoNg0F4@localhost:27017/';
const dbName = 'polibot';
const collectionName = 'user';
//espera 0.1 segs
function wait() {
  return new Promise(resolve => {
    setTimeout(resolve, 100);
  });
}

//insere os dados no mongo
async function insertFileContent(filePath, fileContent) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne({ content: fileContent });
    console.log(`${result.insertedCount} documento(s) inserido(s) com sucesso`);
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  } finally {
    await client.close();
    console.log('Conexão encerrada');
  }
}

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

      // flags para passar ao executável
      const args = ['-n', texto];

      // Executando o executável com os argumentos usando spawn
      const processo = spawn(caminhoExecutavel, args);

      // Aguardar o usuário pressionar a tecla "Esc"
      keypress(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('keypress', (ch, key) => {
        if (key && key.name === 'escape') {
          wait();
          const filePath = './json_bots/' + texto + '.json';
          const fileContent = fs.readFileSync(filePath, 'utf8');
          insertFileContent(filePath, fileContent);

          process.stdin.pause();
        }
      });
    });
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});
