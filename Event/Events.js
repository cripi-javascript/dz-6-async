﻿/**
 * @return {Object} Список событий
 */
var Events = function (items) {
    "use strict";

    Collection.call(this, items);
};

inherits(Events, Collection);
Events.prototype.constructor = Events;

/**
 * Прошедшие события 
 *
 * @return {Events}
 */
Events.prototype.findPastEvents = function () {
    "use strict";

    return this.filter(function (event) {
        return new Date(event.get("timeStart")) < new Date();
    });
};

/**
 * Предстоящие события 
 *
 * @return {Events}
 */
Events.prototype.findFutureEvents = function () {
    "use strict";

    return this.filter(function (event) {
        return new Date(event.get("timeStart")) > new Date();
    });
};

/**
 * События с участием персоны с именем "name" 
 *
 * @param personName Имя персоны
 *
 * @return {Events}
 */
Events.prototype.findEventsWithPerson = function (personName) {
    "use strict";

    return this.filter(function (event) {
        return event.get("member").some(function (member) {
            return member === personName;
        });
    });
};

/**
 * События без участия персоны с именем "name" 
 *
 * @param personName Имя персоны
 *
 * @return {Events}
 */
Events.prototype.findEventsWithoutPerson = function (personName) {
    "use strict";

    return this.filter(function (event) {
        return event.get("member").every(function (member) {
            return member != personName;
        });
    });
};

/**
 * События, которые произойдут после указанного времени
 *
 * @param time Временной отсчет
 *
 * @return {Events}
 */
Events.prototype.findEventsHappendLaterTime = function (time) {
    "use strict";

    return this.filter(function (event) {
        return new Date(event.get("timeStart")) > time;
    });
};

/**
 * События, которые произойдут до указанного времени
 *
 * @param time Временной отсчет
 *
 * @return {Events}
 */
Events.prototype.findEventsHappendBeforeTime = function (time) {
    "use strict";

    return this.filter(function (event) {
        return new Date(event.get("timeStart")) < time;
    });
};

/**
 * События, с рейтингом больше (или равного) переданному
 *
 * @param raiting Рейтинг
 *
 * @return {Events}
 */
Events.prototype.findEventsWithRaitingMore = function (raiting) {
    "use strict";

    return this.filter(function (event) {
        return event.get("raiting") >= raiting;
    });
};

/**
 * Сортировка по переданному полю
 *
 * @return {Events}
 */
Events.prototype.sortEventsBy = function (field) {
    "use strict";

    return this.sortBy(field);
};