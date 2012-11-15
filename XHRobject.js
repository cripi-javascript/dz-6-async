(function (exports) {
    "use strict";

    exports.asyncXHR = function (method, url, callback, data) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(null, xhr.responseText);
                }
                else {
                    callback("error");
                }
            }
        }, false);

        xhr.send(data);
    }
}(window));