let isFullscreen = false;
let fullscreenIcon = document.getElementById('fullscreen-icon');
const fs = require('fs');
const { ipcRenderer } = require('electron');
const $ = require('jquery'); 

function minimizar(){
  ipcRenderer.send('minimize-window');
}
$(document).ready(function () {
$.getJSON('../json_bots/bots.json', function(bots) {
  const botList = $('#listBots');

  bots.forEach((bot) => {
    const row = $('<tr>');
    const call = bot.call.key ? bot.call.key : bot.call.voice;
    const botname = bot.botname;
    row.html(`
      <td class="text-center">${botname}</td>
      <td class="text-center">${call}</td>
      <td class="text-center"><i class="fa fa-x" onclick="del(${bot.path})"></i></td>
    `);

    botList.append(row);
  });
});
});


function gravarBot() {
  let countdown = 3;

  const displayCountdown = (count) =>  {
    var countdownElement = $('<div>', {
      class: 'countdown',
      text: count
    });
    $('body').append(countdownElement);
    setTimeout(function() {
      countdownElement.remove();
    }, 1000);
  }
  
  const playCountdownSound = () => {
    var sound = document.getElementById('countdownSound');
    sound.play();
  }

  let countdownInterval = setInterval(function() {
    if (countdown === 0) {
        //aqui fica pra fazer a conexão com o arquivo no nodekernel chamado detect
      clearInterval(countdownInterval);
      playCountdownSound();
      iniciarBot()
    } else {
      displayCountdown(countdown);
      countdown--;
    }
  }, 1000);

  function iniciarBot(){
    minimizar()

    const value1 = document.getElementById("input1")

    const headers = new Headers({
      "Option": "gravar",
      "Name": value1.value,
      "Key": value1.value
    });

    const requestOptions = {
      method: 'GET',
      headers: headers
    };

    fetch('http://localhost:3452', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
      return response.json();
      })

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

  for (let i = 0; i < telaSelecionada.children[1].children[0].children.length; i++) {
    telaSelecionada.children[1].children[0].children[i].classList.remove('d-none')
  }
  
  for (let i = 0; i < telaSelecionada.children.length; i++) {
    if(telaSelecionada.children[i].tagName == 'DIV'){
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
  fullscreenIcon.classList.remove('fa-expand');
  fullscreenIcon.classList.add('fa-compress');
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
  fullscreenIcon.classList.remove('fa-compress');
  fullscreenIcon.classList.add('fa-expand');
}

function fecharJanela() {
  window.close();
}

function openModal(){
  const modal = document.getElementById("modal");
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
}
