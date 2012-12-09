function callback (message) {
    console.log(message);
}

function postFile (fileName, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", fileName, true);
    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === 4) {
            callback(xhr.status === 200 ? "Ready" : "Error");
        }
    });
    xhr.send(data);
}