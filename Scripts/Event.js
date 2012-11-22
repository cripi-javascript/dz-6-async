﻿/*global Model: true*/
(function (toExport) {
    "use strict";
/**
 * Создает новое событие в календаре
 * @class Событие в календаре
 * @augments Model 
 *
 * @field {Number} - id Индификационный номер объекта по идее тут должен быть GUID
 * @field {Object} - location объект содержащий локационные данные о событии + название события
 * @field {Number} - реитинг
 * @field {Number} - Цена посещения
*/
    var Event = function Event(data) {
        "use strict";
        this.id = Math.random();
        this.location = {
            "gps": {x: 0, y: 0},
            "nameLocation": "Earth"
        };
        this.stars =  0;
        this.cost =  0;
        this.parties = [];
        Model.call(this, data);
        if (typeof data.start === "string") {
            this.start = new Date(data.start);
        }
        if (typeof data.start === "string") {
            this.end = new Date(data.end);
        }
        this.validate(this);
        this.setLocation(this.location.gps, this.location.nameLocation);
        this.stars = this.leaveMark(this.stars);
    }
    toExport.Event = Event;
    Event.prototype = Object.create(Model.prototype, {
        constructor: {
            value: Event,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
/**
 * @function Функция, проверяющая корректность даты
 *
 * @return {bool}
*/
    Event.prototype.dateValidator = function (date) {
        "use strict";
        if (Object.prototype.toString.call(date) === "[object Date]") {
            if (!isNaN(date.getTime())) {
                return true;
            }
        }
        return false;
    };
/**
 * @function Проверяет на корректность координаты
 * @private
 *
 * @field coordinate координаты в дву мерном пространстве
 * @field name название события
 * @filed {Boolean}
*/
    var isCorrectedCoordinate = function (coordinate, name) {
            var isType = typeof coordinate !== "undefined" && typeof name === "string";
            if (!isType) {
                return false;
            }
            var isX = typeof coordinate.x === "number";
            var isY = typeof coordinate.y === "number";
            return isX && isY;
        }
/**
 * @function set-ер установления локации события
 *
 * @field gps координаты в дву мерном пространстве
 * @field название события
*/
    Event.prototype.setLocation = function (gps, name) {
        
        if (isCorrectedCoordinate(gps, name)) {
            this.location.gps = gps;
            this.location.nameLocation = name;
        } else {
            this.location = {
                "gps" : {"x" : 0, "y" : 0},
                "nameLocation" : "Earth"
            };
        }
    };
/**
 * @function Коррекция значения рейтинга
 *
 * @return {Number} 0,1,2,3,4,5
*/
    Event.prototype.leaveMark = function (stars) {
        if (isNaN(parseFloat(stars)) ||
            !isFinite(stars) ||
            stars < 0) {
            stars = 0;
        }
        if (stars > 5) {
            stars = 5;
        }
        stars = Math.floor(stars); 
        return stars;
    };
/**
 * @function Проверяет объект на корректность
 *
 * @field {Event} event - то что проверяем
*/
    Event.prototype.validate = function (event) {
        if (event.cost < 0) {
            throw new Error("Цена за вход не может быть отрицательной");
        }
        if (!Array.isArray(event.parties)) {
            throw new Error("Участники - это массив");
        }
        var existsSomePartyWithoutNameField = event.parties.some(function (party) {
            return !party.name;
        });
        if (existsSomePartyWithoutNameField) {
            throw new Error("У одного из участников нет поля <ИМЯ>");
        }
        if (event.end < event.start) {
            throw new Error("Даты начала и конца перепутаны");
        }
    };
/**
 * @function Функция, печатающие значение локационных данных объекта
 *
 * @return {String} [location], (x, y) 
*/
    Event.prototype.locationToString = function() {
        return this.location.nameLocation + ", (" + this.location.gps.x + ";" + this.location.gps.y + ")";
    }
/**
 * @function Функция, печатающие значение рейтинга в звездочках
 *
 * @return {String} ,*,**,***,****,*****
*/
    Event.prototype.starsToString= function() {
        return new Array(this.stars + 1).join('*');;
    }
}(window));