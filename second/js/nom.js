GetPassportWaybillID(); //вызов функции для отображения таблицы с номенклатурой
GetNomenclatureWaybillID(); //вызов функции для отображения

//функция для удаления таблицы СП
function ClearPassportTable() {
    const tableBody = document.querySelector('#passportTable tbody');
    tableBody.innerHTML = ''; // Очищение содержимого tbody
}


// document.addEventListener('DOMContentLoaded', function () {
//     const modal = document.getElementById('modal');
//     const editButton = document.getElementById('edit-button');
//     const closeBtn = document.querySelector('.close');
//     const waybillDataDiv = document.getElementById('waybillData');
//
//     // Открыть модальное окно по нажатию на кнопку
//     editButton.addEventListener('click', function () {
//         modal.style.display = 'block';
//     });
//
//     // Закрыть модальное окно при клике на крестик
//     closeBtn.onclick = function () {
//         modal.style.display = 'none';
//     }
//
//     // Закрыть модальное окно при клике вне окна
//     window.onclick = function (event) {
//         if (event.target == modal) {
//             modal.style.display = 'none';
//         }
//     }
//
//
//     // Формирование HTML с данными из waybill
//     const waybillHTML = `
//             <p><strong>Номер накладной и место отправления:</strong> ${waybillNumDepDate}</p>
//             <p><strong>Дата отправления:</strong> ${waybillDateSend}</p>
//             <p><strong>Место отправления:</strong> ${waybillDepFrom}</p>
//             <p><strong>Отправитель:</strong> ${waybillSender}</p>
//             <p><strong>Дата получения:</strong> ${waybillGetDate}</p>
//             <p><strong>Место получения:</strong> ${waybillDepTo}</p>
//             <p><strong>Получатель:</strong> ${waybillReceiver}</p>
//         `;
//
//     // Вставка HTML с данными в модальное окно
//     waybillDataDiv.innerHTML = waybillHTML;
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

document.getElementById('nomTable').addEventListener('click', function (event) {
    const secondTable = document.getElementById('passportTable');
    const tableBody = document.querySelector('#nomTable tbody');

    if (event.target.tagName === 'TD') {
        const currentRow = event.target.closest('tr');

        if (currentRow.nextSibling === secondTable) {
            secondTable.style.display = 'none';
            document.querySelector('#passportTable tbody').innerHTML = '';
        } else {
            if (document.querySelector('#passportTable tbody').innerHTML !== '') {
                document.querySelector('#passportTable tbody').innerHTML = '';
                secondTable.style.display = 'none';
            }

            let waybillID = currentRow.querySelector('td:first-child').textContent;

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

                    // После построения второй таблицы, показываем ее и вставляем под текущую строку
                    secondTable.style.display = 'table';
                    const insertIndex = Array.from(currentRow.parentNode.children).indexOf(currentRow) + 1;
                    currentRow.parentNode.insertBefore(secondTable, currentRow.parentNode.children[insertIndex]);
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
        let waybillDepFrom = new URLSearchParams(window.location.search).get('waybillDepFrom');
        const waybillDepartFrom = document.querySelector('.waybillDepsFrom ');
        waybillDepartFrom.innerHTML = `${waybillDepFrom}`;

        let waybillSender = new URLSearchParams(window.location.search).get('waybillSender');
        const Waybillsends = document.querySelector('.waybillSending ');
        Waybillsends.innerHTML = `${waybillSender}`;

        let waybillGetDate = new URLSearchParams(window.location.search).get('waybillGetDate');
        const WaybillreceiverDate = document.querySelector('.waybillRecDate ');
        WaybillreceiverDate.innerHTML = `${waybillGetDate}`;
        let waybillDepTo = new URLSearchParams(window.location.search).get('waybillDepTo');
        const waybillDepartTo = document.querySelector('.waybillDeppTo ');
        waybillDepartTo.innerHTML = `${waybillDepTo}`;

        let waybillReceiver = new URLSearchParams(window.location.search).get('waybillReceiver');
        const waybillRec = document.querySelector('.waybillReceiver ');
        waybillRec.innerHTML = `${waybillReceiver}`;


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
    ClearPassportTable();
    const tableBody = document.querySelector('#passportTable tbody');

    new URLSearchParams(window.location.search).forEach((value, name) => {
        let waybillID = `${value}`;

        fetch('../json/passport.json')
            .then(response => response.json())
            .then(data => {
                let needData = data.filter(passport => passport.waybillID == waybillID);

                needData.forEach(passport => {
                    let row = document.createElement('tr');

                    for (let item in passport) {
                        if (Object.prototype.hasOwnProperty.call(passport, item) && item !== 'waybillID' && item !== 'passportID' && item !== 'nomenclatureID') {
                            let cell = document.createElement('td');
                            cell.textContent = passport[item];
                            row.appendChild(cell);
                        }
                    }

                    tableBody.appendChild(row);
                });
            });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close');
    const saveButton = document.getElementById('saveChanges');

    // Открыть модальное окно при клике на кнопку "Редактировать накладную"
    document.getElementById('edit-button').addEventListener('click', function () {
        modal.style.display = 'block';
        fillModalWithData(); // Заполнить поля модального окна данными из шапки таблицы
    });

    // Закрыть модальное окно при клике на крестик
    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Закрыть модальное окно при клике вне окна
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Функция для заполнения полей модального окна данными из шапки таблицы
    function fillModalWithData() {
        // Получить данные из шапки таблицы
        const waybillNumDepDate = document.querySelector('.waybillNum').textContent;
        const waybillSenDate = document.querySelector('.waybillSenDate').textContent;
        const waybillDepsFrom = document.querySelector('.waybillDepsFrom').textContent;
        const waybillSending = document.querySelector('.waybillSending').textContent;
        const waybillRecDate = document.querySelector('.waybillRecDate').textContent;
        const waybillDeppTo = document.querySelector('.waybillDeppTo').textContent;
        const waybillReceiver = document.querySelector('.waybillReceiver').textContent;

        // Заполнить поля модального окна данными из шапки таблицы
        document.getElementById('waybillNumDepDate').value = waybillNumDepDate;
        document.getElementById('waybillSenDate').value = waybillSenDate;
        document.getElementById('waybillDepsFrom').value = waybillDepsFrom;
        document.getElementById('waybillSending').value = waybillSending;
        document.getElementById('waybillRecDate').value = waybillRecDate;
        document.getElementById('waybillDeppTo').value = waybillDeppTo;
        document.getElementById('waybillReceiver').value = waybillReceiver;
    }

    // Обработчик события нажатия на кнопку "Сохранить изменения"
    saveButton.addEventListener('click', function () {
        // Получить новые значения из полей модального окна
        const waybillNumDepDate = document.getElementById('waybillNumDepDate').value;
        const waybillSenDate = document.getElementById('waybillSenDate').value;
        const waybillDepsFrom = document.getElementById('waybillDepsFrom').value;
        const waybillSending = document.getElementById('waybillSending').value;
        const waybillRecDate = document.getElementById('waybillRecDate').value;
        const waybillDeppTo = document.getElementById('waybillDeppTo').value;
        const waybillReceiver = document.getElementById('waybillReceiver').value;

        // Обновить данные в шапке таблицы
        document.querySelector('.waybillNum').textContent = waybillNumDepDate;
        document.querySelector('.waybillSenDate').textContent = waybillSenDate;
        document.querySelector('.waybillDepsFrom').textContent = waybillDepsFrom;
        document.querySelector('.waybillSending').textContent = waybillSending;
        document.querySelector('.waybillRecDate').textContent = waybillRecDate;
        document.querySelector('.waybillDeppTo').textContent = waybillDeppTo;
        document.querySelector('.waybillReceiver').textContent = waybillReceiver;

        // Закрыть модальное окно
        modal.style.display = 'none';
    });
});
function deleteWaybillByID(waybillID) {
    let waybillData = JSON.parse(localStorage.getItem('waybillData'));
    let nomenclatureData = JSON.parse(localStorage.getItem('nomenclatureData'));
    let passportData = JSON.parse(localStorage.getItem('passportData'));

    // Удаление записей с соответствующим waybillID из waybillData
    waybillData = waybillData.filter(item => item.waybillID !== waybillID);
    localStorage.setItem('waybillData', JSON.stringify(waybillData));

    // Удаление записей с соответствующим waybillID из nomenclatureData
    nomenclatureData = nomenclatureData.filter(item => item.waybillID !== waybillID);
    localStorage.setItem('nomenclatureData', JSON.stringify(nomenclatureData));

    // Удаление записей с соответствующим waybillID из passportData
    passportData = passportData.filter(item => item.waybillID !== waybillID);
    localStorage.setItem('passportData', JSON.stringify(passportData));
    

    // Перенаправление на предыдущую страницу
    history.back();
}

document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const waybillIDToDelete = urlParams.get('id');

    deleteWaybillByID(waybillIDToDelete);

    document.getElementById('myModal').style.display = 'none';
});

// Обработчик события нажатия на кнопку "Удалить накладную"
document.getElementById('deleteButton').addEventListener('click', function () {
    // Показать модальное окно подтверждения удаления
    document.getElementById('myModal').style.display = 'block';
});

// Обработчик события нажатия на кнопку "Отмена" в модальном окне
document.getElementById('cancelDeleteBtn').addEventListener('click', function () {
    // Скрыть модальное окно
    document.getElementById('myModal').style.display = 'none';
});

// Обработчик события нажатия на кнопку "Подтвердить удаление" в модальном окне
document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
    // Получаем ID накладной из параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    const waybillIDToDelete = urlParams.get('id');

    // Вызываем функцию удаления накладной по ID
    deleteWaybillByID(waybillIDToDelete);

    // Скрыть модальное окно после удаления
    document.getElementById('myModal').style.display = 'none';
});