GetNomenclatureWaybillID(); //вызов функции для отображения
GetPassportWaybillID(); //вызов функции для отображения таблицы с номенклатурой


//функция для удаления таблицы СП
function ClearPassportTable() {
    const tableBody = document.querySelector('#passportTable tbody');
    tableBody.innerHTML = ''; // Очищение содержимого tbody
}


ClearPassportTable(); //очистить таблицу с паспортом

// Загрузка данных из waybill.json и сохранение их в локальное хранилище
fetch('../json/waybill.json')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('waybillData', JSON.stringify(data)); // Сохранение JSON-объекта с данными в локальное хранилище под ключом 'waybillData'
    });

// Загрузка данных из nomenclature.json и сохранение их в локальное хранилище
fetch('../json/nomenclature.json')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('nomenclatureData', JSON.stringify(data));
    });

// Загрузка данных из passport.json и сохранение их в локальное хранилище
fetch('../json/passport.json')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('passportData', JSON.stringify(data));
    });

document.getElementById('nomTable').addEventListener('click', function (event) {
    const secondTable = document.getElementById('passportTable');
    const tableBody = document.querySelector('#passportTable tbody');

    // Проверяем, был ли клик по ячейке таблицы
    if (event.target.tagName === 'TD') {
        const currentRow = event.target.closest('tr'); // Находим строку, в которой был клик
        const waybillID = currentRow.querySelector('td:first-child').textContent; // Получаем ID накладной из первой ячейки строки

        // Структура для хранения элементов второй таблицы
        const secondTableElements = {
            tableBody: tableBody, // Тело таблицы
            rows: [] // Массив строк таблицы
        };

        // Проверяем, скрыта ли вторая таблица
        if (secondTable.classList.contains('hidden')) {
            // Показываем вторую таблицу
            secondTable.classList.remove('hidden'); // Удаляем класс 'hidden', делая таблицу видимой
            secondTable.classList.add('full-width'); // Добавляем класс 'full-width', чтобы таблица занимала всю ширину
            secondTableElements.tableBody.innerHTML = ''; // Очищаем тело таблицы

            // Загружаем данные о паспорте из JSON-файла
            fetch('../json/passport.json')
                .then(response => response.json()) // Преобразуем ответ сервера в формат JSON
                .then(data => {
                    // Фильтруем данные, оставляя только записи с соответствующим ID накладной
                    let needData = data.filter(passport => passport.waybillID == waybillID);

                    // Отрисовка данных в таблицу
                    needData.forEach(passport => {
                        // Структура для хранения строки
                        const row = {
                            element: document.createElement('tr'), // Создаем элемент строки
                            cells: [] // Массив ячеек строки
                        };

                        // Отрисовка ячеек строки
                        Object.values(passport).forEach(value => {
                            // Структура для хранения ячейки
                            const cell = {
                                element: document.createElement('td'), // Создаем элемент ячейки
                                content: value // Сохраняем значение ячейки
                            };

                            // Если значение не равно 0, добавляем текст в ячейку
                            if (value !== 0) {
                                cell.element.textContent = cell.content;
                            }

                            // Добавляем ячейку в строку
                            row.element.appendChild(cell.element);
                            row.cells.push(cell.element);
                        });

                        // Добавляем строку в таблицу
                        secondTableElements.tableBody.appendChild(row.element);
                        secondTableElements.rows.push(row.element);
                    });
                });
        } else {
            // Скрываем вторую таблицу
            secondTable.classList.add('hidden'); // класс 'hidden', делаем таблицу невидимой
            secondTable.classList.remove('full-width'); // Удалить класс 'full-width', чтобы таблица не занимала всю ширину
            secondTableElements.tableBody.innerHTML = ''; // Очистить тело таблицы
        }
    }
});

function GetNomenclatureWaybillID() {
    const tableBody = document.querySelector('#nomTable tbody');
    const passportTable = document.querySelector('#passportTable');
    //const hidePassportTableButton = document.getElementById('hidePassportTableButton');

    // Структура для хранения элементов страницы
    const pageElements = {
        waybillNumDepDate: document.querySelector('.waybillNum'),
        waybillSenDate: document.querySelector('.waybillSenDate'),
        waybillDepsFrom: document.querySelector('.waybillDepsFrom'),
        waybillSending: document.querySelector('.waybillSending'),
        waybillRecDate: document.querySelector('.waybillRecDate'),
        waybillDeppTo: document.querySelector('.waybillDeppTo'),
        waybillReceiver: document.querySelector('.waybillReceiver')
    };

    // Получение данных из URL-параметров
    new URLSearchParams(window.location.search).forEach((value, name) => {
        const waybillID = value; // ID накладной
        const waybillNumDepDate = new URLSearchParams(window.location.search).get('waybillNumDepDate');
        const waybillDateSend = new URLSearchParams(window.location.search).get('waybillDateSend');
        const waybillDepFrom = new URLSearchParams(window.location.search).get('waybillDepFrom');
        const waybillSender = new URLSearchParams(window.location.search).get('waybillSender');
        const waybillGetDate = new URLSearchParams(window.location.search).get('waybillGetDate');
        const waybillDepTo = new URLSearchParams(window.location.search).get('waybillDepTo');
        const waybillReceiver = new URLSearchParams(window.location.search).get('waybillReceiver');

        // Установка данных на странице
        pageElements.waybillNumDepDate.innerHTML = waybillNumDepDate;
        pageElements.waybillSenDate.innerHTML = waybillDateSend;
        pageElements.waybillDepsFrom.innerHTML = waybillDepFrom;
        pageElements.waybillSending.innerHTML = waybillSender;
        pageElements.waybillRecDate.innerHTML = waybillGetDate;
        pageElements.waybillDeppTo.innerHTML = waybillDepTo;
        pageElements.waybillReceiver.innerHTML = waybillReceiver;

        // Загрузка данных о номенклатуре из JSON-файла
        fetch('../json/nomenclature.json')
            .then(response => response.json())
            .then(data => {
                // Фильтруем данные, оставляя только записи с соответствующим ID накладной
                let needData = data.filter(nomenclature => nomenclature.waybillID == waybillID);

                needData.forEach(nomenclature => {
                    // Структура для хранения строки
                    const row = {
                        element: document.createElement('tr'),
                        cells: [] // Массив ячеек строки
                    };

                    // Отрисовка ячеек строки
                    for (let item in nomenclature) {
                        if (Object.prototype.hasOwnProperty.call(nomenclature, item) && item !== 'waybillID' && item !== 'nomenclatureID') {
                            // Структура для хранения ячейки
                            const cell = {
                                element: document.createElement('td'),
                                content: nomenclature[item]
                            };

                            if (cell.content !== 0) {
                                cell.element.textContent = cell.content;
                            }

                            // Добавляем ячейку в строку
                            row.element.appendChild(cell.element);
                            row.cells.push(cell.element);
                        }
                    }

                    // Добавляем обработчик клика по строке
                    row.element.addEventListener('click', function () {
                        GetPassportWaybillID(waybillID);
                        passportTable.style.display = 'table';
                        //hidePassportTableButton.style.display = 'block';
                    });

                    // Добавляем строку в таблицу
                    tableBody.appendChild(row.element);
                });
            });
    });
}

const rows = document.querySelectorAll("#nomTable tr");


//функция для отображения таблицы с СП
function GetPassportWaybillID() {
    ClearPassportTable(); // Очистка таблицы паспортов перед загрузкой новых данных

    const tableBody = document.querySelector('#passportTable tbody'); // Получение тела таблицы паспортов

    // Получение waybillID из URL-параметров
    new URLSearchParams(window.location.search).forEach((value, name) => {
        let waybillID = value; // Извлечение значения waybillID из URL-параметров

        // Запрос к JSON-файлу с данными о паспортах
        fetch('../json/passport.json')
            .then(response => response.json()) // Преобразование ответа сервера в JSON-объект
            .then(data => {
                // Фильтрация данных о паспортах по waybillID
                let needData = data.filter(passport => passport.waybillID == waybillID);

                // Добавление данных о паспортах в таблицу
                needData.forEach(passport => {
                    let row = document.createElement('tr'); // Создание новой строки в таблице

                    // Проход по свойствам объекта 'passport'
                    for (let item in passport) {
                        // Проверка, является ли свойство 'passport' собственным (не наследуемым) и не является waybillID, passportID или nomenclatureID
                        if (Object.prototype.hasOwnProperty.call(passport, item) && item !== 'waybillID' && item !== 'passportID' && item !== 'nomenclatureID') {
                            let cell = document.createElement('td'); // Создание ячейки в таблице

                            // Добавление значения свойства в ячейку, если оно не равно 0
                            if (passport[item] !== 0) {
                                cell.textContent = passport[item];
                            }
                            row.appendChild(cell); // Добавление ячейки в строку
                        }
                    }
                    tableBody.appendChild(row); // Добавление строки в таблицу
                });
            });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var lastClickedRow = null;

    var rows = document.querySelectorAll('#nomTable tr');
    if (rows.length === 0) {
        console.error('No rows found in #nomTable');
        return;
    }

    var passportTable = document.getElementById('passportTable');
    if (!passportTable) {
        console.error('No element with id #passportTable found');
        return;
    }

    rows.forEach(function (row) {
        row.addEventListener('click', function () {
            if (lastClickedRow === row) {
                // Если кликнули на ту же строку, переключаем видимость таблицы
                passportTable.classList.toggle('hidden');
            } else {
                // Если кликнули на другую строку, показываем таблицу
                passportTable.classList.remove('hidden');
            }

            // Обновляем последнюю кликнутую строку
            lastClickedRow = row;
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Получаем элементы модального окна и кнопки закрытия
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close');
    const saveButton = document.getElementById('saveChanges');
    const confirmDeleteButton = document.getElementById('confirmDeleteBtn'); // Кнопка "Подтвердить удаление"

    // Структура для хранения данных формы
    const formData = {
        waybillNumDepDate: '',
        waybillSenDate: '',
        waybillDepsFrom: '',
        waybillSending: '',
        waybillRecDate: '',
        waybillDeppTo: '',
        waybillReceiver: ''
    };

    // Открыть модальное окно при клике на кнопку "Редактировать накладную"
    document.getElementById('edit-button').addEventListener('click', function () {
        modal.style.display = 'block';
        fillModalWithData(); // Заполнить поля модального окна данными из шапки таблицы
    });

    // Закрыть модальное окно при клике на крестик или вне окна
    const closeAction = function () {
        modal.style.display = 'none';
    };

    closeButton.addEventListener('click', closeAction);

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeAction();
        }
    });

    // Функция для заполнения полей модального окна данными из шапки таблицы
    function fillModalWithData() {
        // Получение всех элементов с классом 'modal-field' (поля ввода в модальном окне)
        const fields = document.querySelectorAll('.modal-field');

        // Перебор всех полей ввода в модальном окне
        fields.forEach(field => {
            // Извлечение имени поля из ID элемента, удаляя "waybill"
            const fieldName = field.id.replace('waybill', '');

            // Сохранение значения поля ввода в объект formData
            formData[fieldName] = field.textContent;
        });

        // Обновление полей модального окна данными из formData
        updateModalFields();
    }

// Функция для обновления полей модального окна данными из formData
    function updateModalFields() {
        // Проход по всем ключам объекта formData
        for (const key in formData) {
            // Проверка, является ли ключ собственным (не наследуемым) свойством объекта formData
            if (Object.prototype.hasOwnProperty.call(formData, key)) {
                // Нахождение элемента с ID, составленным из "waybill" и имени ключа
                document.getElementById(`waybill${key}`).value = formData[key];
                // Запись значения из formData в поле ввода модального окна
            }
        }
    }

    // Обработчик события нажатия на кнопку "Сохранить изменения"
    saveButton.addEventListener('click', function () {
        const fields = document.querySelectorAll('.modal-field');
        fields.forEach(field => {
            const fieldName = field.id.replace('waybill', '');
            formData[fieldName] = field.value;
        });
        updateTableData(); //обновить данные в таблице
        closeModal(); //закрыть модальное окно
        saveChangesToJSON(); //сохранить изменения в файле
    });

    // Функция для обновления данных в таблице
    function updateTableData() {
        const fields = document.querySelectorAll('.table-field'); // Получаем все элементы с классом 'table-field' (поля ввода в таблице)
        fields.forEach(field => {
            const fieldName = field.classList.contains('waybillID') ? 'ID' : field.classList[0].replace('waybill', ''); // Извлекаем имя поля

            const correspondingField = document.querySelector(`.waybill${fieldName}`); // Находим элемент в таблице с соответствующим именем поля
            if (correspondingField) {
                correspondingField.textContent = formData[fieldName]; // Обновляем текст элемента в таблице значением из `formData` по имени поля
            }
        });
    }

    // Функция для закрытия модального окна
    function closeModal() {
        modal.style.display = 'none';
    }


    // Функция для сохранения изменений в JSON файл
    function saveChangesToJSON() {
        // Запрос к JSON-файлу 'waybill.json' для получения данных
        fetch('../json/waybill.json')
            .then(response => response.json()) // Преобразование ответа сервера в JSON-объект
            .then(data => {
                // Идентификатор записи, которую нужно обновить (предположим, что он равен 0)
                const idToUpdate = 0;
                // Поиск записи в JSON-данных, соответствующей idToUpdate
                const updatedEntry = data.find(entry => entry.waybillID === idToUpdate);

                // Если запись найдена
                if (updatedEntry) {
                    // Проход по ключам объекта formData
                    Object.keys(formData).forEach(key => {
                        // Обновление значений в записи updatedEntry значениями из formData
                        updatedEntry[key] = formData[key];
                    });

                    // Преобразование обновленных JSON-данных в строку
                    const updatedData = JSON.stringify(data, null, 2);

                    // Создание объекта Blob с обновленными JSON-данными
                    const blob = new Blob([updatedData], {type: 'application/json'});

                    // Получение URL объекта Blob
                    const url = URL.createObjectURL(blob);

                    // Создание ссылки для загрузки файла
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'waybill.json';
                    a.click(); // Запуск загрузки файла
                }
            });
    }
});


document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const waybillIDToDelete = urlParams.get('id');

    deleteWaybillByID(waybillIDToDelete);

    document.getElementById('myModal').style.display = 'none';
});


document.addEventListener('DOMContentLoaded', function () {
    // Получение необходимых элементов из DOM
    const addPassportBtn = document.getElementById('addPassportBtn');
    const modal = document.getElementById('addPassportModal');
    const span = document.getElementsByClassName('close')[0];
    const params = new URLSearchParams(window.location.search);

     // Получение параметров из URL
    const waybillID = params.get('id');
    const waybillNumDepDate = params.get('waybillNumDepDate');
    const waybillDateSend = params.get('waybillDateSend');
    const waybillDepFrom = params.get('waybillDepFrom');
    const waybillSender = params.get('waybillSender');
    const waybillGetDate = params.get('waybillGetDate');
    const waybillDepTo = params.get('waybillDepTo');
    const waybillReceiver = params.get('waybillReceiver');

    // Открытие модального окна и установка ID накладной
    addPassportBtn.onclick = function () {
        document.getElementById('waybillID').value = waybillID || ''; // Если waybillID отсутствует, установите пустую строку
        modal.style.display = 'block';
    }

    // Закрытие модального окна
    span.onclick = function () {
        modal.style.display = 'none';
    }

    // Закрытие модального окна при клике вне его области
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Сохранение данных
    document.getElementById('savePassportBtn').onclick = function () {
        const passportData = JSON.parse(localStorage.getItem('passportData')) || [];
        const newPassport = {
            waybillID: Number(document.getElementById('waybillID').value),
            passportID: Number(document.getElementById('passportID').value),
            nomenclatureID: Number(document.getElementById('nomenclatureID').value),
            passportNum: Number(document.getElementById('passportNum').value),
            passportDep: Number(document.getElementById('passportDep').value),
            passportYear: Number(document.getElementById('passportYear').value),
            quantityDetails: Number(document.getElementById('quantityDetails').value),
            quantityWorkpieces: Number(document.getElementById('quantityWorkpieces').value),
            quantitySamples: Number(document.getElementById('quantitySamples').value)
        };

        passportData.push(newPassport);
        localStorage.setItem('passportData', JSON.stringify(passportData));
        downloadJSON(passportData, 'passport.json'); // Вызов функции для скачивания данных в виде файла
        modal.style.display = 'none'; // Закрытие модального окна после сохранения данных
    }
});

// Функция для скачивания JSON-данных в виде файла
function downloadJSON(data, filename) {
    // Создаем Blob из JSON-данных
    const file = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});

    // Создаем ссылку для скачивания файла
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;

    // Добавляем ссылку на страницу, запускаем скачивание и очищаем после завершения
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

// Находим кнопку удаления накладной по ID и назначаем обработчик события
const deleteWaybillBtn = document.getElementById('deleteButton');

deleteWaybillBtn.onclick = function () {
    // Получаем ID накладной из параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Получаем данные накладной из localStorage или создаем новый массив
    let waybillData = JSON.parse(localStorage.getItem('waybillData')) || [];

    // Находим индекс накладной в массиве по ID
    const waybillIndex = waybillData.findIndex(w => w.waybillID == id);

    if (waybillIndex !== -1) {
        // Удаляем накладную из массива по индексу
        waybillData.splice(waybillIndex, 1);

        // Обновляем данные в localStorage
        localStorage.setItem('waybillData', JSON.stringify(waybillData));

        // Создаем Blob с обновленными данными и скачиваем их в виде файла
        const blob = new Blob([JSON.stringify(waybillData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'waybill.json';
        document.body.appendChild(a);
        a.click();

        // Удаляем ссылку после завершения скачивания
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};


//отправить накладную
document.addEventListener('DOMContentLoaded', function () {
    const sendWaybillBtn = document.getElementById('sendWaybillBtn');
    const senderModal = document.getElementById('SenderModal');
    const closeSenderModal = document.getElementsByClassName('close')[1];

    //обработчик кнопки отправления накладной
    sendWaybillBtn.onclick = function () {
        senderModal.style.display = 'block';
    }

    //обрабатываем клик закрытия окна
    closeSenderModal.onclick = function () {
        senderModal.style.display = 'none';
    }

    //обработчик для закрытия при клике на любую область вне окна
    window.onclick = function (event) {
        if (event.target == senderModal) {
            senderModal.style.display = 'none';
        }
    }

    const saveSenderBtn = document.getElementById('saveSenderBtn');


//обработка нажатия на кнопку отправления накладной
    saveSenderBtn.onclick = function () {
        const senderName = document.getElementById('senderName').value;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        const waybillData = JSON.parse(localStorage.getItem('waybillData')) || [];
        const waybill = waybillData.find(w => w.waybillID == id);

        if (waybill) {
            waybill.waybillSender = senderName;

            // Добавляем текущее время отправления в формате ISO
            const currentDate = new Date().toISOString();
            waybill.waybillSendDate = currentDate;

            localStorage.setItem('waybillData', JSON.stringify(waybillData));

            // Создаем Blob с данными в формате JSON и ссылку для скачинвания нового файла
            const blob = new Blob([JSON.stringify(waybillData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'waybill.json'; //оставляем имя без изменений для замены
            document.body.appendChild(a);
            a.click();// клик по ссылке
            //удаляем ссылку и временный URL
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        senderModal.style.display = 'none';
    }
});

//Получить накладную
document.addEventListener('DOMContentLoaded', function () {
    const getWaybillBtn = document.getElementById('getWaybillBtn');
    const receiverModal = document.getElementById('receiverModal');
    const closeModal = document.getElementsByClassName('close')[0];

    //обработчик кнопки получения накладной
    getWaybillBtn.onclick = function () {
        receiverModal.style.display = 'block';
    }

    //обрабатываем клик закрытия окна
    closeModal.onclick = function () {
        receiverModal.style.display = 'none';
    }

    //обработчик для закрытия при клике на любую область вне окна
    window.onclick = function (event) {
        if (event.target == receiverModal) {
            receiverModal.style.display = 'none';
        }
    }

    const saveReceiverBtn = document.getElementById('saveReceiverBtn');

    //обработка нажатия на кнопку сохранения
    saveReceiverBtn.onclick = function () {
        const receiverName = document.getElementById('receiverName').value;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        const waybillData = JSON.parse(localStorage.getItem('waybillData')) || [];
        const waybill = waybillData.find(w => w.waybillID == id);

        if (waybill) {
            waybill.waybillReceiver = receiverName;

            // Добавляем текущее время до секунд в формате ISO
            const currentDate = new Date().toISOString();
            waybill.waybillReceiveDate = currentDate;

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
        }

        receiverModal.style.display = 'none';
    }
});
