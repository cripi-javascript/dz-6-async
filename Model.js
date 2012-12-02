/*
* Model - абстрактный объект
* Model.prototype.set - устанавливает аттрибуты и значения атрибутов, в соответсвии с принятым в качестве параметра объектом
* Model.prototype.get - возвращает запрашиваемое свойство у объекта
* Model.prototype.validate - проверяет корректность полей объекта 
*/
var Model = function (attributes) {
	    "use strict";
	    var key;
	    for (key in attributes) {
	        if (attributes.hasOwnProperty(key)) {
		        this[key] = attributes[key];
		    }
        }
    };

Model.prototype.set = function (attributes) {
    "use strict";
    var key;
    for (key in attributes) {
	    if (attributes.hasOwnProperty(key)) {
		    this[key] = attributes[key];
		}
    }
};

Model.prototype.get = function (attribute) {
    "use strict";
    if (this.hasOwnProperty(attribute)) {
        return this[attribute];
    }
    return undefined;
};

Model.prototype.validate = function (attributes) {
    "use strict";
    throw new Error('this is Abstract method');
};
