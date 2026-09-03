let total = 0;
let itens = [];
let proximoId = 1;

document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    });
});

function mostrarCardapioCliente(){
    const tipo = document.getElementById("sim").checked;

    if(tipo){
        mostrarIngredientes();
    } else {
        mostrarCardapio();
    }
}

function mostrarIngredientes() {
    document.querySelector("#sessaoCardapio").style.display = "none";
    document.querySelector("#sessaoIngredientes").style.display = "block";
}

function mostrarCardapio() {
    document.querySelector("#sessaoIngredientes").style.display = "none";
    document.querySelector("#sessaoCardapio").style.display = "block";
}

function mostrarErro(mensagem) {
    const erro = document.querySelector("#mensagemErro");
    erro.textContent = mensagem;
    erro.hidden = false;
}

function limparErro() {
    const erro = document.querySelector("#mensagemErro");
    erro.hidden = true;
    erro.textContent = "";
}

function somaValor() {
    limparErro();

    const nomeCliente = document.querySelector("#name").value.trim();
    if (!nomeCliente) {
        mostrarErro("Digite o nome do cliente antes de adicionar o pedido.");
        return;
    }

    const personalizado = document.querySelector("#sim").checked;

    if (personalizado) {
        adicionarDogaoPersonalizado(nomeCliente);
    } else {
        adicionarDogaoCardapio(nomeCliente);
    }
}

function adicionarDogaoPersonalizado(nomeCliente) {
    const marcados = Array.from(document.querySelectorAll("#ingredientesCheckbox input[type=checkbox]:checked"));

    if (marcados.length === 0) {
        mostrarErro("Selecione pelo menos um ingrediente para o dogão personalizado.");
        return;
    }

    const observacoes = document.querySelector("#observacoes").value.trim();
    const precoTotal = marcados.reduce((soma, checkbox) => soma + Number(checkbox.value), 0);
    const listaIngredientes = marcados.map((checkbox) => checkbox.dataset.nome).join(", ");

    let descricao = "Dogão personalizado: " + listaIngredientes;
    if (observacoes) {
        descricao += " (" + observacoes + ")";
    }

    adicionarItem(nomeCliente, descricao, precoTotal);

    marcados.forEach((checkbox) => {
        checkbox.checked = false;
    });
    document.querySelector("#observacoes").value = "";
}

function adicionarDogaoCardapio(nomeCliente) {
    const marcados = Array.from(document.querySelectorAll("#cardapioCheckbox input[type=checkbox]:checked"));

    if (marcados.length === 0) {
        mostrarErro("Selecione pelo menos um item do cardápio.");
        return;
    }

    marcados.forEach((checkbox) => {
        const nomeItem = checkbox.closest("label").querySelector(".checkbox-nome").textContent;
        const descricao = nomeItem + " (" + checkbox.dataset.nome + ")";
        adicionarItem(nomeCliente, descricao, Number(checkbox.value));
        checkbox.checked = false;
    });
}

function adicionarItem(nomeCliente, descricao, preco) {
    const item = {
        id: proximoId++,
        cliente: nomeCliente,
        descricao: descricao,
        preco: preco,
    };
    itens.push(item);
    total += preco;
    renderizarItens();
}

function removerItem(id) {
    const item = itens.find((i) => i.id === id);
    if (!item) return;

    total -= item.preco;
    itens = itens.filter((i) => i.id !== id);
    renderizarItens();
}

function renderizarItens() {
    const lista = document.querySelector("#listaItens");
    lista.innerHTML = "";

    itens.forEach((item) => {
        const li = document.createElement("li");
        li.className = "item-pedido";

        const info = document.createElement("span");
        info.className = "item-info";
        info.innerHTML = "<b>" + item.cliente + "</b> — " + item.descricao +
            " <span class=\"item-preco\">R$ " + item.preco.toFixed(2) + "</span>";

        const removerBtn = document.createElement("button");
        removerBtn.type = "button";
        removerBtn.className = "item-remover";
        removerBtn.textContent = "Remover";
        removerBtn.onclick = () => removerItem(item.id);

        li.appendChild(info);
        li.appendChild(removerBtn);
        lista.appendChild(li);
    });

    document.querySelector("#total-valor > span").textContent = total.toFixed(2);
}