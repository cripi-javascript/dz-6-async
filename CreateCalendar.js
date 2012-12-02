/*jslint plusplus: true, browser: true, devel: true */
var currentEvents = new Events();

function asyncXHR(method, url, data, callback) {
    "use strict";
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(null, xhr.responseText);
            } else {
                callback(null, xhr.responseText);
            }
        }
    });
    xhr.send(data);
}

asyncXHR('get', 'current-event.json', null, function (err, json) {
    "use strict";
    if (!err) {
        var newEvents = JSON.parse(json),
            newEvent,
            n = newEvents.length,
            i;
        currentEvents.check = false;
        for (i = 0; i < n; i++) {
            newEvent = new Event(newEvents[i]);
            currentEvents.add(newEvent);
        }
        WriteCalendar();
        currentEvents.check = true;
    }
});


function WriteCalendar() {
    "use strict";
    var filterEvents = currentEvents,
        filter1,
        filter2,
        bool,
        s,
        res;

    filter1 = document.querySelector('input[class="filter1"]:checked');
    filter2 = document.querySelector('input[class="filter2"]:checked');
    bool = false; // флажок. если =true, выдаем отфильтрованную коллекцию. иначе - всю.
    if (filter1 !== null && filter1.value === "on") {
        filterEvents = currentEvents.findFutureEvents();
        bool = !bool;
    }
    if (filter2 !== null && filter2.value === "on") {
        filterEvents = currentEvents.findPastEvents();
        bool = !bool;
    }

    s = "";
    if (document.querySelector('input[name="sort"]:checked') !== null) {
        s = document.querySelector('input[name="sort"]:checked').value;
    }

    if (bool) {
        res = new Events(filterEvents.sortBy(s).items);
    } else {
        res = new Events(currentEvents.sortBy(s).items);
    }
    res.write();
}

function CreateCalendar() {
    "use strict";
    var date = (document.getElementsByName("start_date")[0]).value,// строка даты 
        time = (document.getElementsByName("start_time")[0]).value, // строка времени
        startEv = date + "T" + time + ":00",
        endEv,
        element,
        filterEvents = currentEvents,
        filter1,
        filter2,
        bool,
        res;

    date = (document.getElementsByName("end_date")[0]).value;
    st = (document.getElementsByName("end_time")[0]).value;
    endEv = date + "T" + time + ":00";

    element = new Event({
        start: startEv,
        end:  endEv,
        name: (document.getElementsByName("New_Event")[0]).value,
        place: (document.getElementsByName("plase_event")[0]).value,
        rating: parseFloat((document.getElementsByName("rating_event")[0]).value[0]),
        comment: (document.getElementsByName("comment_event")[0]).value,
        link: (document.getElementsByName("link_event")[0]).value
    });
    element.validate();
    currentEvents.add(element);

    WriteCalendar();
}

var addListener = function () {
    "use strict";
    var button = document.getElementsByName("add_event")[0],
        filter = document.getElementsByName("filter"),
        sort = document.getElementsByName("sort"),
        i;
    button.addEventListener('click', CreateCalendar);
    for (i = 0; i < filter.length; i++) {
        filter[i].addEventListener('change', WriteCalendar);
    }
    for (i = 0; i < sort.length; i++) {
        sort[i].addEventListener('change', WriteCalendar);
    }
};