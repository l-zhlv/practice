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

function searchInJSON(searchValue) {
    fetch('../json/waybill.json')
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(item => {
                // Преобразуем все свойства объекта в нижний регистр для удобства сравнения
                const lowerCaseItem = Object.keys(item).reduce((acc, key) => {
                    acc[key] = typeof item[key] === 'string' ? item[key].toLowerCase() : item[key];
                    return acc;
                }, {});

                // Проверяем, есть ли в свойствах объекта значение, содержащее искомую строку
                return Object.values(lowerCaseItem).some(value => typeof value === 'string' && value.includes(searchValue.toLowerCase()));
            });

            // Отображаем отфильтрованные записи на странице
            displayFilteredData(filteredData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayFilteredData(data) {
    const tableBody = document.querySelector('#waybillTable tbody');
    tableBody.innerHTML = ''; // Очищаем содержимое таблицы

    data.forEach(waybill => {
        let row = document.createElement('tr');

        tableBody.appendChild(row);
    });

    // Пересчитываем пагинацию
    const pageCount = Math.ceil(data.length / rowsCount);
    CreatePagination(pageCount, 1, pagination);
}

// Функция для поиска на странице
function searchTable() {
    const input = document.querySelector('input[name="s"]').value; // Ввод искомого значения
    searchInJSON(input);
}

document.querySelector('input[name="s"]').addEventListener('input', searchTable); // Получение введенной информации


// Получаем заголовки столбцов
let headers = waybillTable.querySelectorAll('th');

// Добавляем обработчик для каждого заголовка
headers.forEach((header, index) => {
    header.addEventListener('click', () => {
        let type = header.dataset.type; // Получаем тип данных столбца (например, 'number' или 'string')
        sortTableByColumn(index, type); // Вызываем функцию сортировки, передавая номер столбца и тип данных
    });
});

let sortOrder = {};

// Функция для сортировки таблицы по столбцу
function sortTableByColumn(colNum, type) {
    let tbody = waybillTable.querySelector('tbody');
    let rowsArray = Array.from(tbody.rows);

    if (type !== 'number') {
        return; // Игнорировать сортировку, если тип не является "number" (для цеха)

    }

// Выбор функции сортировки в зависимости от типа данных
    let compare;
    if (type === 'number') {
        compare = compareByNumber;
    } else {
        compare = compareByString;
    }

// Определение порядка сортировки
    if (!sortOrder[colNum] || sortOrder[colNum] === 'desc') {
        rowsArray.sort((row1, row2) => compare(row1, row2, colNum));
        sortOrder[colNum] = 'asc'; // Изменение порядка на возрастающий
    } else {
        rowsArray.reverse(); // Изменение порядка на убывающий
        sortOrder[colNum] = 'desc'; // Изменение порядка на убывающий
    }

// Обновление содержимого таблицы
    tbody.innerHTML = '';
    rowsArray.forEach(row => tbody.appendChild(row));
}

// Функция для сравнения чисел
function compareByNumber(row1, row2, colNum) {
    return parseInt(row1.cells[colNum].innerText) - parseInt(row2.cells[colNum].innerText);
}

// Функция для сравнения строк
function compareByString(row1, row2, colNum) {
    return row1.cells[colNum].innerText.localeCompare(row2.cells[colNum].innerText, undefined, {numeric: true});
}

// Добавление обработчиков событий на заголовки столбцов
document.querySelectorAll('.sortable').forEach((th, index) => {
    if (th.innerText === 'Цех') { // Добавьте проверку на текст заголовка 'Цех'
        th.addEventListener('click', () => {
            sortTableByColumn(index + 1, th.getAttribute('data-type'));
        });
    }
});

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
    const queryString = `id=${id}&waybillNumDepDate=${waybillNumDepDate}&waybillDateSend=${waybillDateSend}&waybillDepFrom=${waybillDepFrom}&waybillSender=${waybillSender}&waybillGetDate=${waybillGetDate}&waybillDepTo=${waybillDepTo}&waybillReceiver=${waybillReceiver}`;
    window.location.href = `../html/shows2.html?${queryString}`;
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

//для создания накладной
document.addEventListener('DOMContentLoaded', function () {
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('addWaybillModal');
    const span = document.getElementsByClassName('close')[0];

    openModalBtn.onclick = function () {
        modal.style.display = 'block';
    }

    span.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    document.getElementById('saveWaybillBtn').onclick = function (event) {
        event.preventDefault();
        const waybillData = JSON.parse(localStorage.getItem('waybillData')) || [];
        const newWaybill = {
            waybillID: Number(document.getElementById('waybillID').value),
            waybillNum: Number(document.getElementById('waybillNum').value),
            waybillDep: Number(document.getElementById('waybillDep').value),
            waybillDate: new Date().toISOString(),
            waybillDepFrom: Number(document.getElementById('waybillDepFrom').value),
            waybillDepTo: Number(document.getElementById('waybillDep').value),
            waybillSendDate: 0,
            waybillReceiveDate: 0,
            waybillSender: '',
            waybillReceiver: ''
        };

        waybillData.push(newWaybill);
        localStorage.setItem('waybillData', JSON.stringify(waybillData));

        const blob = new Blob([JSON.stringify(waybillData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'waybill.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        modal.style.display = 'none';
    }
});

