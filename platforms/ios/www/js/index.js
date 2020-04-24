var IAB_PAGE_URL = "iab_content_page.html";

var webView, osVersion, iab, updateTimerId, startTime;

function log(msg) {
    $('#log').append("<p>" + msg + "</p>");
}

function activateLicense() {
    RadaeePDFPlugin.activateLicense(
        {
        licenseType: 2, //0: for standard license, 1: for professional license, 2: for premium license
        company: "BINTER SISTEMAS S.L", //the company name you entered during license activation
        email: "comprasbs@bintersistemas.com", //the email you entered during license activation
        key: "SVU2VG-1L51WN-45AZTW-GTFHSO-BF6C82-EBRFSX" //your license activation key
        },
        function(message)
        {
            console.log("Success:" + message);
            log(message);          
        },
        function(err){
            console.log("Failure:" + err);
            log(JSON.stringify(err));
        });
}

function openIAB() {
    var iabOpts = getIabOpts();
    if(document.getElementById('init-hidden').checked){
        document.body.className = "hidden";
        iabOpts += ",hidden=yes";
    }

    window.location.href = "iab_content_page.html";
}

function onIABLoaded() {
    iab.executeScript({
        code: "(function() { " +
        "var body = document.querySelector('body'); " +
        "var bottom = document.createElement('div'); " +
        "bottom.innerHTML = 'Absolute Bottom'; " +
        "bottom.classList.add('bottom');  " +
        "body.appendChild(bottom); " +
        "var time = document.createElement('div'); " +
        "time.id=\"time\";" +
        "body.appendChild(time); " +
        "})(); " +
        "document.getElementsByTagName('h1')[0].innerHTML = \" Injected Title\";"
    }, function (returnValue) {
        returnValue = returnValue[0];
        log("executeScript callback returned : " + returnValue);
    });

    iab.insertCSS({
        code: "body *{color: red !important;} \
                  .bottom { position: fixed; bottom: 0; z-index: 500; width: 100%; background: black; opacity: 0.5; padding: 10px; font-size: 20px;}"
    }, function () {
        log("insertCSS called back");
    });

    startTime = (new Date()).getTime();
    updateTimerId = setInterval(function () {
        var elapsedSecs = Math.floor(((new Date()).getTime() - startTime)/1000);
        iab.executeScript({
            code: "(function() { " +
            "var timeEl = document.getElementById('time');" +
            "timeEl.innerHTML = "+elapsedSecs+"; " +
            "return "+elapsedSecs+";" +
            "})();"
        }, function (returnValue) {
            returnValue = returnValue[0];
            console.log("executeScript for updateTimer returned : " + returnValue);
        });
    }, 1000);

}

function hideIAB(){
    document.body.className = "hidden";
    iab.hide();
    readMyCookie();
}

function showIAB(){
    document.body.className = "";
    iab.show();
    iab.executeScript({
        code: "readMyCookie();"
    });
}

// Create cookie
function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

// Read cookie
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

// Erase cookie
function eraseCookie(name) {
    createCookie(name,"",-1);
}

function setMyCookie() {
    createCookie('mycookie', document.getElementById('mycookie').value);
}

function readMyCookie(){
    document.getElementById('mycookie').value = readCookie('mycookie');
}


function onDeviceReady() {
    console.log("deviceready");

    osVersion = parseFloat(device.version);

    $('#platform').html(device.platform + " " + device.version);
    getIabOpts();
    $('#webview').html(webView);

    setMyCookie();
    document.getElementById('mycookie').addEventListener('change', setMyCookie);
                                
    activateLicense();
}

function getIabOpts(){
    var iabOpts;
    if (device.platform === "iOS") {
        iabOpts = 'location=no,toolbar=yes,beforeload=yes';
        var targetWebview = $('input[name=webview]:checked').val();
        if(targetWebview === "wkwebview"){
        	iabOpts += ',usewkwebview=yes';
        }
        if (window.webkit && window.webkit.messageHandlers) {
            webView = "WKWebView";
        } else {
            webView = "UIWebView";
        }
    } else {
        iabOpts = 'location=yes';
        if (navigator.userAgent.toLowerCase().indexOf('crosswalk') > -1) {
            webView = "Crosswalk";
        } else {
            webView = "System";
        }
    }
    return iabOpts;
}


$(document).on('deviceready', onDeviceReady);
