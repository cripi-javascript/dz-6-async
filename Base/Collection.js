﻿/**
* Возвращает объект Collection
*
* @param {Array} items Элементы списка
*
* @example Collection([]);
*/
var Collection = function (items) {
    "use strict";

    var i;
    this.items = []
    for (i = 0; i < items.length; i++) {
        this.items[i] = items[i].clone();
    }
};

/**
 * Добавление элемента в коллекцию
 *
 * @return {Collection}
 */
Collection.prototype.add = function (model) {
    "use strict";

    var result = new this.constructor(this.items);
    result.items.push(model);
    result.sendCurrentState();
    return result;
};

/**
 * @param {Function} selector
 *
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter
 *
 * @example
 *    new Collection([]).filter(function (item) {
 *        return item.get('attendee').indexOf("me") !== -1;
 *    });
 * @return {Collection}
 */
Collection.prototype.filter = function (selector) {
    "use strict";

    return new this.constructor(this.items.filter(selector));
};

/**
 * @param {String} fieldName
 *
 * @see http://javascript.ru/Array/sort
 *
 * @example
 *     new Collection([]).sortBy("raiting");
 * @return {Collection}
 */
Collection.prototype.sortBy = function (fieldName) {
    "use strict";

    var result = new this.constructor(this.items);
    result.items.sort(function (first, second) {
        if (first.get(fieldName) < second.get(fieldName)) {
            return -1;
        }
        if (first.get(fieldName) > second.get(fieldName)) {
            return 1;
        }
        return 0;
    });
    return result;
};

/**
 * Сериализация коллекции в формат JSON
 */
Collection.prototype.serialise = function () {
    "use strict"

    return JSON.stringify(this.items);
};

/**
 * Сохранение коллекции
 */
Collection.prototype.sendCurrentState = function () {
    "use strict"

    var data = this.serialise();
    console.log(data);
    postFile("current-event.json", data, callback);
};