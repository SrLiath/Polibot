var i,
    botname

function editClick(Newi, Newbotname) {
    i = Newi
    botname = Newbotname
    $('#editClick').modal('show');

}

function editTecla(Newi, Newbotname) {
    i = Newi
    botname = Newbotname
    $('#editKey').modal('show');
}

$('.btn-close-list').click(function () {
    $('#editModal').modal('hide');
})

window.list = function (dataNoJson, botname) {
    $('#list').html('')
    $('.modal-loading').css('display', 'none')
    data = JSON.parse(dataNoJson)
    for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
        switch (data[i].type) {
            case 'click':
                $('#list').append(`
                    <li style="display: flex; justify-content: space-between; align-items: center;">
                        Click  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; x: ${data[i].x}, y: ${data[i].y}
                        <div>
                            <button class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Editar Comando" onclick="editClick('${i}', '${botname}')"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Apagar comando" onclick="remove('${i}', '${botname}')"><i class="fa fa-trash"></i></button>
                        </div>
                    </li>
                `);
            // linha 33 tinha este conteudo, apenas para deixar gravado caso precise, <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Clique para adicionar 1 segundo após a execução deste comando" onclick="addTime('${i}', '${botname}')"><i class="fa fa-plus"></i></button>

                break;
            case 'keypress':
                $('#list').append(`
                    <li style="display: flex; justify-content: space-between; align-items: center;">
                        Tecla  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${data[i].key}
                        <div>
                            <button class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Editar comando" onclick="editTecla('${i}', '${botname}')"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Apagar comando" onclick="remove('${i}', '${botname}')"><i class="fa fa-trash"></i></button>
                        </div>
                    </li>
                `);
                // linha depois da 45 estava isso,                             <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Clique para adicionar 1 segundo para executar o próximo comando" onclick="addTime('${i}', '${botname}')"><i class="fa fa-plus"></i></button>
                break;
            default:
                break;
        }

    }
}



document.getElementById('key-selector').addEventListener('input', function (event) {
    var input = event.target;
    if (input.value.length > 1) {
        input.value = input.value.charAt(0);
    }
});