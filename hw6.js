// JavaScript Document
ourEvent = new Event()


function getEvent(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'myserver/lastEvent/', true);
	xhr.addEventListener('readystatechange', function () {
		if (xhr.readyState === 4) {
			return xhr.responseText;
		}
	}, false);
};

function postEvent(Event){
	var jsonEvent = JSON.stringify(Event);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'myserver', true);
	xhr.send(jsonEvent);
};

Collection.prototype.add = postEvent;