<<<<<<< HEAD
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var child_process_1 = require("child_process");
var mongodb_1 = require("mongodb");
var keypress = require("keypress");
var fs = require("fs");
var url = 'mongodb://fastmongoadmin:T5r4e3t5r4e3MoNg0F4@localhost:27017/';
var dbName = 'polibot';
var collectionName = 'user';
// Espera 0.1 segundos
function wait() {
    return new Promise(function (resolve) {
        setTimeout(resolve, 100);
    });
}
// Insere os dados no MongoDB
function insertFileContent(filePath, fileContent) {
    return __awaiter(this, void 0, void 0, function () {
        var client, db, collection, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new mongodb_1.MongoClient(url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 7]);
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _a.sent();
                    db = client.db(dbName);
                    collection = db.collection(collectionName);
                    return [4 /*yield*/, collection.insertOne({ content: fileContent })];
                case 3:
                    result = _a.sent();
                    console.log("documento(s) inserido(s) com sucesso");
                    return [3 /*break*/, 7];
                case 4:
                    error_1 = _a.sent();
                    console.error('Ocorreu um erro:', error_1);
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, client.close()];
                case 6:
                    _a.sent();
                    console.log('Conexão encerrada');
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
=======
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

<<<<<<< HEAD
>>>>>>> parent of 012d158 (	modified:   node_kernel/detect.js)
=======
>>>>>>> parent of 012d158 (	modified:   node_kernel/detect.js)
    });
}
var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var data_1 = '';
        req.on('data', function (chunk) {
            data_1 += chunk;
        });
        req.on('end', function () {
            var _a;
            var parsedData = JSON.parse(data_1);
            var texto = (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.texto;
            res.end(texto || '');
            console.log(texto);
            // Caminho para o executável que deseja executar
            var caminhoExecutavel = 'exe/detect.exe';
            // Flags para passar ao executável
            var args = ['-n', texto];
            // Executando o executável com os argumentos usando spawn
            var processo = (0, child_process_1.spawn)(caminhoExecutavel, args);
            // Aguardar o usuário pressionar a tecla "Esc"
            keypress(process.stdin);
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('keypress', function (ch, key) {
                if (key && key.name === 'escape') {
                    wait();
                    var filePath = './json_bots/' + texto + '.json';
                    var fileContent = fs.readFileSync(filePath, 'utf8');
                    insertFileContent(filePath, fileContent);
                    process.stdin.pause();
                }
            });
        });
    }
});
var port = 3000;
server.listen(port, function () {
    console.log("Servidor escutando na porta ".concat(port));
});
