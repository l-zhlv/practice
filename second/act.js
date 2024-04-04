//форматирование даты и времени для столбцов отправления и получения
function formatTime(dateTimeString) {
    var date = new Date(dateTimeString); //Преобразование строки в формат даты и времени
    var day = date.getDate(); // получение дня из объекта даты
    var month = date.getMonth() + 1;  //получение месяца
    var year = date.getFullYear(); //получение года
    var hours = date.getHours(); //получение часа
    var minutes = date.getMinutes(); //получение минут
    var seconds = date.getSeconds(); //получение секунд
   return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year} 
   ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`; //корректный вывод даты и времени в нужном формате
}

//форматирование даты и времени для столбца "номер накладной"
function formatDateTime(dateTimeString) {
    var dateTime = new Date(dateTimeString); //преобразование строки в формат даты
    var day = dateTime.getDate(); //получение дня из даты
    var month = dateTime.getMonth() + 1; //получение месяцв
    var year = dateTime.getFullYear(); //получение года
    return `${day < 10 ? '0' + day : day}${month < 10 ? '0' + month : month}${year}`; //вывод данных в нужной форме
}


fetch('./waybill.json') //подключение файла с данными
  .then(response => response.json())
  .then(data => {
    const output = document.getElementById('output'); //работа с таблицей, вывод данных
    const table = document.querySelector('#waybillTable tbody');


    data.forEach(waybill => {
      const row = document.createElement('tr'); // выводы данных из файла в таблицу под заголовки
      row.innerHTML = `
         
          <td>${waybill.waybillNum}/${waybill.waybillDep} ${formatDateTime(waybill.waybillDate)}</td>
           <td>${formatTime(waybill.waybillSendDate)}</td>
           <td>${waybill.waybillDepFrom}</td>
          <td>${waybill.waybillSender}</td> 
          <td>${formatTime(waybill.waybillReceiveDate)}</td>
          <td>${waybill.waybillDepTo}</td>
          <td>${waybill.waybillReceiver}</td>
      `;
      table.appendChild(row);//добавление в таблицу
    });



 })
  .catch(error => console.error(error)); //поимка ошибки











