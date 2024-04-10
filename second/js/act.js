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


function searchAllPages(searchValue) {
    const table = document.getElementById('waybillTable');
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

//функция для поиска на странице данных
// function searchTable() {
//     const input = document.querySelector('input[name="s"]').value.toLowerCase(); // получение введенного текста, приведение к нижнему регистру
//     const allPages = Math.ceil(data.length / rowsPerPage); //общее количество страниц
//
//     for (let i = 1; i <= allPages; i++) { //проход по страницам
//         showPage(i); // Вывод каждой страницы
//         searchAllPages(input); // Поиск на каждой странице
//     }
// }


//функция для поиска на всех страницах (не работает :") )
function searchAllPages(tableRows, searchValue) {
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

//функция для поиска на странице
function searchTable() {
    const input = document.querySelector('input[name="s"]').value.toLowerCase(); // ввод искомого значения
    const rows = document.querySelectorAll('#waybillTable tbody tr');

    searchAllPages(rows, input);
}

document.querySelector('input[name="s"]').addEventListener('input', searchTable); //получение введенной информации

fetch('../json/waybill.json') //подключение файла с информацией
    .then(response => response.json()) //обрабатываем ответ на запрос и снова преобразуем в формат json
    .then(data => {
        const output = document.getElementById('output');
        const table = document.querySelector('#waybillTable tbody');

        // Параметры для пагинации
        const rowsPerPage = 10; // Количество строк на странице
        let currentPage = 1; // Текущая страница

        //функция для демонстрации данных
        function showInfo(start, end) {
            table.innerHTML = ''; // Очистить таблицу перед заполнением новыми данными

            data.slice(start, end).forEach(waybill => { //разбиваем данные
                const row = document.createElement('tr');
                row.classList.add("content");
                row.setAttribute('id', `${waybill.waybillID}`); //получаем ID
                row.addEventListener('click', function () { //функция для перехода на другую страницу
                   sendId(row.id, `${waybill.waybillNum}/${waybill.waybillDep} ${GetDate(waybill.waybillDate)}`); //получаем номер накладной для демонстрации на следующей странице
                });
                //вывод данных
                row.innerHTML = ` 
                    <td>${waybill.waybillNum}/${waybill.waybillDep} ${GetDate(waybill.waybillDate)}</td>
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

        //функция для получения ID и номера номенклатуры
        function sendId(id, waybillNumDepDate) {
            window.location.href = `../html/shows2.html?id=${id}&waybillNumDepDate=${waybillNumDepDate}`;
        }


        // Функция для отображения страниц
        function showPage(page) {
            const start = (page - 1) * rowsPerPage; //первая страница
            const end = start + rowsPerPage;
            showInfo(start, end); //вызов функции, показ разбитой страницы
        }

        // Показать начальную страницу
        showPage(currentPage);

        // Добавление кнопок для пагинации
        const allPages = Math.ceil(data.length / rowsPerPage);
        for (let quanty = 1; quanty <= allPages; quanty++) { //проход по всем страницам
            const paginationBtn = document.createElement('button');
            paginationBtn.classList.add("pagination-button")
            paginationBtn.textContent = quanty;
            paginationBtn.addEventListener('click', function () { //по клику на кнопки переход на страницу
                currentPage = quanty; //текущая страница = quanty
                showPage(currentPage); //показ текущей страницы
            });
            output.appendChild(paginationBtn);
        }
    })
    .catch(error => console.error(error)); //поимка ошибок
