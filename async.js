function asyncXHR(method, url, data, writeToFile) {
    'use strict';
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.addEventListener('readystatechange', function () {
   // console.log(xhr.status);
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
		        console.log(xhr.responseText);
                writeToFile(xhr.responseText);
            } else {
                console.log("error: status != 200 ");
            }
        }
    });
    xhr.send(data);
}

//var testEvent= new Event({"name": "Pewpe", "start": "11.12.2012", "end": "13.12.2012"});
var coll = new Events();

writeToFile = function (text) {
    'use strict';
// console.log("функция writetoFile");
    var newEvents, key;
    newEvents = JSON.parse(text);
//	console.log("сейчас будет вывод объекта");
//	console.log(newEvents.length);
    for (key in newEvents) {
        coll.add(newEvents[key]);
	console.log(coll);
        document.getElementById('contekst').innerHTML = text;
    }
}
