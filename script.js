//geral ******************************************************************************************

//variáveis globais
const applicationUrl = "http://138.122.43.34:5200/";
//const applicationUrl = "http://138.122.43.35:5200/";
let response = null;
let data = null;
var element; //uso geral

var verdepadrao = "rgba(31, 157, 25, 0.80)";
var azulpadrao = ' #275dfed2';
var cinzapadrao = "rgba(47, 48, 50, 0.52)";
var brancopadrao = "rgb(255, 255, 255)";
var vermelhopadrao = "rgba(255, 30, 30, 0.80)";

function cabecalho() {
    var divcabecalho = document.getElementById("div-cabecalho");
    var titulo = document.createElement("p");
    var subtitulo = document.createElement("p");

    titulo.innerText = "elc.net.br";
    subtitulo.innerText = "Provedor de Internet Via Rádio";

    titulo.setAttribute("class", "titulo-principal");
    subtitulo.setAttribute("class", "titulo-secundario");

    divcabecalho.appendChild(titulo);
    divcabecalho.appendChild(subtitulo);
}

function clearElement(elementID) {
    if (document.getElementById(elementID)) {
        document.getElementById(elementID).style.display = "none";
    }
}

function displayElement(elementID) {
    if (document.getElementById(elementID)) {
        document.getElementById(elementID).style.display = "block";
    }
}

function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
    //document.getElementById(elementID).innerText = "";
}

async function urlGet(urlget) {
    try { response = await fetch(urlget); }
    catch (err) { console.log(err.message); }

    data = await response.json();

    console.log(response);
    console.log(response.status);
    console.log(data);
}

async function getDadosCliente() {
    var cpf = document.getElementById("cpf").value;

    if (cpf.length < 14) {
        alert("CPF incorreto ou incompleto...");
        return;
    }

    cpf = cpf.replace(".", "").replace(".", "").replace("-", "");

    if (!validarCPF(cpf)) {
        alert("CPF incorreto. Digite novamente...");
        return;
    }

    await urlGet(applicationUrl + "Cliente/" + cpf);

    if (response.ok) {
        mostrarCliente(data);
    }
    else {
        displayElement("erro-container");
        clearElement("div-enviar");
    }
}

async function getDadosBoleto() {
    clearElement("div-confirmar-btn");
    clearElement("div-confirmar-msg");

    const clienteId = document.getElementById("codigo").innerText;

    await urlGet(applicationUrl + "ParcVend/" + clienteId);

    const monthNames = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
        "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

    // preencher nomes das mensalidades    
    for (let i = 0; i < data.length; i++) {
        var option = document.createElement("option");
        option.text = monthNames[new Date(data[i].vencimento + "T03:00").getMonth()];
        document.getElementById("select-meses").add(option);
    }

    // mostrar boleto
    if (response.ok) {
        mostarBoleto(data[0]);
    }
    else {
        displayElement("erro-container");
        clearElement("div-enviar");
    }
}

function showMonth(option) {
    mostarBoleto(data[option.selectedIndex]);
}

function clearShowMonth() {
    for (let i = 0; i < data.length; i++) {
        var x = document.getElementById("select-meses");
        x.remove(x.selectedIndex);
    }
}

//boleto *****************************************************************************************

function mostarBoleto(data) {
    displayElement("boleto-container");
    displayElement("div-boleto");
    displayElement("numeracao");
    displayElement("div-opcoes");

    var vencimento = document.getElementById("vencimento");
    var valor = document.getElementById("valor");
    var formaPagamento = document.getElementById("forma");
    var numeracao = document.getElementById("numeracao");
    var chavepix = document.getElementById("chavepix");

    const monthNames = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
        "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

    var boleto = document.getElementById("boleto");
    boleto.innerText = "Baixar Boleto " + monthNames[new Date(data.vencimento + "T03:00").getMonth()];
    console.log("T03:00 " + new Date(data.vencimento + "T03:00"));

    var referencia = document.getElementById("referencia");
    referencia.innerText = monthNames[new Date(data.vencimento + "T03:00").getMonth()];

    var dt = JSON.stringify(data.vencimento);
    var dt_vecto = dt.substring(9, 11) + "/" + dt.substring(6, 8) + "/" + dt.substring(1, 5);
    vencimento.innerText = dt_vecto;

    valor.innerText = (data.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    formaPagamento.innerText = data.formaPagamento;

    numeracao.innerText = calcularNumeracao(data);

    chavepix.innerText = montarChavePix(JSON.stringify(data.urldoQrCode));

    //formação da url para download do boleto //29-03-2025
    var nome = document.getElementById("nome");
    var parcref = data.parcRef;

    boleto.setAttribute("href", applicationUrl + "download/Boleto "
        + nome.innerText + "-"
        + data.cliente + "-"
        + parcref.replace("/", "") + ".PDF");

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

//boleto-nome cliente *****************************************************************************

function mostrarCliente(data) {
    displayElement("div-cliente");
    clearElement("div-enviar");
    clearElement("titulo-consultar-boletos");
    displayElement("div-confirmar-msg");
    displayElement("div-confirmar-btn");

    var codigo = document.getElementById("codigo");
    var nome = document.getElementById("nome");
    var endereco = document.getElementById("endereco");
    var cpf = document.getElementById("CPF");

    codigo.innerText = data.codigo;
    nome.innerText = data.nome;
    endereco.innerText = data.endereco;
    cpf.innerText = data.cpf;

    var carne = document.getElementById("carne");
    var boleto = document.getElementById("boleto");

    carne.setAttribute("href", applicationUrl + "download/Carnê " + data.nome + ".PDF");
}

//cliente *****************************************************************************************
function nomeCliente(pesquisar) {
    clearBox("div-nomes");
    clearBox("div-info");

    if (pesquisar.value == '') {
        document.getElementById("btn-nome-pesquisar").innerText = "nome do cliente";
        document.getElementById("btn-nome-pesquisar").style.backgroundColor = cinzapadrao;
    }
    else {
        document.getElementById("btn-nome-pesquisar").innerText = pesquisar.value;
        document.getElementById("btn-nome-pesquisar").style.backgroundColor = azulpadrao;
    }

    document.getElementById("btn-device-ping").innerText = "000.000.000.000";
    document.getElementById("btn-device-ping").style.backgroundColor = cinzapadrao;
}

function digitarNome(pesquisar) {
    clearBox("div-nomes");
    clearBox("div-info");

    if (pesquisar.value != '') {
        document.getElementById("btn-nome-pesquisar").innerText = pesquisar.value;
        document.getElementById("btn-nome-pesquisar").style.backgroundColor = verdepadrao;
    }

    document.getElementById("btn-device-ping").innerText = "000.000.000.000";
    document.getElementById("btn-device-ping").style.backgroundColor = cinzapadrao;
}

async function nomePesquisar(pesquisar) {
    clearBox("div-nomes");

    if (pesquisar.innerText.split(" ").length > 2) {
        alert("Pesquise no máximo 2 partes do nome");
        return;
    }

    await urlGet(applicationUrl + "nome/" + pesquisar.innerText);

    var divnomes = document.getElementById("div-nomes");

    data.forEach(element => {
        var nome = document.createElement("a");
        nome.innerText = element.nome;
        nome.setAttribute("id", element.codigo);
        nome.setAttribute("href", "javascript:getIpmac(" + element.codigo + ")");
        nome.setAttribute("class", "btn-large");
        divnomes.appendChild(nome);
    });

    document.getElementById("btn-device-ping").innerText = "000.000.000.000";
    document.getElementById("btn-device-ping").style.backgroundColor = cinzapadrao;
}

async function getIpmac(cliente) {
    await urlGet(applicationUrl + "ipmac/" + cliente);

    var nome = document.getElementById(cliente).innerText;
    var divnomes = document.getElementById("div-nomes");

    clearBox("div-nomes");
    clearBox("div-info");

    var tagcliente = document.createElement("p");
    tagcliente.innerText = "(" + cliente + ") " + nome;
    divnomes.appendChild(tagcliente);

    var tagip = document.getElementById("btn-device-ping");
    tagip.innerText = data.ip;
    //divnomes.appendChild(tagip);
}

//cpf ********************************************************************************************

function digitarCPF() { // preparar tela para digitação do cpf
    clearElement("div-cliente");
    clearElement("erro-container");
    clearElement("boleto-container");
    clearElement("div-boleto");
    clearElement("div-opcoes");
    clearElement("chavepix");
    clearElement("numeracao");
    clearElement("div-confirmar-msg");
    clearElement("div-confirmar-btn");

    displayElement("div-enviar");
    displayElement("titulo-consultar-boletos");

    //clearBox("select-meses");
    //document.getElementById("select-meses").selectedIndex = 0;
    if (data != null) {
        clearShowMonth();
    }

    var botaoboleto = document.getElementById("boleto");
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

//ping  ******************************************************************************************

function changeIP(base) {
    console.log(base.value);

    switch (base.value) {

        case "":
            base.value = "172.16.88.";
            break;
        case "172.16.88.":
            base.value = "172.16.89.";
            break;
        case "172.16.89.":
            base.value = "172.16.90.";
            break;
        case "172.16.90.":
            base.value = "172.16.91.";
            break;
        case "172.16.91.":
            base.value = "192.168.172.";
            break;
        case "192.168.172.":
            base.value = "192.168.173.";
            break;
        case "192.168.173.":
            base.value = "172.16.88.";
            break;
        default:
        //code block
    }

    document.getElementById("btn-device-ping").innerText = base.value;
}

function digitarIP() {
    document.getElementById("btn-device-ping").style.backgroundColor = cinzapadrao;

    document.getElementById("btn-device-info").innerText = "Device Info";
    document.getElementById("btn-device-info").style.backgroundColor = cinzapadrao;
    document.getElementById("btn-device-info").style.color = brancopadrao;

    document.getElementById("wlaninfo").style.display = "none";
}

async function pingTest(ip) {
    await urlGet(applicationUrl + "ping/" + ip.innerText);

    var idbutton = ip.getAttribute("id");

    if (data == "PingOff") {
        document.getElementById(idbutton).style.backgroundColor = vermelhopadrao;
    }

    if (data == "PingOn") {
        document.getElementById(idbutton).style.backgroundColor = verdepadrao;
        deviceInfo(ip.innerText);
    }
}

async function deviceInfo(ip) {
    clearBox("div-info");

    await urlGet(applicationUrl + "deviceinfo/" + ip);

    for (var i = 0; i < data.length; i++) {
        element = document.createElement("p");
        element.innerText = data[i];
        document.getElementById("div-info").appendChild(element);
    }
}

function refresh() {
    location.reload();
}

function ipbutton(ipdigitado) {
    if (ipdigitado.value == '')
        document.getElementById("btn-device-ping").innerText = "Device IP";
    else
        document.getElementById("btn-device-ping").innerText = ipdigitado.value;
}

//pix ********************************************************************************************

//https://github.com/NascentSecureTech/pix-qrcode-utils/blob/master/packages/emv-merchant-qrcode/src/crc.ts

function montarChavePix(urldoqrcode) {
    let prefixo = "00020126910014br.gov.bcb.pix2569";
    urldoqrcode = urldoqrcode.replace('"', "");
    urldoqrcode = urldoqrcode.replace('"', "");
    let sufixo = "5204000053039865802BR5903PIX6006Cidade62070503***6304"
    var pixcompleto = prefixo + urldoqrcode.trim() + sufixo;
    let crc16 = computeCRC(pixcompleto);
    pixcompleto += crc16;
    return pixcompleto;
}

function computeCRC(str) { // calcular crc da chave pix
    const bytes = new TextEncoder().encode(str);
    const crcTable = [0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b,
        0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
        0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401,
        0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
        0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738,
        0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
        0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96,
        0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
        0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd,
        0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
        0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb,
        0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
        0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2,
        0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
        0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8,
        0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
        0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827,
        0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
        0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d,
        0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
        0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74,
        0x2e93, 0x3eb2, 0x0ed1, 0x1ef0];
    let crc = 0xFFFF;

    for (let i = 0; i < bytes.length; i++) {
        const c = bytes[i];
        const j = (c ^ (crc >> 8)) & 0xFF;
        crc = crcTable[j] ^ (crc << 8);
    }

    let answer = ((crc ^ 0) & 0xFFFF);
    let hex = answer.toString(16).padStart(4, '0');

    return hex.toUpperCase();
}

function copiarChavePix() {
    const textArea = document.createElement("textarea");
    textArea.value = chavepix.innerText;

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");

    alert("Chave Pix copiada: \n\n" + textArea.value);

    document.body.removeChild(textArea);
}