/**
* Возвращает объект Event
*
* @param {Json} Событие
*
* @example
*   Event({
*       name: "Совещание",
*       address: "Екатеринбург, ул. Тургенева, д. 4, ауд. 150",
*       timeStart: new Date(),
*       timeEnd: new Date(),
*       member: ["я"],
*       raiting: 5);
*/

var Event = function (event) {
    "use strict";

    Model.call(this);
    this.set(event);
}

inherits(Event, Model);
Event.prototype.constructor = Event;

/**
 * Валидация собития
 *
 * @return {Array} Список ошибок
 */
Event.prototype.validate = function () {
    "use strict";

    var errors = [];
    if (new Date(this.get("timeStart")) > new Date(this.get("timeEnd"))) {
        errors.push("Время начала события больше чем время конца");
    }
    if (this.get("raiting") < 0) {
        errors.puch("Рэйтинг собития меньше допустимой величины");
    }
    else if (this.get("raiting") > 5) {
        errors.push("Рэйтинг события больше допустимой величины");
    }
    return errors;
};