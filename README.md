# Домашнее задание к 6 лекции

По умолчанию текущая ветка `gh-pages` (рьнише была `master`) это значит, что каждый раз как вы пушить в GitHub он
будет делать ваши файлы доступными по адресу `http://%%user_name%%.github.com/%%repo_name%%`
для этого проекта `http://cripi-javascript.github.com/dz-6-async`. Так мне будет проще смотреть, что у вас получилось, а
вы сможете показать кому-то еще :P

## Сериализация в JSON

Ваша коллекция должна уметь сериализовать ваши данные в JSON для последующей передачи их на сервер.

```javascript
var data = {
    name: "pewpew",
    start: new Date(),
    end: new Date()
};

var collection = [data];

var json = JSON.stringify(collection);
// '[{"name":"pewpew","start":"2012-11-07T10:18:39.207Z","end":"2012-11-07T10:18:39.207Z"}]'
```

## Работа с сервером

Вам нужно **представить**, что у вас есть абстрактный сервер, который может отдавать и сохранять текущее состояние вашего календаря.
Сервер обслуживает только одного пользователя.

**Сервер писать не нужно**

  * `GET current-event.json` - для чтения состояния
  * `POST current-event.json` - для сохранения состояния

### Получение данных

При старте ваша программа должна, используя XMLHttpRequest загрузить последнее сохраненное состояние. Динамически изменять
этот файл не нужно, представьте, что он изменяется и просто загружайте его статически.

Состояние фильтров и сортировки получать с мнимого сервера не нужно.

```javascript
// current-event.json - просто статический файл
getFile('current-event.json', fucntion (json) {
    var eventsCollection = JSON.parse(json);
    // Тут вы восстанавливаете коллекцию и отображаете ее на экран, учитывая фильтры и сортировку
});
```

Живой пример [http://cripi-javascript.github.com/dz-6-async](http://cripi-javascript.github.com/dz-6-async)

### Сохранение изменений

При добавлении элементов в коллекцию коллекция должна сериализоваться в строку и должна быть отправлена **целиком** на ваш мнимый сервер.

```javascript
Collection.prototype.serialise = function () {
    return JSON.stringify(this.items);
};

Collection.prototype.add = function (item) {
    // your stuff
    this.sendCurrentState();
};

Collection.prototype.sendCurrentState = function (item) {
    // current-event.json - просто статический файл
    var data = this.serialise();

    // POST запрос на любой URL
    postFile('current-event.json', data, fucntion () {
        // Тут не важно что
    });
};
```
