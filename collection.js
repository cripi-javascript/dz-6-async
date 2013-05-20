﻿(function (exports) {
    "use strict";

var Collection = function (items) {

    this.items = [];
    var key;

    for (key in items) {
        if (items.hasOwnProperty(key)) {
            this.items.push(items[key]);
        }
    }
};

exports.Collection = Collection;

Collection.prototype.constructor = Collection;

/**
 * Сериализует коллекцию
 *
 * @return {JSON object} 
 *
 */
Collection.prototype.serialise = function () {
    return JSON.stringify(this.items, 3);
}

/**
 * Добавляет в коллекцию объект
 *
 * @param {object} model
 *
 * @return {Collection} * @example
 *
 */
Collection.prototype.add = function (model) {

    var temp = new this.constructor(this.items);
    temp.items.push(model);
    return temp;
};

/**
 * @param {Function} selector
 *
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter
 *
 * @example
 *    new Collection().filter(function (item) {
 *        return item.get('attendee').indexOf("me") !== -1;
 *    });
 * @return {Collection}
 */
Collection.prototype.filter = function (selector) {

    if (typeof selector !== "function") {
        throw new Error('Argument must be function');
    }

    return new this.constructor(this.items.filter(selector));
};

/**
 * Принимает функцию сортировки и сортирует на основе ее
 *
 * @param {function} selector
 *
 * @return {Collection} * @example
 *
 */
Collection.prototype.sort = function (selector) {

    if (typeof selector !== "function") {
        throw new Error('Argument must be function');
    }

    return new this.constructor(this.items.sort(selector));
};

Collection.prototype.reverse = function () {

    return new this.constructor(this.items.reverse());
};

Collection.prototype.length = function (selector) {

    return this.items.length;
};
}(window));