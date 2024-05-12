const { ipcRenderer } = require('electron');
const fs = require('fs')
const fsPromise = require('fs').promises;
const iohook = require('iohook')
const { exec } = require('child_process');
const path = require('path')
var isFullscreen = false;
var fullscreenIcon = document.getElementById('fullscreen-icon');

function minimizar() {
  ipcRenderer.send('minimize-window');
}

document.addEventListener('DOMContentLoaded', function() {
  function updateBotList() {
      const botList = $('#listBots');
      let arquivos = listarArquivosEmPasta('bots')
      botList.empty(); // Clear existing content

      arquivos.forEach((arquivo) => {
        const nome = path.parse(arquivo).name 
        const atalho = fs.readFileSync(`bots/${arquivo}`, 'utf8').split('\n')[0].substring(1);
        const row = $('<tr>');
        row.html(`
          <td class="text-center">${nome}</td>
          <td class="text-center">${atalho}</td>
        `);

        botList.append(row);
      });
  }

  setInterval(updateBotList, 5000);
  updateBotList()


});



function listarArquivosEmPasta(pasta) {
  try {
    const arquivos = fs.readdirSync(pasta);
    return arquivos
  } catch (err) {
    console.error('Erro ao listar os arquivos:', err);
  }
}



function gravarBot() {
  let countdown = 3;

  let countdownInterval = setInterval(() => {
    if (countdown === 0) {
      clearInterval(countdownInterval);
      countdownSound.play()
      iniciarBot()
    } else {
      displayCountdown(countdown);
      countdown--;
    }
  }, 1000);

}

const displayCountdown = count => {
  var countdownElement = $('<div>', {
    class: 'countdown',
    text: count
  });
  $('body').append(countdownElement);
  setTimeout(function () {
    countdownElement.remove();
  }, 1000);
}

function iniciarBot() {
  minimizar()

  iohook.start();

  iohook.on('mouseclick', event => {
    salvarEventos(event)
  });

  iohook.on('keydown', event => {
    salvarEventos(event)
  });
}

function abrirTela(tela) {
  // Esconder todas as telas
  let telas = document.querySelectorAll('.content div');
  telas.forEach(element => {
    element.classList.add('d-none');
  });

  // Mostrar a tela selecionada
  let telaSelecionada = document.getElementById(tela);
  telaSelecionada.classList.remove('d-none');

  telaSelecionada.children[1].children[0].classList.remove('d-none')

  console.log(telaSelecionada)


  for (let i = 0; i < telaSelecionada.children[1].children[0].children.length; i++) {
    telaSelecionada.children[1].children[0].children[i].classList.remove('d-none')
  }

  for (let i = 0; i < telaSelecionada.children.length; i++) {
    if (telaSelecionada.children[i].tagName == 'DIV') {
      telaSelecionada.children[i].classList.remove('d-none')
    }
  }
}

function alternarFullscreen() {
  if (isFullscreen) {
    sairFullscreen();
  } else {
    entrarFullscreen();
  }
}

function entrarFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }

  isFullscreen = true;
}

function sairFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }

  isFullscreen = false;
}

function fecharJanela() { //chama no html
  window.close();
}

function openModal() { //chama no html
  const submitBtn = document.getElementById("submitBtn");
  const closeModalBtn = document.getElementById("closeModalBtn")
  modal.style.display = "flex";

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  submitBtn.addEventListener("click", () => {
    modal.style.display = "none";
    gravarBot()
  })

  opcao.addEventListener('change', () => {
    var allDivs = document.querySelectorAll('.selected');
    allDivs.forEach(div => div.style.display = 'none');
    document.getElementById(opcao.value).style.display = 'block';
  });

}

//evento se clikar fora do modal o modal fecha
window.addEventListener('click', event => {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

async function salvarEventos(eventos) {
  var atalhoNomeBot = document.getElementById('atalhoNomeBot')
  var atalhoChamada = document.getElementById('atalhoChamada').value

  command = atalhoChamada.split('+')
  command[0] = command[0] === 'CTRL' ? '^' : '^'

  if (!fs.existsSync('bots')) fs.mkdirSync('bots');
  if (!fs.existsSync(`bots/${atalhoNomeBot.value}.ahk`)) fs.writeFileSync(`bots/${atalhoNomeBot.value}.ahk`, `;${atalhoChamada}\n` + command[0] + command[1] + '::\nSetKeyDelay, 100\nSetMouseDelay, 40\nCoordMode, Mouse, Screen\n\n');

  switch (eventos.type) {
    case 'mouseclick':
      button = eventos.button == 1 ? 'Left' : 'Right'
      fs.appendFileSync(`bots/${atalhoNomeBot.value}.ahk`, `${eventos.type}, ${button}, ${eventos.x}, ${eventos.y}\n`);
      fs.appendFileSync(`bots/${atalhoNomeBot.value}.ahk`, `Sleep, 1000\n`);
      break;
    case 'keydown':
      if (eventos.keycode == '1') {//se apertar o ESC para de detectar os eventos e cria o bot
        iohook.removeAllListeners()
        alert(`Criado o bot! BASTA TECLAR ${atalhoChamada} PARA CHAMAR`)
        atalhoNomeBot.value = ''
        return;
      }

      data = await lerArquivoJSON('hotkeys.json')
      fs.appendFileSync(`bots/${atalhoNomeBot.value}.ahk`, `Send, ${data[eventos.keycode]}\n`);
      break;
    default:
      "botao nao reconhecido"
      break;
  }

  async function lerArquivoJSON(arquivo) {
    try {
      const data = await fsPromise.readFile(arquivo, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Erro ao ler o arquivo:', err);
      throw err;
    }
  }

}

