(function (toExport) {
    toExport.ajaxXHR = function (method, url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(null, xhr.responseText);
                } else {
                    callback('error');
                }
            }
        });
        xhr.send(data);
    }
}(window));