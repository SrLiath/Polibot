function check() {
    try {
        window.pywebview.api.confirm()
        window.pywebview.api.ready()
    } catch (error) {
        console.error("Erro ao minimizar:", error)
        location.reload()
    }
}

check()

function convertKey(key) {
    // Remove os espaços em branco e converte para letras minúsculas
    const cleanedKey = key.replace(/\s/g, '').replace(/\\/g, '').toLowerCase();
    console.log('cleanedKey:', cleanedKey);

    const controleHex = {
        'a': 'x01',
        'b': 'x02',
        'c': 'x03',
        'd': 'x04',
        'e': 'x05',
        'f': 'x06',
        'g': 'x07',
        'h': 'x08',
        'i': 'x09',
        'j': 'x0a',
        'k': 'x0b',
        'l': 'x0c',
        'm': 'x0d',
        'n': 'x0e',
        'o': 'x0f',
        'p': 'x10',
        'q': 'x11',
        'r': 'x12',
        's': 'x13',
        't': 'x14',
        'u': 'x15',
        'v': 'x16',
        'w': 'x17',
        'x': 'x18',
        'y': 'x19',
        'z': 'x1a'
    };

    const hexToLetter = {};
    for (let letter in controleHex) {
        hexToLetter[controleHex[letter]] = letter;
    }
    const final = hexToLetter[cleanedKey] ? "CTRL + " + hexToLetter[cleanedKey].toUpperCase() : undefined
    return final || key;
}

window.receiveData = function (data) {
    const listbots = document.getElementById('listBots')
    const atalhoNomeBot = document.getElementById('atalhoNomeBot')
    atalhoNomeBot.value = '' //limpar o input apos criar o bot
    listbots.innerHTML = ''

    data = data.replace(/\\/g, '\\\\')

    var bots = JSON.parse(data)
    bots.forEach(function (bot) {
        var row = document.createElement('tr')
        var nameCell = document.createElement('td')
        nameCell.textContent = bot.botname
        var callCell = document.createElement('td')
        callCell.textContent = bot.call.voice || convertKey(bot.call.key)



        //botao excluir
        var buttonExcluir = document.createElement('button')
        buttonExcluir.classList.add('btn')
        var excluirBot = document.createElement('td')
        var tagI = document.createElement('i')
        tagI.classList.add('fa', 'fa-trash')

        buttonExcluir.addEventListener('click', () => {

            Swal.fire({
                title: `Você tem certeza que deseja deletar o arquivo ${bot['botname']}?`,
                text: "Não será possível restaurar o arquivo!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim, deletar!"
            }).then((result) => {
                if (result.isConfirmed) {
                    if (window.pywebview.api.apagarBot(bot['path'], bot['botname'])) {
                        Swal.fire({
                            title: "Deletado com sucesso!",
                            text: `O arquivo ${bot['botname']} foi deletado!`,
                            icon: "success"
                        });
                    }

                }
            });
        })

        buttonExcluir.appendChild(tagI)
        excluirBot.appendChild(buttonExcluir)

        //botao excluir


        row.appendChild(nameCell)
        row.appendChild(callCell)
        row.appendChild(excluirBot)

        listbots.appendChild(row)
    })

    // Esconde o elemento de carregamento
    document.getElementById('loading').style.display = 'none'
}

document.getElementById('close-btn').addEventListener('click', function () {
    window.pywebview.api.close()
})

document.getElementById('minimize-btn').addEventListener('click', function () {
    window.pywebview.api.minimize()
})

document.getElementById('expand-btn').addEventListener('click', function () {
    window.pywebview.api.fullscreen()
})

const displayCountdown = count => {
    var countdownElement = $('<div>', {
        class: 'countdown',
        text: count
    }).css({
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 99999999999,
        fontSize: '48px',
        color: 'red',
        backgroundColor: 'transparent',
        textAlign: 'center',
        borderRadius: '10px',
        textAlign: 'center'
    })
    $('body').append(countdownElement)
    setTimeout(function () {
        countdownElement.remove()
    }, 1000)
}

let countdownInterval;

function gravarBot() {
    let countdown = 3;
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    countdownInterval = setInterval(() => {
        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownSound.play();
            iniciarBot();
        } else {
            displayCountdown(countdown);
            countdown--;
        }
    }, 1000);
}


function iniciarBot() {
    const opcao = document.getElementById("opcao")
    let headers = null
    const atalhoNomeBot = document.getElementById('atalhoNomeBot').value
    const atalhoChamada = document.getElementById('atalhoChamada').value

    function converterAtalhoParaControle(atalho) {
        const controleHex = {
            'a': '\\x01',
            'b': '\\x02',
            'c': '\\x03',
            'd': '\\x04',
            'e': '\\x05',
            'f': '\\x06',
            'g': '\\x07',
            'h': '\\x08',
            'i': '\\t',
            'j': '\\n',
            'k': '\\x0b',
            'l': '\\x0c',
            'm': '\\r',
            'n': '\\x0e',
            'o': '\\x0f',
            'p': '\\x10',
            'q': '\\x11',
            'r': '\\x12',
            's': '\\x13',
            't': '\\x14',
            'u': '\\x15',
            'v': '\\x16',
            'w': '\\x17',
            'x': '\\x18',
            'y': '\\x19',
            'z': '\\x1a'
        }

        if (atalho.startsWith("CTRL+")) {
            const char = atalho.split('+')[1].toLowerCase()
            return controleHex[char] || null
        }

        return null
    }

    const caractereDeControle = converterAtalhoParaControle(atalhoChamada)
    const vozNomeBot = document.getElementById('vozNomeBot').value
    const vozChamada = document.getElementById('vozChamada').value

    if (opcao.value == 'op1') {
        headers = {
            "Option": 0,
            "Name": atalhoNomeBot,
            "Key": caractereDeControle
        }
    } else if (opcao.value == 'op2') {
        headers = {
            "Option": 1,
            "Name": vozNomeBot,
            "Voice": vozChamada
        }
    }

    window.pywebview.api.detect(headers)
    window.pywebview.api.minimize()
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
  
    if(telaSelecionada.id === 'tela1'){
      telaSelecionada.children[2].children[0].classList.remove('d-none')
      telaSelecionada.children[2].children[0].children[0].classList.remove('d-none')
    }
  
  
    for (let i = 0; i < telaSelecionada.children[1].children[0].children.length; i++) {
      telaSelecionada.children[1].children[0].children[i].classList.remove('d-none')
    }
  
    for (let i = 0; i < telaSelecionada.children.length; i++) {
      if (telaSelecionada.children[i].tagName == 'DIV') {
        telaSelecionada.children[i].classList.remove('d-none')
      }
    }
  }
  
  function openModal() { //chama no html
    const submitBtn = document.getElementById("submitBtn");
    const closeModalBtn = document.getElementById("closeModalBtn")
    modal.style.display = "flex";
  
    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    submitBtn.addEventListener("click", (e) => {
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
  
  