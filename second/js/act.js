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

var selected_row = null;

function select_row(row) {
    row.parentNode.querySelectorAll('tr').forEach(row => row.classList.remove('selected')); // Удаляем класс 'selected' у всех строк
    row.classList.add('selected'); // Добавляем класс 'selected' кликнутой строке
}

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

//const ulTag = document.querySelector('.pagination ul');
document.querySelector('input[name="s"]').addEventListener('input', searchTable); //получение введенной информации
let waybillTable = document.getElementById('waybillTable');

waybillTable.onclick = function (e) {
    if (e.target.tagName !== 'TH') return;
    let th = e.target;
    sortTable(th.cellIndex, th.dataset.type);
};

//функция для сортировки
function sortTable(colNum, type) {
    let tbody = waybillTable.querySelector('tbody');
    let rowsArray = Array.from(tbody.rows);
    let compare;

    switch (type) {
        case 'number': //сортировка для числовых типов
            compare = function (row1, row2) {
                return parseInt(row1.cells[colNum].innerText) - parseInt(row2.cells[colNum].innerText);
            };
            break;
        case 'string': //сортировка для строковых значений
            compare = function (row1, row2) {
                return row1.cells[colNum].innerText.localeCompare(row2.cells[colNum].innerText);
            };
            break;
    }

    rowsArray.sort(compare);

    tbody.innerHTML = '';
    rowsArray.forEach(function (row) {
        tbody.appendChild(row);
    });
}

fetch('../json/waybill.json') //подключение файла с информацией
    .then(response => response.json()) //обрабатываем ответ на запрос и снова преобразуем в формат json
    .then(data => {
        const output = document.getElementById('output');
        const table = document.querySelector('#waybillTable tbody');

        function CreatePagination(pageCount, page, paginationList) {
            let items = []//массив кнопок пагинации

            paginationList.innerHTML = ""
            let li
            let prevPage = page - 1;
            let nextPage = page + 1;

//условие вывода кнопки предыдущей страницы
            if (page > 1) {
                li = document.createElement("li")
                li.innerHTML = "Назад";
                li.addEventListener('click', (event) => {
                    CreatePagination(pageCount, prevPage, paginationList)
                })
                items.push(li)
            }

//условие вывода кнопки первой страницы
            if (page > 2) {
                li = document.createElement("li")
                li.innerHTML = 1;
                li.classList.add("num");
                items.push(li)
//условие вывода кнопки троеточия
                if (page > 3) {
                    li = document.createElement("li")
                    li.innerHTML = "...";
                    items.push(li)
                }
            }
//вывод кнопок трех кнопок страниц
            for (let i = prevPage; i <= nextPage; i++) {
                if ((i < 1) || (i > pageCount)) {
                } else {
                    li = document.createElement("li")
                    li.innerHTML = i;
                    li.classList.add("num");
                    if (page === i) {
                        li.classList.add("active")
                        active = li
                    }
                    items.push(li)
                }
            }

//условие вывода кнопки последней страницы
            if (page < pageCount - 1) {
//условие вывода кнопки троеточия
                if (page < pageCount - 2) {
                    // AddInfoInLiElement("...")
                    li = document.createElement("li")
                    li.innerHTML = "...";
                    items.push(li)
                }
                //AddInfoInLiElement(pageCount, "num")
                li = document.createElement("li")
                li.innerHTML = pageCount;
                li.classList.add("num");
                items.push(li)
            }
//условие вывода кнопки следующей страницы
            if (page < pageCount) {
                // AddInfoInLiElement("Вперёд", 'click', nextPage)
                li = document.createElement("li")
                li.innerHTML = "Вперёд";
                li.addEventListener('click', (event) => {
                    CreatePagination(pageCount, nextPage, paginationList)
                })
                items.push(li)
            }

//присвоение события кнопкам пагинации
            for (let item of items) {
                if (item.classList.contains('num')) {
                    item.addEventListener('click', function () {
                        CreatePagination(pageCount, +this.innerHTML, pagination)
                    })
                }
                paginationList.appendChild(item);
            }
            displayPage(page)//вызов функции отрисовки данных активной страницы
        }

        function displayPage(pageNum) {
            let start = rowsCount * (pageNum - 1);
            let end = start + rowsCount;
            let paginatedData = data.slice(start, end);
            tableBody.innerHTML = "";

            paginatedData.forEach(waybill => {
                let row = document.createElement('tr');

                var selected_row = null;

                function select_row(row) {
                    row.parentNode.querySelectorAll('tr').forEach(row => row.classList.remove('selected')); // Удаляем класс 'selected' у всех строк
                    row.classList.add('selected'); // Добавляем класс 'selected' кликнутой строке
                }

                //присвоение события перехода на страницу с данными о задании каждой строке таблицы
                row.classList.add("content");
                row.setAttribute('id', `${waybill.waybillID}`); //получаем ID
                row.addEventListener('click', function () { //функция для перехода на другую страницу
                    sendId(row.id, `${waybill.waybillNum}/${waybill.waybillDep} ${GetDate(waybill.waybillDate)}`, `${GetDateAndTime(waybill.waybillSendDate)}`, `${waybill.waybillDepFrom}`, `${waybill.waybillSender}`, `${GetDateAndTime(waybill.waybillReceiveDate)}`, `${waybill.waybillDepTo}`, `${waybill.waybillReceiver}`); //получаем номер накладной для демонстрации на следующей странице
                });
//вывод данных
                row.innerHTML = `
                    <td onclick='select_row(this)' style="text-align: right;">${waybill.waybillNum}/${waybill.waybillDep} ${GetDate(waybill.waybillDate)}</td>
                    <td onclick='select_row(this)' style="text-align: left;">${GetDateAndTime(waybill.waybillSendDate)}</td>
                    <td onclick='select_row(this)' style="text-align: right;">${waybill.waybillDepFrom}</td>
                    <td onclick='select_row(this)' style="text-align: left;">${waybill.waybillSender}</td>
                    <td onclick='select_row(this)' style="text-align: left;">${GetDateAndTime(waybill.waybillReceiveDate)}</td>
                    <td onclick='select_row(this)' style="text-align: right;">${waybill.waybillDepTo}</td>
                    <td onclick='select_row(this)' style="text-align: left;">${waybill.waybillReceiver}</td>
                    `;
                table.appendChild(row);
            })
        }

        const tableBody = document.querySelector('.table tbody')
        const pagination = document.querySelector('.pagination');
        let rowsCount = 20;//количество строк данных на одной странице
        let active; //переменная для хранения активной кнопки отобращения страницы
        let pageCount = Math.ceil(data.length / rowsCount)//количество страниц с данными

        CreatePagination(pageCount, 1, pagination)//вызов функции отрисовки пагинаци
    })


//функция для получения ID и номера номенклатуры
function sendId(id, waybillNumDepDate, waybillDateSend, waybillDepFrom, waybillSender, waybillGetDate, waybillDepTo, waybillReceiver) {
    window.location.href = `../html/shows2.html?id=${id}&waybillNumDepDate=${waybillNumDepDate}&waybillDateSend=${waybillDateSend}&waybillDepFrom=${waybillDepFrom}&waybillSender=${waybillSender}&waybillGetDate=${waybillGetDate}&waybillDepTo=${waybillDepTo}&waybillReceiver=${waybillReceiver}`;
}

const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementsByClassName('close')[0];
const infoForm = document.getElementById('infoForm');

// Открыть модальное окно
openModalBtn.onclick = function () {
    modal.style.display = 'block';
}

// Закрыть модальное окно при клике на крестик
closeBtn.onclick = function () {
    modal.style.display = 'none';
}

// Закрыть модальное окно при клике вне окна
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Обработчик отправки формы
//     infoForm.addEventListener('submit', function (e) {
//         e.preventDefault();
//
//         const formData = new FormData(infoForm);
//         const jsonData = {};
//         formData.forEach((value, key) => {
//             jsonData[key] = value
//         });
//
//         const jsonDataString = JSON.stringify(jsonData);
//
// //отправить данные на сервер или сохранить локально в файл waybill.json
//         console.log(jsonDataString);
//
//         modal.style.display = 'none'; // Закрываем модальное окно
//     });



