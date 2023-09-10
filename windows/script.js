let isFullscreen = false;
let fullscreenIcon = document.getElementById('fullscreen-icon');

function gravarBot() {
  let countdown = 3;
  let countdownInterval = setInterval(function() {
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
  let telas = document.querySelectorAll('.content div');
  telas.forEach(element => {
    element.classList.add('d-none');
  });

  // Mostrar a tela selecionada
  let telaSelecionada = document.getElementById(tela);
  telaSelecionada.classList.remove('d-none');

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