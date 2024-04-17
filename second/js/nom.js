GetPassportWaybillID(); //вызов функции для отображения таблицы с номенклатурой
GetNomenclatureWaybillID(); //вызов функции для отображения

//функция для удаления таблицы СП
function ClearPassportTable() {
    const tableBody = document.querySelector('#passportTable tbody');
    tableBody.innerHTML = ''; // Очищение содержимого tbody
}

//удаление данных из json (пока не работает (Т.Т) )
// document.getElementById('deleteButton').addEventListener('click', function() {
//     document.getElementById('myModal').style.display = 'block';
// });
//
// document.getElementById('cancelDeleteBtn').addEventListener('click', function() {
//     document.getElementById('myModal').style.display = 'none';
// });
//
 //вызов подтверждения
//  document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
//
//     document.getElementById('deleteButton').addEventListener('click', function() {
//     let waybillIDToDelete = 'waybillID';
//
//     let waybillData = JSON.parse(localStorage.getItem('waybillData'));
//     let nomenclatureData = JSON.parse(localStorage.getItem('nomenclatureData'));
//     let passportData = JSON.parse(localStorage.getItem('passportData'));
//
//     // Удаление записей с соответствующим waybillID из waybillData
//     waybillData = waybillData.filter(item => item.waybillID !== waybillIDToDelete);
//     localStorage.setItem('waybillData', JSON.stringify(waybillData));
//
//     // Удаление записей с соответствующим waybillID из nomenclatureData
//     nomenclatureData = nomenclatureData.filter(item => item.waybillID !== waybillIDToDelete);
//     localStorage.setItem('nomenclatureData', JSON.stringify(nomenclatureData));
//
//     // Удаление записей с соответствующим waybillID из passportData
//     passportData = passportData.filter(item => item.waybillID !== waybillIDToDelete);
//     localStorage.setItem('passportData', JSON.stringify(passportData));
//
//
// });
//
// });
ClearPassportTable();
GetPassportWaybillID();

fetch('../json/waybill.json')
.then(response => response.json())
.then(data => {
    localStorage.setItem('waybillData', JSON.stringify(data));
});

fetch('../json/nomenclature.json')
.then(response => response.json())
.then(data => {
    localStorage.setItem('nomenclatureData', JSON.stringify(data));
});

fetch('../json/passport.json')
.then(response => response.json())
.then(data => {
    localStorage.setItem('passportData', JSON.stringify(data));
});

document.getElementById('nomTable').addEventListener('click', function() {
    const secondTable = document.getElementById('passportTable');
    if (secondTable.style.display === 'none') {
        // Показываем вторую таблицу сразу под строкой первой таблицы
        secondTable.style.display = 'table';
        // Вставляем вторую таблицу после текущей строки
        const currentRow = this.querySelector('.content');
        currentRow.parentNode.insertBefore(secondTable, currentRow.nextSibling);
    } else {
        secondTable.style.display = 'none'; // Скрываем вторую таблицу
    }
});

//функция для отображения таблицы с номенклатурой
document.getElementById('nomTable').addEventListener('click', function (event) {
    const secondTable = document.getElementById('passportTable');
    const tableBody = document.querySelector('#nomTable tbody');

    if (event.target.tagName === 'TD') {
// Получаем текущую строку
        const currentRow = event.target.closest('tr');

// Проверяем, отображается ли уже вторая таблица для выбранной строки
        if (currentRow.nextSibling === secondTable) {
// Если отображается, скрываем вторую таблицу
            secondTable.style.display = 'none';
// Очищаем содержимое второй таблицы
            document.querySelector('#passportTable tbody').innerHTML = '';
        } else {
// Скрываем вторую таблицу для других строк таблицы
            if (document.querySelector('#passportTable tbody').innerHTML !== '') {
                document.querySelector('#passportTable tbody').innerHTML = '';
                secondTable.style.display = 'none';
            }

// Показываем вторую таблицу сразу под строкой первой таблицы
            secondTable.style.display = 'table';

// Вставляем вторую таблицу после текущей строки
            currentRow.parentNode.insertBefore(secondTable, currentRow.nextSibling);

// Получаем данные для второй таблицы
            let waybillID = currentRow.querySelector('td:first-child').textContent; // Предполагая, что waybillID находится в первой ячейке строки

            fetch('../json/passport.json')
                .then(response => response.json())
                .then(data => {
                    let needData = data.filter(passport => passport.waybillID == waybillID);

                    needData.forEach(passport => {
                        let row = document.createElement('tr');

                        Object.values(passport).forEach(value => {
                            let cell = document.createElement('td');
                            cell.textContent = value;
                            row.appendChild(cell);
                        });

                        document.querySelector('#passportTable tbody').appendChild(row);
                    });
                });
        }
    }
});
function GetNomenclatureWaybillID() {
    const tableBody = document.querySelector('#nomTable tbody');
    const passportTable = document.querySelector('#passportTable');
//const hidePassportTableButton = document.getElementById('hidePassportTableButton');

    new URLSearchParams(window.location.search).forEach((value, name) => {
        let waybillID = value;
        let waybillNumDepDate = new URLSearchParams(window.location.search).get('waybillNumDepDate');
        const WaybillFullNumber = document.querySelector('.waybillNum ');
        WaybillFullNumber.innerHTML = `${waybillNumDepDate}`;
        let waybillDateSend = new URLSearchParams(window.location.search).get('waybillDateSend');
        const waybillSenderDate = document.querySelector('.waybillSenDate ');
        waybillSenderDate.innerHTML = `${waybillDateSend}`;
        let waybillGetDate = new URLSearchParams(window.location.search).get('waybillGetDate');
        const WaybillreceiverDate = document.querySelector('.waybillRecDate ');
        WaybillreceiverDate.innerHTML = `${waybillGetDate}`;

        fetch('../json/nomenclature.json')
            .then(response => response.json())
            .then(data => {
                let needData = data.filter(nomenclature => nomenclature.waybillID == waybillID);

                needData.forEach(nomenclature => {
                    let row = document.createElement('tr');

                    for (let item in nomenclature) {
                        if (Object.prototype.hasOwnProperty.call(nomenclature, item) && item !== 'waybillID' && item !== 'nomenclatureID') {
                            let cell = document.createElement('td');
                            cell.textContent = nomenclature[item];
                            row.appendChild(cell);
                        }
                    }

                    row.addEventListener('click', function () {
                        GetPassportWaybillID(waybillID);
                        passportTable.style.display = 'table';
                        hidePassportTableButton.style.display = 'block';
                    });

                    tableBody.appendChild(row);
                });
            });
    });
}

const rows = document.querySelectorAll("#nomTable tr");


//функция для отображения таблицы с СП
function GetPassportWaybillID() {
    ClearPassportTable(); // Очистка таблицы перед построением новых данных
    const tableBody = document.querySelector('#passportTable tbody');

    new URLSearchParams(window.location.search).forEach((value, name) => {
        let waybillID = `${value}`;

        fetch('../json/passport.json') //подключение файла с СП
            .then(response => response.json()) //обрабатываем ответ на запрос и снова преобразуем в формат json
            .then(data => {
                let needData = data.filter(passport => passport.waybillID == waybillID); //фильтруем данные по значению waybillID

                needData.forEach(passport => {
                    let row = document.createElement('tr');

                    for (let item in passport) {
                        if (Object.prototype.hasOwnProperty.call(passport, item) && item !== 'waybillID' && item !== 'passportID' && item !== 'nomenclatureID') { //проверка на соответствие параметрам
                            let cell = document.createElement('td'); //сощдаем ячейку
                            cell.textContent = passport[item];//и помещаем в нее данные
                            row.appendChild(cell);
                        }
                    }

                    tableBody.appendChild(row);
                });
            });
    });
}


