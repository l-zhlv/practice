GetPassportWaybillID(); //вызов функции для отображения таблицы с номенклатурой
GetNomenclatureWaybillID(); //вызов функции для отображения

//функция для удаления таблицы СП
function ClearPassportTable() {
    const tableBody = document.querySelector('#passportTable tbody');
    tableBody.innerHTML = ''; // Очищение содержимого tbody
}

//функция для отображения таблицы с номенклатурой
function GetNomenclatureWaybillID() {
    const tableBody = document.querySelector('#nomTable tbody');
    const passportTable = document.querySelector('#passportTable');
    const hidePassportTableButton = document.getElementById('hidePassportTableButton'); //объявление кнопки для скрытия СП

    new URLSearchParams(window.location.search).forEach((value, name) => {
        let waybillID = value;
        let waybillNumDepDate = new URLSearchParams(window.location.search).get('waybillNumDepDate');

        fetch('../json/nomenclature.json') //подключение к файлу с номенклатурой
            .then(response => response.json())//обрабатываем ответ на запрос и снова преобразуем в формат json
            .then(data => {
                let needData = data.filter(nomenclature => nomenclature.waybillID == waybillID);//фильтруем данные по значению waybillID

                needData.forEach(nomenclature => {
                    let row = document.createElement('tr');
                    let waybillCell = document.createElement('td');
                    waybillCell.textContent = waybillNumDepDate;
                    row.appendChild(waybillCell);

                    for (let item in nomenclature) {
                        if (Object.prototype.hasOwnProperty.call(nomenclature, item) && item !== 'waybillID' && item !== 'nomenclatureID') {//проверка на соответствие параметрам
                            let cell = document.createElement('td');//создаем ячейку
                            cell.textContent = nomenclature[item];//и помещаем в нее данные
                            row.appendChild(cell);
                        }
                    }
                       row.addEventListener('click', function() { //открытие СП по клику
                        GetPassportWaybillID(waybillID);
                        passportTable.style.display = 'table';
                        hidePassportTableButton.style.display = 'block'; //показ кнопки "скрыть"
                    });

                    tableBody.appendChild(row);
                });
            });
    });
}


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

//функция для скрытия СП
document.getElementById('hidePassportTableButton').addEventListener('click', function() {
    document.querySelector('#passportTable').style.display = 'none';
    this.style.display = 'none';
});

