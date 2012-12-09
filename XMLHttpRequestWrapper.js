function callback (text) {
    console.log(text);
}

function postFile (fileName, data, callback) {
    "use strict"

    requestFile("POST", fileName, data, callback);
}

function getFile(fileName, callback) {
    "use strict"

    requestFile("GET", fileName, null, callback);
}

function requestFile(method, fileName, data, callback) {
    "use strict"

    var xhr = new XMLHttpRequest();
    xhr.open(method, fileName, true);
    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === 4) {
            callback(xhr.status === 200 ? xhr.responseText : "Error");
        }
    });
    xhr.send(data);
}