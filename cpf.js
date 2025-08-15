/*
function digitarCPF() { // preparar tela para digitação do cpf
    clearElement("cliente-container");
    clearElement("erro-container");
    clearElement("boleto-container");
    clearElement("opcoes-container");
    clearElement("chavepix");
    clearElement("numeracao");
    clearElement("div-confirmar");
    displayElement("enviar");
    displayElement("titulo-consultar-boletos");
    clearElement("mensalidade1");
    clearElement("mensalidade2");
    clearElement("mensalidade3");
    clearElement("mensalidade4");

    var botaoboleto = document.querySelector("#boleto");
    botaoboleto.innerText = "Boleto";

}

function mascara(i) {
    var v = i.value;

    if (isNaN(v[v.length - 1])) {
        i.value = v.substring(0, v.length - 1);
        return;
    }

    if (v.length == 3 || v.length == 7) {
        i.value += ".";
    }

    if (v.length == 11) {
        i.value += "-";
    }
}

//window.validarCPF = function (CPF) {
function validarCPF(CPF) {
    try {
        var tCPF = CPF.substring(0, 9);

        var soma = 0;

        for (i = 0; i < 9; i++) {
            soma += parseInt(tCPF[i]) * (i + 1);
        }

        tCPF += (soma % 11) % 10;

        soma = 0;

        for (i = 0; i < 10; i++) {
            soma += parseInt(CPF[i]) * i;
        }

        tCPF += (soma % 11) % 10;

        return CPF.endsWith(tCPF.substring(9));
    }
    catch {
        return false;
    }
}
    */