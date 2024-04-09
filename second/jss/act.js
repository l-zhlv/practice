//форматирование даты и времени для столбцов отправления и получения
function GetDateAndTime(dateTimeString) {
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
function GetDate(dateTimeString) {
    var dateTime = new Date(dateTimeString); //преобразование строки в формат даты
    var day = dateTime.getDate(); //получение дня из даты
    var month = dateTime.getMonth() + 1; //получение месяцв
    var year = dateTime.getFullYear(); //получение года
    return `${day < 10 ? '0' + day : day}${month < 10 ? '0' + month : month}${year}`; //вывод данных в нужной форме
}


//функция для поиска на странице данных
function searchTable() {
    const input = document.querySelector('input[name="s"]').value.toLowerCase(); //получение значения для поиска, приведение к нижнему регистру
    const rows = document.querySelectorAll('#waybillTable tbody tr'); //

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(input)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}


document.querySelector('input[name="s"]').addEventListener('input', searchTable);


fetch('../jsons/waybill.json')
    .then(response => response.json())
    .then(data => {
        const output = document.getElementById('output');
        const table = document.querySelector('#waybillTable tbody');

        // Параметры для пагинации
        const rowsPerPage = 30; // Количество строк на странице
        let currentPage = 1; // Текущая страница

        function showInfo(start, end) {
            table.innerHTML = ''; // Очистить таблицу перед заполнением новыми данными

            data.slice(start, end).forEach(waybill => {
                const row = document.createElement('tr');
                row.classList.add("content");
                row.setAttribute('id', `${waybill.waybillID}`);
                row.addEventListener('dblclick', function () {
                    sendId(row.id);
                });

                row.innerHTML = `
                    <td><a href="#">${waybill.waybillNum}/${waybill.waybillDep} ${GetDate(waybill.waybillDate)}</a></td>
                    <td>${GetDateAndTime(waybill.waybillSendDate)}</td>
                    <td>${waybill.waybillDepFrom}</td>
                    <td>${waybill.waybillSender}</td>
                    <td>${GetDateAndTime(waybill.waybillReceiveDate)}</td>
                    <td>${waybill.waybillDepTo}</td>
                    <td>${waybill.waybillReceiver}</td>
                `;
                table.appendChild(row);
            });
        }

        function sendId(id) {
            window.location.href = `../htmls/shows2.html?id=${id}`;
        }

        // Функция для отображения данных на странице
        function showPage(page) {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            showInfo(start, end);
        }

        // Показать начальную страницу
        showPage(currentPage);

        // Добавление кнопок для пагинации
        const allPages = Math.ceil(data.length / rowsPerPage);

        for (let quanty = 1; quanty <= allPages; quanty++) {
            const paginationBtn = document.createElement('button');
            paginationBtn.classList.add(".budu")
            paginationBtn.textContent = quanty;
            paginationBtn.addEventListener('click', function () {
                currentPage = quanty;
                showPage(currentPage);
            });
            output.appendChild(paginationBtn);
        }
    })
    .catch(error => console.error(error));


// fetch('../jsons/waybill.json') //подключение файла с данными
//     .then(response => response.json())
//     .then(data => {
//         const output = document.getElementById('output'); //работа с таблицей, вывод данных
//         const table = document.querySelector('#waybillTable tbody');
//
//
//         data.forEach(waybill => {
//             const row = document.createElement('tr'); // выводы данных из файла в таблицу под заголовки
//             row.classList.add("content")
//             row.setAttribute('id', `${waybill.waybillID}`)
//             row.addEventListener('dblclick', function () {
//                 sendId(row.id)
//             });
//
//             function sendId(id) {
//                 window.location.href = `../htmls/shows2.html?id=${id}`;
//                 // window.location.href = '../htmls/shows2.html?id=' + id;
//             }
//
//             row.innerHTML = `
//
//           <td><a href="#">${waybill.waybillNum}/${waybill.waybillDep} ${GetDate(waybill.waybillDate)}</a></td>
//           <td>${GetDateAndTime(waybill.waybillSendDate)}</td>
//           <td>${waybill.waybillDepFrom}</td>
//           <td>${waybill.waybillSender}</td>
//           <td>${GetDateAndTime(waybill.waybillReceiveDate)}</td>
//           <td>${waybill.waybillDepTo}</td>
//           <td>${waybill.waybillReceiver}</td>
//       `;
//             table.appendChild(row);//добавление в таблицу
//         });
//     })
//     .catch(error => console.error(error)); //поимка ошибки
//
//
//
//







