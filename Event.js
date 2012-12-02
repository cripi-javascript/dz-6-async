/*
* Event - объект события в календаре. Объект наследуется от Model
* Event.prototype.validate - проверяет корректность полей объекта 
* 
* function inherits(Constructor, SuperConstructor) - функция для чистого наследования
*/
var Event = function (data) {
        "use strict";
        Model.apply(this, arguments);
        this.name = this.name || "Встреча";
        this.place = this.place || {};
        this.info = this.info || {};
        this.reminder = this.reminder || "За день до встречи";
        this.type = this.type || "Работа";
        this.party = this.party || "участвую";
    };

function inherits(Constructor, SuperConstructor) {
    "use strict";
    var F = function () {};
    F.prototype = SuperConstructor.prototype;
    Constructor.prototype = new F();
}

inherits(Event, Model);

Event.prototype.validate = function () {
    "use strict";
    if (this.start === "undefined") {
        console.log("starts is can not be null");
        return "starts is can not be null";
    }
    if (this.end !== "undefined" && this.end < this.start) {
        console.log("can't end before it starts");
        return "can't end before it starts";
    }
    return true;
};
