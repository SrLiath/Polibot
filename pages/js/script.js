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

