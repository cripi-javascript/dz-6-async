var xhr = new XMLHttpRequest();
// Подготавливаем запрос
xhr.open('GET', 'test.json', true);
// Подписываемся на событие "изменение статуса"
xhr.addEventListener('readystatechange', function () {
// Когда ответ пришел
if (xhr.readyState === 4) {
// Печатаем тело ответа
console.log(xhr.responseText);
}
}, false);
// Отправляем запрос
xhr.send();