﻿var myEvents = new Events([]);

/**
 * Обработка формы с событием
 *   1. Извлечение данных о событии из формы
 *   2. Очитка формы от введенных данных
 *   3. Добавление события в список сохраненных
 *   4. Перересовка списка событий
 *
 * @return false для того чтобы не перезагружалась страница
 */
function onSubmitEventForm() {
    "use strict";

    try {
        var event = parseEventForm();
        var errors = event.validate();
        if (errors.length == 0) {
            resetEventForm();
            myEvents = myEvents.add(event);
            rePaintEvents(myEvents);
        }
        else {
            setErrorMessage("Невозможно добавить событие, содержатся следующие ошибки:" + errors);
        }
    } catch (e) {
        console.log(e.message);
        console.log(e.stack);
    } finally {
        return false;
    }
}


/**
 * Загрузка сохраненных событий
 */
function loadEvents() {
    "use strict";

    var localEvents = getFile("current-event.json", function (json) {
        myEvents.items = JSON
            .parse(json)
            .map(function (event) {
                return new Event(event);
            });
        rePaintEvents(myEvents);
    });
}

/**
 * Сортировка и фильтрация списка сохраненных событий и их перерисовка
 */
function showEventList() {
    "use strict";

    var sortSelector = document.getElementById("eventSortType");
    var events = myEvents.sortEventsBy(sortSelector.value);
    if (document.getElementById("lastEvents").checked) {
        events = events.findPastEvents();
    }
    if (document.getElementById("futureEvents").checked) {
        events = events.findFutureEvents();
    }
    var withPerson = document.getElementById("withPerson").value;
    if (withPerson != "") {
        events = events.findEventsWithPerson(withPerson);
    }
    var withoutPerson = document.getElementById("withoutPerson").value;
    if (withoutPerson != "") {
        events = events.findEventsWithoutPerson(withoutPerson);
    }
    var raiting = document.getElementById("raitingMore").value;
    events = events.findEventsWithRaitingMore(raiting);

    rePaintEvents(events);
}

/**
 * Очитка формы от введенных данных
 */
function resetEventForm () {
    "use strict";

    var form = document.getElementById("eventForm");
    form.reset();
    deleteMembers();
    setErrorMessage("");
}

/**
 * Извлечение данных из формы
 * 
 * @return {Object|Event} Событие
 */
function parseEventForm() {
    "use strict";

    var name = document.getElementById("eventName").value;
    var address = document.getElementById("eventAddress").value;
    var timeStart =
        new Date(
            Date.parse(
                document.getElementById("eventDateStart").value + "T" +
                document.getElementById("eventTimeStart").value));
    var timeEnd = 
         new Date(
            Date.parse(
                document.getElementById("eventDateEnd").value + "T" +
                document.getElementById("eventTimeEnd").value));
    var memberHTML = document.querySelectorAll(".memberItem");
    var i, members = [];
    for (i = 0; i < memberHTML.length; i++) {
        members.push(memberHTML[i].innerHTML);
    }    
    var raiting = document.getElementById("eventRaiting").value;

    return new Event({
        "name": name || "<Без имени>",
        "address": address || "<Без адреса>",
        "timeStart": timeStart,
        "timeEnd": timeEnd,
        "member": members,
        "raiting": +raiting || 3
        });
}

/**
 * Перерисовка списка переданных событий
 * 
 * @param events список событий для отрисовки
 */
function rePaintEvents(events) {
    "use strict";

    var oldContainer = document.getElementById("myEvents");
    
    var newContainer = document.createElement("div");
    newContainer.id = "myEvents";

    events.items
        .map(eventHtml)
        .map(function (event) {
            newContainer.innerHTML += event;
        });

    oldContainer.parentNode.replaceChild(newContainer, oldContainer);
}

/**
 * Создание представления для одного события
 *
 * @return {String} html представление события
 */
function eventHtml(event) {
    "use strict";

    var i, stars = "";
    for(i = 0; i < event.raiting ; i++) {
        stars += "*"
    }
    var timeStart = (event.timeStart == "Invalid Date") ? "Не указано" : new Date(event.timeStart).toUTCString();
    var timeEnd = (event.timeEnd == "Invalid Date") ? "Не указано" : new Date(event.timeEnd).toUTCString();

    var eventHtml =
        "<div class='event'>" +
            "<div>" + stars + " \"" + event.name + "\" с " + timeStart + " по " + timeEnd + "</div>" +
            "<div>Адрес: " + event.address + "</div>" +
            "<div>Участники: " + event.member + "</div>" +
        "</div>";
    return eventHtml;
}

/**
 * Добавление участника события при нажатии на плюсик
 */
function addMember() {
    "use strict";

    var member = document.getElementById("eventMember").value;
    if (member != "") {
        var memberHTML =
            "<div>" +
                "<span class='inputTitle'>&nbsp;</span>" +
                "<span class='memberItem'>" + member +"</span>" +
                "<img src='images/delete.jpg' alt='Удалить элемент' height='20' align='top' onclick='deleteMember(this);'>" +
            "</div>";

        var membersContainer = document.getElementById("eventMembers");
        membersContainer.innerHTML += memberHTML;
    }
}

/**
 * Удаление учатника события из отображаемого списка при нажатии на крестик
 */
function deleteMember(deleteButton) {
    "use strict";

    var memberContainer = deleteButton.parentNode;
    memberContainer.parentNode.removeChild(memberContainer);
}

/**
 * Удаление всех участников события
 */
function deleteMembers() {
    "use strict";

    var i, membersHTML = document.querySelectorAll(".memberItem");
    for (i = 0; i < membersHTML.length; i++) {
        var memberContainer = membersHTML[i].parentNode;
        memberContainer.parentNode.removeChild(memberContainer);
    }
}

/**
 * Устанавливает сообщение об ошибке
 *
 * @param message сообщение об ошибке в форме
 */
function setErrorMessage(message) {
    "use strict";

    var errorContainer = document.getElementById("errorInForm");
    errorContainer.innerHTML = message;
}