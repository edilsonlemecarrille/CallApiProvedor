/*
function mostarBoleto(data) {
    displayElement("boleto-container");
    displayElement("numeracao");
    displayElement("opcoes-container");

    var vencimento = document.querySelector("#vencimento");
    var valor = document.querySelector("#valor");
    var formaPagamento = document.querySelector("#forma");
    var numeracao = document.querySelector("#numeracao");
    var chavepix = document.querySelector("#chavepix");

    const monthNames = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
        "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

    var boleto = document.querySelector("#boleto");
    boleto.innerText = "Boleto " + monthNames[new Date(data.vencimento + "T03:00").getMonth()];
    console.log("T03:00 " + new Date(data.vencimento + "T03:00"));

    var referencia = document.querySelector("#referencia");
    referencia.innerText = monthNames[new Date(data.vencimento + "T03:00").getMonth()];

    var dt = JSON.stringify(data.vencimento);
    var dt_vecto = dt.substring(9, 11) + "/" + dt.substring(6, 8) + "/" + dt.substring(1, 5);
    vencimento.innerText = dt_vecto;

    valor.innerText = (data.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    formaPagamento.innerText = data.formaPagamento;

    numeracao.innerText = calcularNumeracao(data);

    chavepix.innerText = montarChavePix(JSON.stringify(data.urldoQrCode));

    //formação da url para download do boleto //29-03-2025
    var nome = document.querySelector("#nome");
    var parcref = data.parcRef;

    boleto.setAttribute("href", applicationUrl + "download/Boleto "
        + nome.innerText + "-"
        + data.cliente + "-"
        + parcref.replace("/", "") + ".PDF");

    console.log(boleto.attributes.href);
}

function calcularNumeracao(data) {
    var nrdocumento = JSON.stringify(data.nrDocumento).padStart(5, "0");

    var NN = "232" + nrdocumento; // nosso número (ano + byte + nrdocumento + dv)

    // dados = agência + posto + cedente/beneficiário + ano + byte + nrdocumento
    NN += dvModulo11("30222321731232" + nrdocumento, "4329876543298765432");

    //banco(748) + moeda(9) + tipo cobrança(1) + tipo carteira(1) + nosso número(1-3)
    var campo1 = "748911" + NN.substring(0, 3);
    campo1 += dvModulo10(campo1, "212121212");

    var campo2 = NN.substring(3, 9) + "3022"; //nosso número(3-9) + cooperativa(3022) + dv
    campo2 += dvModulo10(campo2, "1212121212");

    //tp cob(1) + tp cart(1) + NN(aabnnnnnd) + coop(3022) + posto(23) + benef(21731) + c/valor(10) + DV
    var campolivre = "11" + NN + "3022232173110";

    //posto(23) + cedente(21731) + com valor(10) + DV Campo Livre
    var campo3 = "232173110" + dvModulo11(campolivre, "987654329876543298765432");
    campo3 += dvModulo10(campo3, "1212121212");

    campolivre += dvModulo11(campolivre, "987654329876543298765432");

    var fatorvencimento = fatorVencimento(JSON.stringify(data.vencimento));
    var fatorvencimento2 = data.seuNumero.padStart(4, "0");

    console.log("Fator Vencimento Javascript....: " + fatorvencimento);
    console.log("Fator Vencimento C# seuNumero..: " + fatorvencimento2);

    if (fatorvencimento != fatorvencimento2) {
        fatorvencimento = fatorvencimento2;
        console.log("fatorvencimento != fatorvencimento2");
    }

    var valor = JSON.stringify(data.valor).padStart(8, "0") + "00";

    var codigobarras = "7489" + fatorvencimento + valor + campolivre;
    const DV_CB = dvCodigoBarras(codigobarras, "4329876543298765432987654329876543298765432");

    //return campo1 + " " + campo2 + " " + campo3 + " " + DV_CB + " " + fatorvencimento + valor;
    return campo1.substring(0, 5) + "." + campo1.substring(5) + " " +
        campo2.substring(0, 5) + "." + campo2.substring(5) + " " +
        campo3.substring(0, 5) + "." + campo3.substring(5) + " " +
        DV_CB + " " + fatorvencimento + valor;
}

function dvModulo11(dados, pesos) {
    var somatorio = 0;

    for (i = 0; i < dados.length; i++) {
        somatorio += parseInt(dados[i]) * parseInt(pesos[i]);
    }

    var resto = somatorio % 11;

    if (resto == 0 || resto == 1) {
        return "0";
    }

    return (11 - resto).toString();
}

function dvModulo10(dados, pesos) {
    var somatorio = 0;
    var produto = 0

    for (i = 0; i < dados.length; i++) {
        produto = parseInt(dados[i]) * parseInt(pesos[i]);

        if (produto > 9) {
            for (p = 0; p < 2; p++) {
                somatorio += parseInt(produto.toString()[p]);
            }
        } else {
            somatorio += produto;
        }
    }

    var resto = somatorio % 10;

    if (resto == 0) {
        return resto.toString();
    } else {
        return (10 - resto).toString();
    }
}

function fatorVencimento(str) {
    const vencimento = new Date(str);
    const dataBase = new Date("10/07/1997");
    const dataBase2 = new Date("05/29/2022"); //ok
    //const dataBase2 = new Date("05/29/2022").toLocaleDateString('pt-BR'); //errado

    var diffInMs = vencimento - dataBase;
    var diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 9999) {
        diffInMs = vencimento - dataBase2;
        diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    }

    return diffInDays.toString().padStart(4, "0");
}

function dvCodigoBarras(dados, pesos) {
    var somatorio = 0;

    for (i = 0; i < dados.length; i++) {
        somatorio += parseInt(dados[i]) * parseInt(pesos[i]);
    }

    var resto = somatorio % 11;

    var DV = 11 - resto;

    if (DV == 0 || DV == 10 || DV == 11) {
        DV = 1;
    }

    return DV.toString();
}

function copiarNumeracao() {
    const textArea = document.createElement("textarea");
    textArea.value = numeracao.innerText;

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");

    alert("Numeração do Código de Barras copiado: \n\n" + textArea.value);

    document.body.removeChild(textArea);
}
    */