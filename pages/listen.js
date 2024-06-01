var Speech = require('electron-speech')
const listen = () => {
    console.log('aaaa')
    var recog = Speech({
        lang: 'pt-BR',
        continuous: true
    })

    recog.on('text', function (text) {
        console.log(text)
    });

    recog.listen()
}
module.exports = { listen }