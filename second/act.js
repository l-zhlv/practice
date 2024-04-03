fetch('./waybill.json')
  .then(response => response.json())
  .then(data => {
    const output = document.getElementById('output');
    const table = document.createElement('table');
    table.classList.add('table');

    data.forEach(waybill => {
      const row = table.insertRow();
      row.innerHTML = `
        
          <td>Номер:</td>
          <td>${waybill.waybillNum}</td>
       
          <td>Отдел:</td>
          <td>${waybill.waybillDep}</td>

          <td>Дата:</td>
          <td>${waybill.waybillDate}</td>
       
          <td>Отдел отправления:</td>
          <td>${waybill.waybillDepFrom}</td>
       
          <td>Отдел получения:</td>
          <td>${waybill.waybillDepTo}</td>
        
          <td>Дата отправления:</td>
          <td>${waybill.waybillSendDate}</td>
       
          <td>Дата получения:</td>
          <td>${waybill.waybillReceiveDate}</td>
        
          <td>Отправитель:</td>
          <td>${waybill.waybillSender}</td>
        
          <td>Получение:</td>
          <td>${waybill.waybillReceiver}</td>
        
      `;
    });

    output.appendChild(table);
  })
  .catch(error => console.error(error));

