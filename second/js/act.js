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


//const listItems = document.querySelectorAll('#list li');


//функция для поиска на всех страницах (не работает :") )
// function searchAllPages(tableRows, searchValue) {
//     tableRows.forEach(row => {
//         const text = row.textContent.toLowerCase();
//         if (text.includes(searchValue)) {
//             row.style.display = '';
//         } else {
//             row.style.display = 'none';
//         }
//     });
// }

//функция для поиска на странице
function searchTable() {
    const input = document.querySelector('input[name="s"]').value.toLowerCase(); // ввод искомого значения
    const rows = document.querySelectorAll('#waybillTable tbody tr');

    searchAllPages(rows, input);
}

const ulTag = document.querySelector('.pagination ul');

document.querySelector('input[name="s"]').addEventListener('input', searchTable); //получение введенной информации


function main() {
    fetch('../json/waybill.json') //подключение файла с информацией
        .then(response => response.json()) //обрабатываем ответ на запрос и снова преобразуем в формат json
        .then(data => {
            const output = document.getElementById('output');
            const table = document.querySelector('#waybillTable tbody');

            // Параметры для пагинации
            const rowsPerPage = 10; // Количество строк на странице
            let currentPage = 1; // Текущая страница
            const allPages = Math.ceil(data.length / rowsPerPage);

            element(allPages, currentPage, rowsPerPage)

            function element(totalPages, page, rowsPerPage) {
                let liTag = ' ';//эlемент для вывода
                let activeLi;//активная страница
                let beforePages = page - 1; //предыдущая страница
                let afterPages = page + 1; //следующая страница
                if (page > 1) {
                    liTag += `<li class="btn prev" onclick="element(allPages, ${page - 1})"><span><i class="fas fa-angle-left"></i>Назад</span></li>`;
                }
                if (page > 2) {
                    liTag += `<li class = "numb" onclick="element(allPages, 1)"><span>1</span></li>`;
                    if (page > 3) {
                        liTag += `<li class = "dots"><span>...</span></li>`;
                    }
                }

                if (page == totalPages) {
                    beforePages = beforePages - 2;
                } else if (page == totalPages - 1) {
                    beforePages = beforePages - 1;
                }

                if (page == 1) {
                    afterPages = afterPages + 2;
                } else if (page == 2) {
                    afterPages = afterPages + 1;
                }

                for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
                    if (pageLength > totalPages) {
                        continue;
                    }
                    if (pageLength == 0) {
                        pageLength = pageLength + 1;
                    }
                    if (page == pageLength) {
                        activeLi = "active";
                    } else {
                        activeLi = "";
                    }
                    liTag += `<li class = "numb ${activeLi}" onclick="element(allPages, ${pageLength})"><span>${pageLength}</span></li>`;
                }

                if (page < totalPages - 1) {
                    if (page < totalPages - 2) {
                        liTag += `<li class = "dots"><span>...</span></li>`;
                    }
                    liTag += `<li class = "numb" onclick="element(allPages, ${allPages})"><span>${allPages}</span></li>`;
                }

                if (page < totalPages) {
                    liTag += `<li class="btn next" onclick="element(allPages, ${page + 1})"><span><i class="fas fa-angle-right"></i>Вперед</span></li>`;
                }
                ulTag.innerHTML = `${liTag}`;
                showPage(page, rowsPerPage)
            }

//функция для демонстрации данных
            function showInfo(start, end) {
                table.innerHTML = ''; // Очистить таблицу перед заполнением новыми данными

                data.slice(start, end).forEach(waybill => { //разбиваем данные
                    const row = document.createElement('tr');
                    row.classList.add("content");
                    row.setAttribute('id', `${waybill.waybillID}`); //получаем ID
                    row.addEventListener('click', function () { //функция для перехода на другую страницу
                        sendId(row.id, `${waybill.waybillNum}/${waybill.waybillDep} ${GetDate(waybill.waybillDate)}`, `${GetDateAndTime(waybill.waybillSendDate)}`, `${GetDateAndTime(waybill.waybillReceiveDate)}`); //получаем номер накладной для демонстрации на следующей странице
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

// Функция для отображения страниц
            function showPage(page, rowsPerPage) {
                const start = (page - 1) * rowsPerPage; //первая страница
                const end = start + rowsPerPage;
                showInfo(start, end); //вызов функции, показ разбитой страницы
            }

            //функция для получения ID и номера номенклатуры
            function sendId(id, waybillNumDepDate, waybillDateSend, waybillGetDate) {
                window.location.href = `../html/shows2.html?id=${id}&waybillNumDepDate=${waybillNumDepDate}&waybillDateSend=${waybillDateSend}&waybillGetDate=${waybillGetDate}`;
            }


            // Показать начальную страницу
            // showPage(currentPage);

            //Добавление кнопок для пагинации

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
    infoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(infoForm);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value
        });

        const jsonDataString = JSON.stringify(jsonData);

        // Здесь можно отправить данные на сервер или сохранить локально в файл waybill.json
        console.log(jsonDataString);

        modal.style.display = 'none'; // Закрываем модальное окно
    });
}

main();
