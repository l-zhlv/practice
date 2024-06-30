GetNomenclatureWaybillID(); //вызов функции для отображения
GetPassportWaybillID(); //вызов функции для отображения таблицы с номенклатурой


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
// GetPassportWaybillID();


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
    const tableBody = document.querySelector('#passportTable tbody');

    if (event.target.tagName === 'TD') {
        const currentRow = event.target.closest('tr');
        const waybillID = currentRow.querySelector('td:first-child').textContent;

        if (secondTable.classList.contains('hidden')) {
            secondTable.classList.remove('hidden');
            secondTable.classList.add('full-width');
            tableBody.innerHTML = '';

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
                        tableBody.appendChild(row);
                    });
                });
        } else {
            secondTable.classList.add('hidden');
            secondTable.classList.remove('full-width');
            tableBody.innerHTML = '';
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

document.querySelectorAll("#nomTable tr").forEach(row => {
    row.addEventListener('click', function () {
        document.querySelector("#passportTable").classList.toggle('full-width');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close');
    const saveButton = document.getElementById('saveChanges');
    const confirmDeleteButton = document.getElementById('confirmDeleteBtn'); // Кнопка "Подтвердить удаление"

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

        // Сохранение изменений в JSON файле
        fetch('../json/waybill.json')
            .then(response => response.json())
            .then(data => {
                // Найти запись по уникальному идентификатору и обновить её
                const idToUpdate = 1051762; // Пример идентификатора
                const updatedEntry = data.find(entry => entry.waybillID === idToUpdate);
                if (updatedEntry) {
                    updatedEntry.waybillNumDepDate = waybillNumDepDate;
                    updatedEntry.waybillSenDate = waybillSenDate;
                    updatedEntry.waybillDepsFrom = waybillDepsFrom;
                    updatedEntry.waybillSending = waybillSending;
                    updatedEntry.waybillRecDate = waybillRecDate;
                    updatedEntry.waybillDeppTo = waybillDeppTo;
                    updatedEntry.waybillReceiver = waybillReceiver;

                    // Сохранить обновленные данные обратно в файл
                    const updatedData = JSON.stringify(data, null, 2);
                    const blob = new Blob([updatedData], {type: 'application/json'});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'waybill.json';
                    a.click();
                }
            });
    });

});


document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const waybillIDToDelete = urlParams.get('id');

    deleteWaybillByID(waybillIDToDelete);

    document.getElementById('myModal').style.display = 'none';
});


document.addEventListener('DOMContentLoaded', function () {
    const addPassportBtn = document.getElementById('addPassportBtn');
    const modal = document.getElementById('addPassportModal');
    const span = document.getElementsByClassName('close')[0];
    const params = new URLSearchParams(window.location.search);

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
        downloadJSON(passportData, 'passport.json');
        modal.style.display = 'none';
    }
});

function downloadJSON(data, filename) {
    const file = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}


const deleteWaybillBtn = document.getElementById('deleteButton');

deleteWaybillBtn.onclick = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let waybillData = JSON.parse(localStorage.getItem('waybillData')) || [];

    // Находим индекс накладной по ID
    const waybillIndex = waybillData.findIndex(w => w.waybillID == id);

    if (waybillIndex !== -1) {
        // Удаляем накладную из массива по индексу
        waybillData.splice(waybillIndex, 1);

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
    }
};


//отправить накладную
document.addEventListener('DOMContentLoaded', function () {
    const sendWaybillBtn = document.getElementById('sendWaybillBtn');
    const senderModal = document.getElementById('SenderModal');
    const closeSenderModal = document.getElementsByClassName('close')[1];

    sendWaybillBtn.onclick = function () {
        senderModal.style.display = 'block';
    }

    closeSenderModal.onclick = function () {
        senderModal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == senderModal) {
            senderModal.style.display = 'none';
        }
    }

    const saveSenderBtn = document.getElementById('saveSenderBtn');

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

            const blob = new Blob([JSON.stringify(waybillData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'waybill.json';
            document.body.appendChild(a);
            a.click();
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

    getWaybillBtn.onclick = function () {
        receiverModal.style.display = 'block';
    }

    closeModal.onclick = function () {
        receiverModal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == receiverModal) {
            receiverModal.style.display = 'none';
        }
    }

    const saveReceiverBtn = document.getElementById('saveReceiverBtn');

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

            const blob = new Blob([JSON.stringify(waybillData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'waybill.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        receiverModal.style.display = 'none';
    }
});
