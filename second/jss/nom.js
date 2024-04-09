GetPassportWaybillID();
GetNomenclatureWaybillID();


function GetNomenclatureWaybillID() {
    const tableBody = document.querySelector('#nomTable tbody');

    new URLSearchParams(window.location.search).forEach((value, name) => {
        let waybillID = `${value}`;

        fetch('../jsons/nomenclature.json')
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

                    tableBody.appendChild(row);
                });
            });
    });
}

function GetPassportWaybillID() {
    const tableBody = document.querySelector('#passportTable tbody');

    new URLSearchParams(window.location.search).forEach((value, name) => {
        let waybillID = `${value}`;

        fetch('../jsons/passport.json')
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


// function GetNomenclatureWaybillID()
// {
//     const resultsList = document.getElementById('out2')
//     new URLSearchParams(window.location.search).forEach((value, name) => {
//         let waybillID = `${value}`
//         fetch('../jsons/nomenclature.json')
//             .then(response => response.json())
//             .then(data => {
//                 let needData = data.filter(nomenclature => nomenclature.waybillID == waybillID);
//                 needData.forEach(nomenclature => {
//                     for (let key in nomenclature) {
//                         if (Object.prototype.hasOwnProperty.call(nomenclature, key)) {
//                             resultsList.append(key + ': ' + nomenclature[key]); // Выводим ключ и значение свойства
//                             resultsList.append(document.createElement('br'))
//                         }
//                     }
//                 })
//             })
//     })
// }


