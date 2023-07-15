var isFullscreen = false;
var fullscreenIcon = document.getElementById('fullscreen-icon');
var modal = document.getElementById("modal");

function getValueInputs() {
  var nome = document.getElementById("nome");
  var valor = nome.value;
  console.log("Valor do input:", valor);

  var selectElement = document.getElementById("teclas");
  var selectedValue = selectElement.value;
  console.log("Opção selecionada:", selectedValue);
};



function openModal() {
  modal.classList.remove('d-none');

  var modalContent = document.querySelector('#modal-content');
  modalContent.classList.remove('d-none');

  modal.style.display = "flex";
}

function confirmModal() {
  modal.style.display = "none";
  getValueInputs();
  gravarBot();
}

function closeModal() {
  modal.style.display = "none";
}

function gravarBot() {
    var countdown = 3;
    var countdownInterval = setInterval(function() {
      if (countdown === 0) {
          //aqui fica pra fazer a conexão com o arquivo no nodekernel chamado detect
        clearInterval(countdownInterval);
        playCountdownSound();
        
      } else {
        displayCountdown(countdown);
        countdown--;
      }
    }, 1000);
}

function displayCountdown(count) {
    var countdownElement = $('<div>', {
        class: 'countdown',
        text: count
    });
    $('body').append(countdownElement);
    setTimeout(function() {
        countdownElement.remove();
    }, 1000);
}

function playCountdownSound() {
    var sound = document.getElementById('countdownSound');
    sound.play();
}

function abrirTela(tela) {
    // Esconder todas as telas
    var telas = document.querySelectorAll('.content div');
    telas.forEach(e => e.classList.add('d-none'));
    // Mostrar a tela selecionada
    var telaSelecionada = document.getElementById(tela);
    telaSelecionada.classList.remove('d-none');
}

function alternarFullscreen() {
    if (isFullscreen) sairFullscreen();
    else entrarFullscreen();
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

