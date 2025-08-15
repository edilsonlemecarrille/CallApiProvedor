/*
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
    console.log(document.querySelector("#ip-wlan").value);
    console.log(document.querySelector("#btn-device-ping").value);
}

function digitarIP() {
    document.getElementById("btn-device-ping").style.backgroundColor = "rgba(47, 48, 50, 0.52)";

    document.querySelector("#btn-device-info").innerText = "Device Info";
    document.querySelector("#btn-device-info").style.backgroundColor = "rgba(47, 48, 50, 0.52)";
    document.querySelector("#btn-device-info").style.color = "rgb(255, 255, 255)";

    document.querySelector("#wlaninfo").style.display = "none";
}

async function pingTest(ip) {
    await urlGet(applicationUrl + "ping/" + ip.innerText); //script.js

    var idbutton = ip.getAttribute("id");

    if (data == "PingOff") {
        document.getElementById(idbutton).style.backgroundColor = "rgba(255, 6, 6, 0.89)";
    }

    if (data == "PingOn") {
        document.getElementById(idbutton).style.backgroundColor = "rgb(31, 157, 25)";
    }
}

async function deviceInfo() {
    document.querySelector("#wlaninfo").style.display = "block";

    var ipcliente = document.querySelector("#ip-wlan").value;
    console.log("Device Info IP: " + ipcliente);

    //const urlDeviceInfo = applicationUrl + "deviceinfo/" + ipcliente;
    //response = await fetch(urlDeviceInfo);
    //data = await response.json();

    //console.log(response);
    //console.log(response.status);
    //console.log(data);

    await urlGet(applicationUrl + "deviceinfo/" + ipcliente); //script.js


    var signal = data[1];

    document.querySelector("#btn-device-info").innerText = signal;

    document.querySelector("#btn-device-info").style.backgroundColor = "rgba(41, 73, 237, 0.91)";

    if (signal == 0)
        document.querySelector("#btn-device-info").style.backgroundColor = "rgba(9, 9, 9, 0.69)";

    if (signal == 'Off')
        document.querySelector("#btn-device-info").style.backgroundColor = "rgba(37, 37, 39, 0.92)";

    if (signal <= -60)
        document.querySelector("#btn-device-info").style.backgroundColor = "rgba(16, 149, 207, 0.94)";

    if (signal <= -65)
        document.querySelector("#btn-device-info").style.backgroundColor = "rgba(12, 168, 38, 0.93)";

    if (signal <= -70) {
        document.querySelector("#btn-device-info").style.backgroundColor = "rgb(251, 251, 38)";
        document.querySelector("#btn-device-info").style.color = "rgb(0, 0, 0)";
    }

    if (signal <= -75) {
        document.querySelector("#btn-device-info").style.backgroundColor = "rgba(245, 139, 16, 0.84)";
        document.querySelector("#btn-device-info").style.color = "rgb(255, 255, 255)";
    }

    if (signal <= -80) {
        document.querySelector("#btn-device-info").style.backgroundColor = "rgba(237, 14, 14, 0.94)";
        document.querySelector("#btn-device-info").style.color = "rgb(255, 255, 255)";
    }

    if (signal <= -85) {
        document.querySelector("#btn-device-info").style.backgroundColor = "rgba(169, 12, 155, 1)";
        document.querySelector("#btn-device-info").style.color = "rgb(255, 255, 255)";
    }

    var signal = document.querySelector("#signal");
    var model = document.querySelector("#model");
    var country = document.querySelector("#country");
    var ssid = document.querySelector("#ssid");
    var connections = document.querySelector("#connections");
    var security = document.querySelector("#security");
    var uptime = document.querySelector("#uptime");
    var frequency = document.querySelector("#frequency");
    var mode = document.querySelector("#mode");
    var width = document.querySelector("#width");
    var txpower = document.querySelector("#txpower");
    var antenna = document.querySelector("#antenna");
    var noise = document.querySelector("#noise");
    var ccq = document.querySelector("#ccq");
    var txrate = document.querySelector("#txrate");
    var rxrate = document.querySelector("#rxrate");
    var versao = document.querySelector("#versao");

    signal.innerText = data[0];
    model.innerText = data[1];
    country.innerText = data[2];
    ssid.innerText = data[3];
    connections.innerText = data[4];
    security.innerText = data[5];
    uptime.innerText = data[6];
    frequency.innerText = data[7];
    mode.innerText = data[8];
    width.innerText = data[9];
    txpower.innerText = data[10];
    antenna.innerText = data[11];
    noise.innerText = data[12];
    ccq.innerText = data[13];
    txrate.innerText = data[14];
    rxrate.innerText = data[15];
    versao.innerText = data[16];
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
        */