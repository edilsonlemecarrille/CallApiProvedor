/*
//function mostrarCliente() {
window.mostrarCliente = function (data) {
    displayElement("cliente-container");
    clearElement("enviar");
    clearElement("titulo-consultar-boletos");
    displayElement("div-confirmar");

    var codigo = document.querySelector("#codigo");
    var nome = document.querySelector("#nome");
    var endereco = document.querySelector("#endereco");
    var cpf = document.querySelector("#CPF");

    codigo.innerText = data.codigo;
    nome.innerText = data.nome;
    endereco.innerText = data.endereco;
    cpf.innerText = data.cpf;

    var carne = document.querySelector("#carne");
    var boleto = document.querySelector("#boleto");

    carne.setAttribute("href", applicationUrl + "download/Carnê " + data.nome + ".PDF");
}

function nomeCliente(pesquisar) {
    console.log(pesquisar);

    //var divnomes = document.querySelector("#div-nomes");
    //divnomes.innerHTML = "";
    document.querySelector("#div-nomes").innerHTML = "";
    document.querySelector("#div-info").innerHTML = "";

    if (pesquisar.value == '') {
        document.getElementById("btn-nome-pesquisar").innerText = "nome do cliente";
        document.querySelector("#btn-nome-pesquisar").style.backgroundColor = "rgba(47, 48, 50, 0.52)";
        console.log("pesquisar.value == ''");
    }
    else {
        document.getElementById("btn-nome-pesquisar").innerText = pesquisar.value;
        document.querySelector("#btn-nome-pesquisar").style.backgroundColor = "rgba(12, 168, 38, 0.93)";
        console.log("pesquisar.value != ''");
    }

    //if (pesquisar.value != '')
    //    document.getElementById("btn-nome-pesquisar").innerText = pesquisar.value;
}

function digitarNome(pesquisar) {
    console.log(pesquisar);

    //document.querySelector("#div-nomes").innerHTML = "";
    clearBox("div-nomes");
    //document.querySelector("#div-info").innerHTML = "";
    clearBox("div-info");

    if (pesquisar.value != '') {
        document.getElementById("btn-nome-pesquisar").innerText = pesquisar.value;
        document.querySelector("#btn-nome-pesquisar").style.backgroundColor = "rgba(12, 168, 38, 0.93)";
        console.log("pesquisar.value != ''");
    }
}

async function nomePesquisar(pesquisar) {
    console.log(pesquisar);
    console.log("Nome Consultado: " + pesquisar.innerText);

    if (pesquisar.innerText.split(" ").length > 2) {
        alert("Pesquise no máximo 2 partes do nome");
        return;
    }

    const urlNomePesquisar = applicationUrl + "nome/" + pesquisar.innerText;
    response = await fetch(urlNomePesquisar);
    data = await response.json();

    console.log(response);
    console.log(response.status);
    console.log(data);

    var divnomes = document.querySelector("#div-nomes");
    divnomes.innerHTML = "";
    document.querySelector("#div-info").innerHTML = "";

    data.forEach(element => {
        console.log(element);

        var nome = document.createElement("a");
        nome.innerText = element.nome;
        nome.setAttribute("id", element.codigo);
        nome.setAttribute("href", "javascript:getIpmac(" + element.codigo + ")");
        divnomes.appendChild(nome);

        var quebra = document.createElement("br");
        divnomes.appendChild(quebra);
    });
}

async function getIpmac(cliente) {
    console.log("function getIpmac ----------------------------------------------------------------");
    console.log("Código Cliente Consultado: " + cliente);

    var nome = document.getElementById(cliente).innerText;
    console.log("Nome Cliente: " + nome);

    //console.log("Nome Consultado: " + params.innerText);
    //console.log("Código Consultado: " + params.id);

    const urlIpmacPesquisar = applicationUrl + "ipmac/" + cliente;

    try {
        console.log("try");
        response = await fetch(urlIpmacPesquisar);
    }
    catch (err) {
        console.log("err.message");
        console.log(err.message);
    }
    finally {
        console.log("finally");
    }

    data = await response.json();

    console.log(response);
    console.log(response.status);
    console.log(data);

    var ip = data.ip;
    console.log("IP do Cliente: " + ip);

    var divnomes = document.querySelector("#div-nomes");
    divnomes.innerHTML = "";

    document.querySelector("#div-info").innerHTML = "";

    var tagcliente = document.createElement("p");
    tagcliente.innerText = "(" + cliente + ") " + nome;
    divnomes.appendChild(tagcliente);

    var tagip = document.createElement("a");
    tagip.setAttribute("href", "javascript:deviceInfo('" + ip + "')");
    tagip.innerText = ip;
    divnomes.appendChild(tagip);

    divnomes.appendChild(document.createElement("hr"));
}

async function deviceInfo(ip) {
    clearBox("div-info");

    await urlGet(applicationUrl + "deviceinfo/" + ip); //script.js

    for (var i = 0; i < data.length; i++) {
        element = document.createElement("p");
        element.innerText = data[i];
        document.querySelector("#div-info").appendChild(element);
    }

}
    */