async function DataTable(config) {
  const parent = document.querySelector(config.parent);
  const parentObj = {
    parent: parent,
    columns: config.columns,
    api: config.apiUrl,
    table: document.createElement('table'),
    thead: document.createElement('thead'),
    tbody: document.createElement('tbody'),
    tr: document.createElement('tr'),
  };

  const th = document.createElement('th');
  th.innerHTML = '№';
  parentObj.tr.appendChild(th);

  parentObj.columns.map((item) => {
    const th = document.createElement('th');
    th.innerHTML = item.title;
    parentObj.tr.appendChild(th);
  });

  parentObj.thead.appendChild(parentObj.tr);
  parentObj.table.appendChild(parentObj.thead);

  const response = await fetch(parentObj.api);
  const data = await response.json();

  const dataArray = data;

  const actions = document.createElement('th');
  actions.innerHTML = 'Дії';
  parentObj.tr.appendChild(actions);

  const postBtn = document.createElement('button');
  const postPut = document.createElement('th');
  postBtn.innerHTML = 'Додати';
  const postInputTh = document.createElement('input');
  postPut.appendChild(postInputTh);
  postPut.appendChild(postBtn);
  parentObj.tr.appendChild(postPut);
  
  Object.entries(dataArray.data).map(([key, item], index) => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.innerHTML = index + 1;
    tr.appendChild(td1);

    parentObj.columns.map((column) => {
      const td = document.createElement('td');
      const presentYear = new Date();
      if (column.value === 'birthday') {
        const pastYear = new Date(item[column.value]);
        const result = presentYear.getFullYear() - pastYear.getFullYear();
        td.innerHTML = result;
      } else {
        td.innerHTML = item[column.value];
      }
      tr.appendChild(td);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Видалити';

    const tdActions = document.createElement('td');
    tdActions.appendChild(deleteButton);
    tr.appendChild(tdActions);

    parentObj.tbody.appendChild(tr);

    // Add event listener to delete button
    deleteButton.classList.add('delBtn');
    deleteButton.addEventListener('click', async () => {
      try {
        const deleteResponse = await fetch(`${parentObj.api}/${key}`, {
          method: 'DELETE',
        });

        if (deleteResponse.ok) {
          tr.remove();
        } else {
          throw new Error('Delete request failed');
        }
      } catch (error) {
        console.error(error);
      }
    });
  });

  postBtn.addEventListener('click', async () => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    const tdInput1 = document.createElement('td');
    const tdInput2 = document.createElement('td');
    const tdInput3 = document.createElement('td');

    const postInput1 = document.createElement('input');
    const postInput2 = document.createElement('input');
    const postInput3 = document.createElement('input');

    tdIndex.innerHTML = dataArray.data.index+1;
    tdInput1.appendChild(postInput1);
    tdInput2.appendChild(postInput2);
    tdInput3.appendChild(postInput3);

    tr.appendChild(tdIndex);
    tr.appendChild(tdInput1);
    tr.appendChild(tdInput2);
    tr.appendChild(tdInput3);

    parentObj.tbody.insertBefore(tr, parentObj.tbody.firstChild);

    try {
      const postResponse = await fetch(parentObj.api, { method: 'POST' });
      if (postResponse.ok) {
        postInput3.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            const newRecord = {
              name: postInput1.value,
              surname: postInput2.value,
              birthday: postInput3.value,
            };

            addRecordToTable(newRecord, tr);
          }
        });
      } else {
        postInput3.addEventListener('keydown', (event) => {
          if(postInput3==undefined){
            postInput3.value
          }
          if (event.key === 'Enter') {
            const newRecord = {
              name: postInput1.value,
              surname: postInput2.value,
              birthday: postInput3.value,
            };

            addRecordToTable(newRecord, tr);

            tdInput1.remove();
            tdInput2.remove();
            tdInput3.remove();

            const tdButton = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delBtn');
            deleteButton.innerHTML = 'Видалити';
            tdButton.appendChild(deleteButton);
            tr.appendChild(tdButton);
            for (const key of Object.keys(dataArray.data)) {
              deleteButton.addEventListener('click', async () => {
                try {
                  const deleteResponse = await fetch(`${parentObj.api}/${key}`, {
                    method: 'DELETE',
                  });

                  if (deleteResponse.ok) {
                    tr.remove();
                  } else {
                    throw new Error('Delete request failed');
                  }
                } catch (error) {
                  console.error(error);
                }
              });
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  function addRecordToTable(record, tr) {
    //const tdIndex = document.createElement('td');
    const tdInput1 = document.createElement('td');
    const tdInput2 = document.createElement('td');
    const tdInput3 = document.createElement('td');

  //  tdIndex.innerHTML = dataArray.data.index;
    tdInput1.innerHTML = record.name;
    tdInput2.innerHTML = record.surname;
    tdInput3.innerHTML = record.birthday;

   // tr.appendChild(tdIndex);
    tr.appendChild(tdInput1);
    tr.appendChild(tdInput2);
    tr.appendChild(tdInput3);
  }

  parentObj.table.appendChild(parentObj.tbody);
  parentObj.parent.appendChild(parentObj.table);
  console.log(dataArray);
}

const config1 = {
  parent: '#usersTable',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Вік', value: 'birthday' },
  ],
  apiUrl: 'https://mock-api.shpp.me/marliiv/users', // замініть nsurname на своє ім'я та прізвище
};

DataTable(config1);




