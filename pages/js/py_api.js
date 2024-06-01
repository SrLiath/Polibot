document.getElementById('close-btn').addEventListener('click', function () {
    window.pywebview.api.close();

});

document.getElementById('minimize-btn').addEventListener('click', function () {
    window.pywebview.api.minimize();
});

document.getElementById('expand-btn').addEventListener('click', function () {
    window.pywebview.api.fullscreen();
});

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
    });
    $('body').append(countdownElement);
    setTimeout(function () {
        countdownElement.remove();
    }, 1000);
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


function iniciarBot() {
    const opcao = document.getElementById("opcao");
    let headers = null
    const atalhoNomeBot = document.getElementById('atalhoNomeBot').value
    const atalhoChamada = document.getElementById('atalhoChamada').value;

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
        };

        if (atalho.startsWith("CTRL+")) {
            const char = atalho.split('+')[1].toLowerCase();
            return controleHex[char] || null;
        }

        return null;
    }

    const caractereDeControle = converterAtalhoParaControle(atalhoChamada);
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
    window.pywebview.api.minimize();
}

