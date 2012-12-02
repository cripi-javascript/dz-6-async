/*
* 
 - абстрактная коллекция объектов
* Collection.prototype.add - добавление объекта в коллекцию
*
*/
var Collection = function (elem) {
        'use strict';
        this.elem = [];
        var key;
	    for (key in elem) {
	        this.elem.push(elem[key]);
        }
    };

Collection.prototype.add = function (model) {
    'use strict';
    var key;
				//console.log(model);
    if (model.length > 0) {
        for (key in model) {
				//  console.log(model[key]);
            model[key] = new Event(model[key]);
            if (model[key].validate() === true) {
	            this.elem.push(model[key]);
		    }
        }
    } else {
        if (model.validate() === true) {
	        this.elem.push(model);
        }
    }
};