﻿/*global document: true*/
/*global initTestBase: true*/
/*global CalendaryErrorManager: true*/
(function (toExport) {
    "use strict";
/**
 * @namespace Пространство имен для календаря
 *
 * @field {EventFactory}  объект, хранящий ссылки на inputы необходимые для создания нового события 
 * @field eventList  ссылка на дом объект, хранящий список событий
 * @field eventBase все события пользователя
 * @field errorManager объект хранящий функции для валидации полей в дом и хранящий в себе некоторые тривиальные операции
 * @field currentFilters фильтры наложенные на текущие события
 */
    var Calendary = function () {
        this.whois = "Alex.Mangin";
        this.EventFactory = {
            "timer" : document.getElementById("NewEventTimeInterval"),
            "nameLocation" : document.getElementById("NewEventNameLocation"),
            "coordinate" : document.getElementById("NewEventCoordinate"),
            "stars" : document.getElementById("NewEventStars"),
            "cost" : document.getElementById("NewEventCost"),
            "parties" : document.querySelector("#NewEventPartiesList ol")
        };
        this.eventList = document.getElementById("eventList");
        this.errorManager = new CalendaryErrorManager("Error");
        this.currentFilters = [];
        this.eventBase = new BaseEvent([]);
    }
    toExport.Calendary = Calendary;
/**
 * @function - функция, возвращающая текущую базу событий, но с наложенными фильтрами
 *
 * @param {[Function]} фильтры в виде функции
 *
 * @return {BaseEvent}
*/
    Calendary.prototype.ApplyFilter = function (filters) {
        var base = this.eventBase,
            i;
        for (i = 0; i < filters.length; i = i + 1) {
            base = filters[i].call(base);
        }
        return base;
    }
/**
 * @function - функция, отправляет изменения календаря на сервер, а именно, что пользователь добавил новое событие
 *
 * @return {BaseEvent}
*/
    Calendary.prototype.SendChange = function (newEvent) {
        var jsonBase = JSON.stringify(newEvent);
        ajaxXHR('post','base.json',jsonBase,  function (err) {
            if (!err) {
            } else
            {
                console.log("Отправка произошла");
            }
        });
    }
/**
 * @function - функция, загружает изменения с сервера.
 *
 * @return {BaseEvent}
*/
    Calendary.prototype.LoadChange = function () {
        var currentCalendary = this;
        ajaxXHR('get','base.json', null, function (err, data) {
            if (!err) {
                var objEvents = JSON.parse(data).items, events = [];
                for(var i = 0; i < objEvents.length; i += 1) {
                    events.push(new Event(objEvents[i]));
                }
                currentCalendary.eventBase = new BaseEvent(events);
                currentCalendary.UpdateShowList();
            }
        })
    }
/**
 * @function - функция пытается создать событие из данных с формы
*/
    Calendary.prototype.CreateEvent = function () {
        var parties = [],
            partyList,
            i,
            eventDate,
            inputs,
            errors,
            docfrag,
            io,
            input;
        if (!this.isCorrecteNeedFields()) {
            this.changeNeed();
            this.changeAddition();
            return
        }
        if (!this.isCorrecteAdditionFields()) {
            if (!confirm('Некоторые незначительные поля некорректны, продолжить?')) {
                this.changeAddition();
                return;
            }
        }
        partyList = this.EventFactory.parties.querySelectorAll(" input");
        for ( i = 0; i < partyList.length; i = i + 1) {
            if (partyList[i].value && partyList[i].value !== "") {
                parties.push({"name" : partyList[i].value});
            }
        }
        eventDate = {
            "id" : Math.random(),
            "location" : {
                "gps": {
                    "x": parseFloat(this.EventFactory.coordinate.querySelector(" .XCoordinate").value),
                    "y":  parseFloat(this.EventFactory.coordinate.querySelector(" .YCoordinate").value)
                },
                "nameLocation": this.EventFactory.nameLocation.querySelector("input").value.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
            },
            "stars" : parseFloat(this.EventFactory.stars.querySelector("input").value),
            "cost" :  parseFloat(this.EventFactory.cost.querySelector("input").value),
            "start": new Date(this.EventFactory.timer.querySelector(".StartDate").value),
            "end": new Date(this.EventFactory.timer.querySelector(".FinishDate").value),
            "parties" : parties
        }
        if (DOMValidator.isCoordinate(this.EventFactory.coordinate)) {
            eventDate.location.gps.x = 0;
            eventDate.location.gps.y = 0;
        }
        if (DOMValidator.isStars(this.EventFactory.stars)) {
            eventDate.stars = 0;
        }
        if (DOMValidator.isPositiveNumber(this.EventFactory.cost)) {
            eventDate.cost = 0;
        }
        var newEvent = new Event(eventDate);
        this.SendChange(newEvent);
        this.eventBase = this.eventBase.add(newEvent);
        inputs = document.querySelectorAll('#eventFactory input');
        for (i = 0; i < inputs.length; i = i + 1) {
            if (inputs[i].type === "text" || inputs[i].type === "date") {
                inputs[i].value = "";
            }
        }
        errors = document.querySelectorAll('#eventFactory .Error');
        for (i = 0; i < errors.length; i = i + 1) {
            errors[i].parentElement.removeChild(errors[i]);
        }
        this.errorManager.removeAllChildren(this.EventFactory.parties);
        docfrag = document.createDocumentFragment()
        io = document.createElement("li");
        input = document.createElement("input");
        input.type = "text";
        io.appendChild(input);
        for (i = 0; i < 3; i = i + 1) {
            docfrag.appendChild(io.cloneNode(true));
        }
        this.EventFactory.parties.appendChild(docfrag);
    }

/**
 * @function - функция обновляет отфильтрованный список со всеми наложенными фильтрами
*/
    Calendary.prototype.UpdateShowList = function () {
        var createEventRow = function (number, event) {
            var row = (function createRow() {
                var rowTable = document.createElement("tr"),
                    cellTable = document.createElement("td"),
                    i;
                for (i = 0; i < 7; i = i + 1) {
                    rowTable.appendChild(cellTable.cloneNode(false));
                }
                return rowTable;
            }()),
                listParty,
                n,
                aDOMParty,
                i;
            row.children[0].appendChild(document.createTextNode(number));
            row.children[1].appendChild(document.createTextNode(event.locationToString()));
            row.children[2].appendChild(document.createTextNode(event.starsToString()));
            row.children[3].appendChild(document.createTextNode(event.start.toDateString()));
            row.children[4].appendChild(document.createTextNode(event.end.toDateString()));
            row.children[5].appendChild(document.createTextNode(event.cost + " $"));
            listParty = document.createElement("select");
            for (i = 0; i < event.parties.length; i += 1) {
                aDOMParty = document.createElement("option");
                aDOMParty.appendChild(document.createTextNode(event.parties[i].name));
                listParty.appendChild(aDOMParty);
            }
            if (event.parties.length) {
                row.children[6].appendChild(listParty);
            }
            return row;
        },
            newEventList,
            currentBase,
            i,
            event;
        this.errorManager.removeAllChildren(this.eventList);
        newEventList = document.createDocumentFragment();
        currentBase = this.ApplyFilter(this.currentFilters);
        for (i = 0; i < currentBase.items.length; i = i + 1) {
            event = currentBase.items[i];
            newEventList.appendChild(createEventRow(i + 1, event));
        }
        this.eventList.appendChild(newEventList);
    }
/**
 * @function функция вызывает обработчики ошибок необходимых полей
*/
    Calendary.prototype.changeNeed = function () {
        this.errorManager.changeTime(this.EventFactory.timer);
        this.errorManager.changeImportantStringField(this.EventFactory.nameLocation);
    }
/**
 * @function функция вызывает обработчики ошибок необязательных полей
*/
    Calendary.prototype.changeAddition = function () {
        this.errorManager.changeCoordinate(this.EventFactory.coordinate);
        this.errorManager.changePositiveNumber(this.EventFactory.cost);
        this.errorManager.changeStars(this.EventFactory.stars);
    }
/**
 * @function функция проверяет корректность необходимых полей
*/
    Calendary.prototype.isCorrecteNeedFields = function () {
        return DOMValidator.isTimeInterval(this.EventFactory.timer) === "" && 
            DOMValidator.isImportantStringField(this.EventFactory.nameLocation) === ""; 
    }
/**
 * @function функция проверяет корректность дополнительных полей
*/
    Calendary.prototype.isCorrecteAdditionFields = function () {
        return DOMValidator.isCoordinate(this.EventFactory.coordinate) === "" &&
            DOMValidator.isStars(this.EventFactory.stars) === "" &&
            DOMValidator.isPositiveNumber(this.EventFactory.cost) === "";
    }
/**
 * @function функция добавляет дополнительное поле в коллекцию друзей
 * @param {DIVdomElement} хранилище коллекции друзей
*/
    Calendary.prototype.addFriend = function (li) {
        var newParty = document.createElement("li"),
            input = document.createElement("input");
        input.type = "text";
        newParty.appendChild(input);
        li.appendChild(newParty);
    }
/**
 * @function функция, обновляющая данные фильтра из DOM
*/
    Calendary.prototype.updateFilter = function () {
        var filterRadios = document.querySelectorAll("#FilterEventList input[type = radio]"),
            oldFilters = this.currentFilters,
            newFilters = [],
            i,
            radioButton,
            partys,
            nonEmptyParty,
            partyFilter;
        for (i = 0; i < filterRadios.length; i = i + 1) {
            radioButton = filterRadios[i];
            if (radioButton.checked &&
                radioButton.checked === true &&
                radioButton.value != "None") {
                var nameFunc = radioButton.value.toString();
                newFilters.push(function() {
                    return this[nameFunc]();
                });
            }
        }
        partys = document.querySelectorAll("#FilterFriens input");
        nonEmptyParty = [];
        for (i = 0; i < partys.length; i = i + 1) {
            if (partys[i].value != "") {
                nonEmptyParty.push(partys[i].value);
            }
        }
        partyFilter = function() {
            var base = this, i
            for (i = 0; i < nonEmptyParty.length; i = i + 1) {
                base = base.withFriend({
                    "name": nonEmptyParty[i]
                });
            }
            return base;
        }
        newFilters.push(partyFilter);
        this.currentFilters = newFilters;
    }
}(window));