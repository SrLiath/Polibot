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
                        Click | X: ${data[i].x}, Y: ${data[i].y}
                        <div>
                            <button class="btn btn-success" onclick="editClick('${i}', '${botname}')"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-danger" onclick="remove('${i}', '${botname}')"><i class="fa fa-trash"></i></button>
                        </div>
                    </li>
                `);
                break;
            case 'keypress':
                $('#list').append(`
                    <li style="display: flex; justify-content: space-between; align-items: center;">
                        Tecla | ${data[i].key}
                        <div>
                            <button class="btn btn-success" onclick="editTecla('${i}', '${botname}')"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-danger" onclick="remove('${i}', '${botname}')"><i class="fa fa-trash"></i></button>
                        </div>
                    </li>
                `);
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