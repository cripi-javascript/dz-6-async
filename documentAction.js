(function (exports) {
    "use strict";

    var ListOfEvents = new Events();
    var sortedList = new Events();

    var filterOption = "all";
    var sortOption = "without";

    document.body.addEventListener('load', initialise(), false);

    function initialise() {
        asyncXHR('GET','http://yunnii.github.com/dz-6-async/current-event.json', restoreState, null);
    }

    /**
    * Загружает свое состояние с сервера
    * при отсутсвии соединения/страницы на сервере пытается подключиться через 5 минут снова
    *
*/
    function restoreState(error, json) {

        document.querySelector("#notify").style.visibility = 'hidden';

        if (error === "error") {
            document.querySelector("#notifyError").visibility = 'visible';
            return;
        }

        var parseObject = JSON.parse(json);

        for (var i=0; i < parseObject.length; i++) {
            var newEvent = new Event(parseObject[i]).validate();
            ListOfEvents = ListOfEvents.add(newEvent);
        };

        changeDocument("sort");
        addListener();
}

/**
 * Добавляет новое событие в список. Если установлены опции фильтрации и сортировки 
 * - то располагает элменты на странице, в с-ии с ними
 *
*/
    function preventDefault() {

        var name = document.querySelector("#title").value,
            start = document.querySelector("#from").value,
            end = document.querySelector("#to").value,
            location = document.querySelector("#location").value,
            raiting = document.querySelector("#raiting").value,
            description = document.querySelector("#description").value,
            remindTime = document.querySelector("#remindTime").value;

        if (!validateTitle(name, document.querySelector('#title_help'))) { alert("Событие не было добавлено. Ошибка"); return; };
        if (!validateDate(start, document.querySelector('#from_help'))) { alert("Событие не было добавлено. Ошибка"); return; };
        if (!validateNumber(remindTime, document.querySelector('#remindTime_help'))) { alert("Событие не было добавлено. Ошибка"); return; };

        var element = new Event({
                name: name,
                start: start,
                end: end,
                location: location,
                raiting: raiting,
                description: description,
                remindTime: remindTime
            }).validate();

        var result = ListOfEvents.add(element);
        var data = result.serialise();

        asyncXHR('POST','http://localhost:8080/current-event.json', function(error) {

          /*if (error === "error") {
                alert("Не могу подключиться к северу. Попробуйте позже");
                return;
            }*/

            ListOfEvents = result;
            changeDocument("sort");
            document.forms["form"].reset();
        }, data);
    };

    function filterEvents(listEvents) {
        switch (filterOption) {
        case "future":
            return listEvents.coming();
        case "past":
            return listEvents.past();
        default:
            return listEvents;
        }
    }

    function sortEvents(listEvents) {
        switch (sortOption) {
        case "byName":
            return ListOfEvents.sortByName();
        case "byStart":
            return ListOfEvents.sortByTime();
        case "byRaiting":
            return ListOfEvents.sortByRaiting();
        default:
            return ListOfEvents;
        }
    }

/**
 * Сортирует и фильтрует события в соответствии с указанными опциями.
 *
 * @param {string} changeType - если указана строка "sort", то события также будут отсортированы,
 *  инчае - только отфильтрованы
 * @return коллекция объектов типа event
*/

    function changeDocument(changeType) {
        var parent = document.querySelector(".collection"),
            removeList = document.querySelector(".events");
        parent.removeChild(removeList);

        var addList = document.createElement('ul');
        addList.className = "events";

        var fragment = document.createDocumentFragment();
        if (changeType === "sort") {
            sortedList = sortEvents(ListOfEvents);
        }
        var filterList = filterEvents(sortedList);

        var length = filterList.length();

        for (var i = 0; i < length; i++)
        {
            var element = filterList.items[i];
            var el = addLiElement(element);
            addList.appendChild(el);
        }

        var parent = document.querySelector(".collection");
        fragment.appendChild(addList);
        parent.appendChild(fragment);
}

/**
 * Создает DOM-элемент типа li, заполняется полями из объекта
 *
 * @param {Event} element - объект типа Element
 *
 * @return Возвращает созданный дом-элемент типа li
*/

    function addLiElement (element) {
        var el = document.createElement('li');
        el.className = 'event_item';

        var name = document.createElement('div');
        name.textContent = "Название: " + element.name;

        var start = document.createElement('div');
        start.textContent = "Начало: " + element.start;

        var end = document.createElement('div');
        end.textContent = "Окончание: " + element.end;

        var location = document.createElement('div');
        location.textContent = "Местоположение: " + element.location;

        var remindTime = document.createElement('div');
        remindTime.textContent = "Напомнить за: " + element.remindTime + "минут";

        var description = document.createElement('div');
        description.textContent = "Описание: " + element.description;
        
        var raiting = document.createElement('div');
        raiting.textContent = "Рейтинг: " + element.raiting;

        el.appendChild(name);
        el.appendChild(start);
        el.appendChild(end);
        el.appendChild(location);
        el.appendChild(remindTime);
        el.appendChild(description);
        el.appendChild(raiting);

        return el;
    };

/**
 * Навешивает обработчики событий на страницу
*/
     function addListener() {
        var name = document.querySelector("#title");
        var start = document.querySelector("#from");
        var remindTime = document.querySelector("#remindTime");
        var filters = document.querySelectorAll('.filter');
        var sort = document.querySelectorAll('.sort');
        var button = document.querySelector("#addButton");

        name.addEventListener('blur', function(event) {
            var cur = event.currentTarget;
            validateTitle(cur.value, document.querySelector('#title_help'));
        });

        start.addEventListener('blur', function (event) {
            var cur = event.currentTarget;
            validateDate(cur.value, document.querySelector('#from_help'));
        });

        remindTime.addEventListener('blur', function (event) {
            var cur = event.currentTarget;
            validateNumber(remindTime.value, document.querySelector('#remindTime_help'));
        });

        for (var i=0; i < filters.length; i++) {
            filters[i].addEventListener('change', function (event) {
                filterOption = document.querySelector('input[name="filter"]:checked').value; 
                changeDocument("filter");
            });
        }

        for (var i=0; i < sort.length; i++) {
            sort[i].addEventListener('change', function(event) {
                sortOption = document.querySelector('input[name="sort"]:checked').value; 
                changeDocument("sort");
            });
        }

        button.addEventListener('click', preventDefault);
    }

}(window));