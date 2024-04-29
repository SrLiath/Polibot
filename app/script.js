const { ipcRenderer } = require('electron');
const fs = require('fs');
const iohook = require('iohook')
const { exec } = require('child_process');
const path = require('path')
var isFullscreen = false;
var fullscreenIcon = document.getElementById('fullscreen-icon');

function minimizar() {
  ipcRenderer.send('minimize-window');
}

function gravarBot() {
  let countdown = 3;

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

  const playCountdownSound = () => {
    var sound = document.getElementById('countdownSound');
    sound.play();
  }

  let countdownInterval = setInterval(() => {
    if (countdown === 0) {
      clearInterval(countdownInterval);
      playCountdownSound();
      iniciarBot()
    } else {
      displayCountdown(countdown);
      countdown--;
    }
  }, 1000);

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

function fecharJanela() {
  window.close();
}

function openModal() {
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

//função se clikar fora do modal o modal fecha
window.addEventListener('click', event => {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

function salvarEventos(eventos) {
  const atalhoNomeBot = document.getElementById('atalhoNomeBot').value
  const atalhoChamada = document.getElementById('atalhoChamada').value

  command = atalhoChamada.split('+')
  command[0] = command[0] === 'CTRL' ? '^' : '^'

  if (!fs.existsSync('bots/eventos.ahk'))fs.writeFileSync('bots/eventos.ahk', 
  command[0] + command[1] + '::\nSetKeyDelay, 80\nSetMouseDelay, 80\nCoordMode, Mouse, Screen\n\n');

  if(eventos.type == 'mouseclick'){
      button = eventos.button == 1 ? 'Left' : 'Right'
      fs.appendFileSync('bots/eventos.ahk', `${eventos.type}, ${button}, ${eventos.x}, ${eventos.y}\n`);
  }

  if(eventos.type == 'keydown'){


    fs.readFile('hotkeys.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
      }

      if(eventos.keycode == '1'){//se apertar o ESC para de detectar os eventos e cria o bot
        iohook.removeAllListeners()

        alert('Criado o bot! BASTA TECLAR CTRL+D PARA CHAMAR')

        exec("ahk2exe /in bots/eventos.ahk /out " + atalhoNomeBot + ".exe", () => {
          exec("cd bots && del eventos.ahk", () => {
            exec("cd bots && start " + atalhoNomeBot)
          })
        })
        
        
        
        return;
      }
      
      const json = JSON.parse(data);
      fs.appendFileSync('bots/eventos.ahk', `Send, ${json[eventos.keycode]}\n`);

      

    });
  }
}