const { exec } = require('child_process');
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const MONGODB_URI = 'mongodb://localhost:27017'; 
const DATABASE_NAME = 'nome_do_banco'; 
const COLLECTION_NAME = 'nome_da_colecao'; 

app.post('/', async (req, res) => {
  const item = req.body.item;

  const filePath = __dirname + '/exe/detect.exe';
  const command = `"${filePath}" -n ${item}`;

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro  ${error.message}`);
      return res.status(500).send('Erro');
    }
    if (stderr) {
      console.error(`Erro ao executar o arquivo detect.exe: ${stderr}`);
      return res.status(500).send('Erro');
    }

    console.log(`Resultado: ${stdout}`);

    const jsonData = {
      item: item,
      output: stdout.trim()
    };

    try {
      const client = await MongoClient.connect(MONGODB_URI);
      const db = client.db(DATABASE_NAME);
      const collection = db.collection(COLLECTION_NAME);

      const result = await collection.insertOne(jsonData);
      console.log('Dados inseridos no MongoDB:', result.insertedId);

      res.status(200).send('Arquivo detect.exe executado e dados inseridos com sucesso.');
    } catch (error) {
      console.error('Erro ao inserir os dados no MongoDB:', error);
      res.status(500).send('Erro');
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
