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
GetPassportWaybillID(); //вызов функции для отображения таблицы с номенклатурой
GetNomenclatureWaybillID(); //вызов функции для отображения

//функция для удаления таблицы СП
function ClearPassportTable() {
    const tableBody = document.querySelector('#passportTable tbody');
    tableBody.innerHTML = ''; // Очищение содержимого tbody
}


document.addEventListener('DOMContentLoaded', function () {
        const modal = document.getElementById('modal');
        const editButton = document.getElementById('edit-button');
        const closeBtn = document.querySelector('.close');
        const waybillDataDiv = document.getElementById('waybillData');

        // Открыть модальное окно по нажатию на кнопку
        editButton.addEventListener('click', function () {
            modal.style.display = 'block';
        });

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


        // Формирование HTML с данными из waybill
        const waybillHTML = `
            <p><strong>Номер накладной и место отправления:</strong> ${waybillNumDepDate}</p>
            <p><strong>Дата отправления:</strong> ${waybillDateSend}</p>
            <p><strong>Место отправления:</strong> ${waybillDepFrom}</p>
            <p><strong>Отправитель:</strong> ${waybillSender}</p>
            <p><strong>Дата получения:</strong> ${waybillGetDate}</p>
            <p><strong>Место получения:</strong> ${waybillDepTo}</p>
            <p><strong>Получатель:</strong> ${waybillReceiver}</p>
        `;

        // Вставка HTML с данными в модальное окно
        waybillDataDiv.innerHTML = waybillHTML;
    });

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

//удаление данных из json (пока не работает (Т.Т) )
//функция для удаления записи из JSON
// function deleteRecord(waybillIDToDelete) {
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
// }
//
// //обработчик события клика по кнопке удаления записи
// document.getElementById('deleteButton').addEventListener('click', function() {
//     let waybillIDToDelete = 'waybillID'; //замените на фактический ID записи, которую хотите удалить
//     deleteRecord(waybillIDToDelete); //вызываем функцию удаления записи
// });

//обработчик события клика по кнопке подтверждения удаления записи
// document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
//
//     document.getElementById('deleteButton').addEventListener('click', function () {
//         let waybillIDToDelete = 'waybillID';
//
//         let waybillData = JSON.parse(localStorage.getItem('waybillData'));
//         let nomenclatureData = JSON.parse(localStorage.getItem('nomenclatureData'));
//         let passportData = JSON.parse(localStorage.getItem('passportData'));
//
//         // Удаление записей с соответствующим waybillID из waybillData
//         waybillData = waybillData.filter(item => item.waybillID !== waybillIDToDelete);
//         localStorage.setItem('waybillData', JSON.stringify(waybillData));
//
//         // Удаление записей с соответствующим waybillID из nomenclatureData
//         nomenclatureData = nomenclatureData.filter(item => item.waybillID !== waybillIDToDelete);
//         localStorage.setItem('nomenclatureData', JSON.stringify(nomenclatureData));
//
//         // Удаление записей с соответствующим waybillID из passportData
//         passportData = passportData.filter(item => item.waybillID !== waybillIDToDelete);
//         localStorage.setItem('passportData', JSON.stringify(passportData));
//
//
//     });
//
// });

//вызов подтверждения
