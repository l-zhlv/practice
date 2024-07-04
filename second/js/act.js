//Объявление структур для дальнейшего использования
// Структура для хранения информации о сортировке по возрастанию и убыванию
//структуры не спасли. сортировка цехов теперь через пень, зато полностью слетела сортировка по номеру :"")
const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};

// Структура для хранения информации о столбце (для цеха)
const TableColumn = {
    index: 0,
    type: 'number' //
};

// Структура для хранения данных о сортировке для каждого столбца
const ColumnSortState = {
    [TableColumn.index]: SortOrder.asc // Начальное состояние сортировки для первого столбца
};

// Структура для хранения информации о дате и времени
const DateTime = {
    day: 0,
    month: 0,
    year: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
};

// Форматирование даты и времени для столбцов отправления и получения
function GetDateAndTime(dateTimeString) {
    const date = new Date(dateTimeString); // Преобразование строки в формат даты и времени
    const dateTime = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    };
    return `${dateTime.day < 10 ? '0' + dateTime.day : dateTime.day}.${dateTime.month < 10 ? '0' + dateTime.month : dateTime.month}.${dateTime.year} 
    ${dateTime.hours < 10 ? '0' + dateTime.hours : dateTime.hours}:${dateTime.minutes < 10 ? '0' + dateTime.minutes : dateTime.minutes}:${dateTime.seconds < 10 ? '0' + dateTime.seconds : dateTime.seconds}`;
}

//форматирование даты и времени для столбца "номер накладной"
function GetDate(dateTimeString) {
    var dateTime = new Date(dateTimeString); //преобразование строки в формат даты
    var day = dateTime.getDate(); //получение дня из даты
    var month = dateTime.getMonth() + 1; //получение месяцв
    var year = dateTime.getFullYear(); //получение года
    return `${day < 10 ? '0' + day : day}${month < 10 ? '0' + month : month}${year}`; //вывод данных в нужной форме
}


function select_row(row) {
    row.parentNode.querySelectorAll('tr').forEach(row => row.classList.remove('selected')); // Удаляем класс 'selected' у всех строк
    row.classList.add('selected'); // Добавляем класс 'selected' кликнутой строке
}


// Функция для удаления ведущих нулей из строки (004, 084)
function removeLeadingZeros(str) {
    return str.replace(/^0+/, '');
}

// Функция для фильтрации по цехам
function filterTable() {
    // Получаем значения фильтров и убираем ведущие нули
    const depFrom = removeLeadingZeros(document.getElementById("waybillDepFrom2").value);
    const depTo = removeLeadingZeros(document.getElementById("waybillDepTo").value);

    // Получаем все строки таблицы
    const tableRows = document.querySelectorAll("#waybillTable tbody tr");
    const filteredRows = [];

    // Проходим по каждой строке таблицы и фильтруем их
    tableRows.forEach(row => {
        const depFromCell = removeLeadingZeros(row.querySelector("td:nth-child(3)").textContent); // указание колонки с цехом отправления
        const depToCell = removeLeadingZeros(row.querySelector("td:nth-child(6)").textContent); // указание колонки с цехом получения

        // Проверяем соответствие фильтру
        if ((depFrom === "Цех" || depFrom === depFromCell) && (depTo === "Цех" || depTo === depToCell)) {
            filteredRows.push(row);
        }
    });

    // Скрыть все строки перед отображением отфильтрованных данных
    tableRows.forEach(row => {
        row.style.display = "none";
    });

    // Показать отфильтрованные строки
    filteredRows.forEach(row => {
        row.style.display = "";
    });

    // Пересчитать количество страниц и перестроить пагинацию
    const rowsPerPage = 10; // Задаем количество строк на странице
    const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
    CreatePagination(pageCount, 1, document.querySelector('.pagination'));

    // Показать первую страницу отфильтрованных данных
    showPage(1, rowsPerPage, filteredRows);
}

// Функция для показа конкретной страницы данных
function showPage(pageNumber, rowsPerPage, filteredRows) {
    const start = (pageNumber - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    filteredRows.forEach(row => {
        row.style.display = "none";
    });

    for (let i = start; i < end && i < filteredRows.length; i++) {
        filteredRows[i].style.display = "";
    }
}

// Добавляем обработчики событий на изменение фильтров
document.getElementById("waybillDepFrom2").addEventListener("change", filterTable);
document.getElementById("waybillDepTo").addEventListener("change", filterTable);

// Функция для фильтрации и сортировки по именам
function filterAndSortTable() {
    // Получаем значения фильтров и убираем ведущие нули
    const sender = document.getElementById("waybillSender").value;
    const receiver = document.getElementById("waybillReceiver").value;

    // Получаем все строки таблицы
    const tableRows = document.querySelectorAll("#waybillTable tbody tr");
    const filteredRows = [];

    // Проходим по каждой строке таблицы и фильтруем их
    tableRows.forEach(row => {
        const senderCell = row.querySelector("td:nth-child(4)").textContent; // указание колонки с отправителем
        const receiverCell = row.querySelector("td:nth-child(7)").textContent; // указание колонки с получателем

        // Проверяем соответствие фильтру
        if ((sender === "Отправитель" || sender === senderCell) && (receiver === "Получатель" || receiver === receiverCell)) {
            filteredRows.push(row);
        }
    });

    // Сортировка по именам отправителей
    filteredRows.sort((a, b) => {
        const senderA = a.querySelector("td:nth-child(2)").textContent;
        const senderB = b.querySelector("td:nth-child(2)").textContent;
        return senderA.localeCompare(senderB);
    });

    // Скрыть все строки перед отображением отфильтрованных данных
    tableRows.forEach(row => {
        row.style.display = "none";
    });

    // Показать отфильтрованные строки
    filteredRows.forEach(row => {
        row.style.display = "";
    });

    // Пересчитать количество страниц и перестроить пагинацию
    const rowsPerPage = 10; // Задаем количество строк на странице
    const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
    CreatePagination(pageCount, 1, document.querySelector('.pagination'));

    // Показать первую страницу отфильтрованных данных
    showPage(1, rowsPerPage, filteredRows);
}


// Добавляем обработчики событий на изменение фильтров
document.getElementById("waybillSender").addEventListener("change", filterAndSortTable);
document.getElementById("waybillReceiver").addEventListener("change", filterAndSortTable);

function searchInJSON(searchValue) {
    // Загружаем JSON-файл с данными о накладных
    fetch('../json/waybill.json')
        .then(response => response.json())
        .then(data => {
            // Фильтруем данные, оставляя только записи, содержащие искомую строку
            const filteredData = data.filter(item => {
                // Структура для хранения свойств объекта в нижнем регистре
                const lowerCaseItem = Object.keys(item).reduce((acc, key) => {
                    // Преобразование в нижний регистр
                    acc[key] = typeof item[key] === 'string' ? item[key].toLowerCase() : item[key];
                    return acc;
                }, {});

                // Проверка на наличие искомой строки
                return Object.values(lowerCaseItem).some(value => typeof value === 'string' && value.includes(searchValue.toLowerCase()));
            });

            // Отображение отфильтрованных записей на странице
            displayFilteredData(filteredData);
        })
        .catch(error => {
            // Выводим ошибку, если произошла ошибка при получении данных
            console.error('Error fetching data:', error);
        });
}

//функция для отображения данных с учетом поиска
function displayFilteredData(data) {
    const tableBody = document.querySelector('#waybillTable tbody');
    tableBody.innerHTML = ''; // Очищаем содержимое таблицы

    data.forEach(waybill => {
        const row = {
            element: document.createElement('tr'),
            firstColumn: document.createElement('td'),
            sendDate: document.createElement('td'),
            depFrom: document.createElement('td'),
            sender: document.createElement('td'),
            receiveDate: document.createElement('td'),
            depTo: document.createElement('td'),
            receiver: document.createElement('td')
        };

        // Настройка строки
        row.element.classList.add("content");
        row.element.setAttribute('id', waybill.waybillID);

        // Обработчик клика по строке
        row.element.addEventListener('click', function () {
            select_row(row.firstColumn); // Выделение строки
            sendId(
                row.element.id,
                `${waybill.waybillNum}/${waybill.waybillDep} ${GetDate(waybill.waybillDate)}`,
                GetDateAndTime(waybill.waybillSendDate),
                waybill.waybillDepFrom,
                waybill.waybillSender,
                GetDateAndTime(waybill.waybillReceiveDate),
                waybill.waybillDepTo,
                waybill.waybillReceiver
            );
        });

        // Настройка первой колонки
        row.firstColumn.addEventListener('click', () => select_row(row.firstColumn));
        row.firstColumn.style.textAlign = "right";
        row.firstColumn.innerHTML = `${waybill.waybillNum}/${waybill.waybillDep} ${GetDate(waybill.waybillDate)}`;
        row.element.appendChild(row.firstColumn);

        // Настройка колонки с датой отправки
        row.sendDate.innerText = GetDateAndTime(waybill.waybillSendDate);
        row.sendDate.style.textAlign = "left";
        row.element.appendChild(row.sendDate);

        // Настройка колонки с отделением отправления
        row.depFrom.innerText = waybill.waybillDepFrom;
        row.depFrom.style.textAlign = "right";
        row.element.appendChild(row.depFrom);

        // Настройка колонки с отправителем
        row.sender.innerText = waybill.waybillSender;
        row.sender.style.textAlign = "left";
        row.element.appendChild(row.sender);

        // Настройка колонки с датой получения
        row.receiveDate.innerText = GetDateAndTime(waybill.waybillReceiveDate);
        row.receiveDate.style.textAlign = "left";
        row.element.appendChild(row.receiveDate);

        // Настройка колонки с отделением назначения
        row.depTo.dataset.value = waybill.waybillDepTo;
        row.depTo.innerText = waybill.waybillDepTo;
        row.depTo.style.textAlign = "right";
        row.element.appendChild(row.depTo);

        // Настройка колонки с получателем
        row.receiver.innerText = waybill.waybillReceiver;
        row.receiver.style.textAlign = "left";
        row.element.appendChild(row.receiver);

        // Добавляем строку в таблицу
        tableBody.appendChild(row.element);
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


// Функция сравнения чисел
function compareByNumber(row1, row2, column) {
    return parseInt(row1.cells[column.index].innerText) - parseInt(row2.cells[column.index].innerText);
}

// Функция сравнения строк
function compareByString(row1, row2, column) {
    return row1.cells[column.index].innerText.localeCompare(row2.cells[column.index].innerText, undefined, {numeric: true});
}

// Функция сортировки таблицы по столбцу
function sortTableByColumn(column, order) {
    const tbody = waybillTable.querySelector('tbody');
    const rowsArray = Array.from(tbody.rows);

    let compareFunction;

    switch (column.type) {
        case 'number':
            compareFunction = compareByNumber;
            break;
        case 'string':
            compareFunction = compareByString;
            break;
        default:
            return; // Игнорировать сортировку, если тип не поддерживается
    }

    if (order === SortOrder.desc) {
        rowsArray.sort((row1, row2) => compareFunction(row1, row2, column));
        ColumnSortState[column.index] = SortOrder.asc;
    } else {
        rowsArray.reverse();
        ColumnSortState[column.index] = SortOrder.desc;
    }

    tbody.innerHTML = '';
    rowsArray.forEach(row => tbody.appendChild(row));
}

// Получаем все заголовки таблицы
const headers = waybillTable.querySelectorAll('th');

// Добавляем обработчик события для каждого заголовка
headers.forEach((header, index) => {
    header.addEventListener('click', () => {
        const column = {
            index: index + 1, // Индекс столбца (с учетом индексации с 0)
            type: header.dataset.type // Тип данных столбца
        };
        sortTableByColumn(column, ColumnSortState[column.index]); // Вызываем сортировку, передавая структуру столбца и текущее состояние сортировки
    });
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
                    <td onclick='select_row(this)' style="text-align: right;">${waybill.waybillNum}/${waybill.waybillDep} ${waybill.waybillDate ? GetDate(waybill.waybillDate) : ''}</td>
                    <td onclick='select_row(this)' style="text-align: left;">${waybill.waybillSendDate ? GetDateAndTime(waybill.waybillSendDate) : ''}</td> <!-- проверка на наличие значения даты -->
                    <td onclick='select_row(this)' style="text-align: right;">${waybill.waybillDepFrom}</td>
                    <td onclick='select_row(this)' style="text-align: left;">${waybill.waybillSender}</td>
                    <td onclick='select_row(this)' style="text-align: left;">${waybill.waybillReceiveDate ? GetDateAndTime(waybill.waybillReceiveDate) : ''}</td> <!-- проверка на наличие значения даты -->
                    <td onclick='select_row(this)' style="text-align: right;">${waybill.waybillDepTo}</td>
                    <td onclick='select_row(this)' style="text-align: left;">${waybill.waybillReceiver}</td>
                    `;
                table.appendChild(row);
            })
        }

        const tableBody = document.querySelector('.table tbody')
        const pagination = document.querySelector('.pagination');
        let rowsCount = 10;//количество строк данных на одной странице
        let active; //переменная для хранения активной кнопки отобращения страницы
        let pageCount = Math.ceil(data.length / rowsCount)//количество страниц с данными

        CreatePagination(pageCount, 1, pagination)//вызов функции отрисовки пагинаци
    })


//функция для получения ID и номера номенклатуры
function sendId(id, waybillNumDepDate, waybillDateSend, waybillDepFrom, waybillSender, waybillGetDate, waybillDepTo, waybillReceiver) {
    const queryString = `id=${id}&waybillNumDepDate=${waybillNumDepDate}&waybillDateSend=${waybillDateSend}&waybillDepFrom=${waybillDepFrom}&waybillSender=${waybillSender}&waybillGetDate=${waybillGetDate}&waybillDepTo=${waybillDepTo}&waybillReceiver=${waybillReceiver}`;
    window.location.href = `../html/shows2.html?${queryString}`;
}


// для создания накладной
document.addEventListener('DOMContentLoaded', function () {
    const modalElements = { //структура для хранения элементов модального окна
        openModalBtn: document.getElementById('openModalBtn'), //ссылка на кнопку открытия
        modal: document.getElementById('addWaybillModal'), //ссылка на само окно
        span: document.getElementsByClassName('close')[0], //ссылка для закрытия
        saveWaybillBtn: document.getElementById('saveWaybillBtn') //ссылка на кнопку для сохранения
    };

    //обработчик клика для открытия модального окна
    modalElements.openModalBtn.onclick = function () {
        modalElements.modal.style.display = 'block';
    }

    //обработчик клика для закрытия
    modalElements.span.onclick = function () {
        modalElements.modal.style.display = 'none';
    }

    //обработчик для закрытия при клике на любую область вне окна
    window.onclick = function (event) {
        if (event.target == modalElements.modal) {
            modalElements.modal.style.display = 'none';
        }
    }

    //обработчик клика сохранения
    modalElements.saveWaybillBtn.onclick = function (event) {
        event.preventDefault();
        //получаем данные
        const waybillData = JSON.parse(localStorage.getItem('waybillData')) || [];

        //создание нового объекта в накладной
        const newWaybill = {
            waybillID: Number(document.getElementById('waybillID').value),
            waybillNum: Number(document.getElementById('waybillNum').value),
            waybillDep: Number(document.getElementById('waybillDep').value),
            waybillDate: new Date().toISOString(),
            waybillDepFrom: Number(document.getElementById('waybillDepFrom').value),
            waybillDepTo: Number(document.getElementById('waybillDep').value),
            waybillSendDate: null,
            waybillReceiveDate: null,
            waybillSender: '',
            waybillReceiver: ''
        };

        //добавить новую накладную в массив и сохранить в localStorage
        waybillData.push(newWaybill);
        localStorage.setItem('waybillData', JSON.stringify(waybillData));

        // Создаем Blob с данными в формате JSON и ссылку для скачинвания нового файла
        const blob = new Blob([JSON.stringify(waybillData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'waybill.json'; //оставляем имя без изменений для замены
        document.body.appendChild(a);
        a.click(); // клик по ссылке

        //удаляем ссылку и временный URL
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        //скрыть модальное окно
        modalElements.modal.style.display = 'none';
    }
});

