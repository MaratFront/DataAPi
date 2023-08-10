/*async function DataTable(config) {
  const parent = document.querySelector(config.parent);
  const parentObj = {
    parent: parent,
    columns: config.columns,
    api: config.apiUrl,
    table: document.createElement('table'),
    thead: document.createElement('thead'),
    tbody: document.createElement('tbody'),
    tr: document.createElement('tr'),
    index: 1,
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
  postBtn.classList.add('postBtn');
  const postPut = document.createElement('th');
  postBtn.innerHTML = 'Додати';
  const postInputTh = document.createElement('input');
  postPut.appendChild(postInputTh);
  postPut.appendChild(postBtn);
  parentObj.tr.appendChild(postPut);

  function getResponse(newData){
    Object.entries(newData).reverse().map(([key, item]) => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.innerHTML = parentObj.index++;
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

      deleteButton.classList.add('delBtn');
      deleteButton.addEventListener('click', async () => {
        try {
          const deleteResponse = await fetch(`${parentObj.api}/${key}`, {
            method: 'DELETE',
          });

          if (deleteResponse.ok) {
            tr.style.display = 'none';
          } else {
            throw new Error('Delete request failed');
          }
        } catch (error) {
          console.error(error);
        }
      });
    });
    
  }
  getResponse(dataArray.data);
  let counter = dataArray.length + 1;

  function updateRowNumbers() {
    const rows = parentObj.tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
      const tdIndex = row.children[0];
      tdIndex.innerHTML = index + 1;
    });
  }

  postBtn.addEventListener('click', async () => {
    const tr = document.createElement('tr');
    const tdIndex = document.createElement('td');
    const tdInput1 = document.createElement('td');
    const tdInput2 = document.createElement('td');
    const tdInput3 = document.createElement('td');

    // Set the correct index for each row when adding a new record
    counter++;
    tdIndex.innerHTML = counter;

    const postInput1 = document.createElement('input');
    const postInput2 = document.createElement('input');
    const postInput3 = document.createElement('input');

    tdInput1.appendChild(postInput1);
    tdInput2.appendChild(postInput2);
    tdInput3.appendChild(postInput3);

    tr.appendChild(tdIndex);
    tr.appendChild(tdInput1);
    tr.appendChild(tdInput2);
    tr.appendChild(tdInput3);

    // Вместо parentObj.tbody.appendChild(tr);
    // Используем parentObj.tbody.insertBefore(tr, parentObj.tbody.firstChild);
    parentObj.tbody.insertBefore(tr, parentObj.tbody.firstChild);
    updateRowNumbers();

    postInput3.addEventListener('keydown', async (event) => {
      try {
        const  currentDate = new Date();
        if (event.key === 'Enter') {
          const newRecord = {
            name: postInput1.value,
            surname: postInput2.value,
            birthday: String(currentDate.getFullYear()-postInput3.value),
            avatar: 'https://example.com/default_avatar.jpg',
          };
          if (postInput1.value === '' || postInput2.value === '' || postInput3.value === '') {
            postInput1.style.border = postInput1.value === '' ? '1px solid red' : '';
            postInput2.style.border = postInput2.value === '' ? '1px solid red' : '';
            postInput3.style.border = postInput3.value === '' ? '1px solid red' : '';
          } else {
            const postResponse = await fetch(parentObj.api, {
              method: 'POST',
              body: JSON.stringify(newRecord),
              headers: {
                'Content-Type': 'application/json',
              },
            });
          
            if (postResponse.ok) {
              const responseData = await postResponse.json();
              addRecordToTable(newRecord, tr);
              tdInput1.style.display = 'none';
              tdInput2.style.display = 'none';
              tdInput3.style.display = 'none';


              const tdButton = document.createElement('td');
              const deleteButton = document.createElement('button');
              deleteButton.classList.add('delBtn');
              deleteButton.innerHTML = 'Видалити';
              tdButton.appendChild(deleteButton);
              tr.appendChild(tdButton);
              getResponse(dataArray.data)
              deleteButton.addEventListener('click', async () => {
                try {
                  const deleteResponse = await fetch(`${parentObj.api}/${responseData.id}`, {
                    method: 'DELETE',
                  });

                  if (deleteResponse.ok) {
                    tr.style.display = 'none';
                  } else {
                    throw new Error('Delete request failed');
                  }
                } catch (error) {
                  console.error(error);
                }
              });
            } else {
              throw new Error('Post request failed');
            }
            
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
  //console.log(dataArray)
  function addRecordToTable(record, tr) {
    const tdInput1 = document.createElement('td');
    const tdInput2 = document.createElement('td');
    const tdInput3 = document.createElement('td');

    tdInput1.innerHTML = record.name;
    tdInput2.innerHTML = record.surname;
    tdInput3.innerHTML = record.birthday;

    tr.insertBefore(tdInput1, tr.firstChild);
    tr.insertBefore(tdInput2, tr.firstChild);
    tr.insertBefore(tdInput3, tr.firstChild);
  }
  
  
  parentObj.table.appendChild(parentObj.tbody);
  parentObj.parent.appendChild(parentObj.table);
}


const config1 = {
  parent: '#usersTable',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Вік', value: 'birthday' },
  ],
  apiUrl: 'https://mock-api.shpp.me/nsurname/users', // замініть nsurname на своє ім'я та прізвище
};

DataTable(config1);
*/
function DataTable(config) {
  const parent = document.querySelector(config.parent);
  const parentObj = new Map([
    ['parent', parent],
    ['columns', config.columns],
    ['api', config.apiUrl],
    ['table', document.createElement('table')],
    ['thead', document.createElement('thead')],
    ['tbody', document.createElement('tbody')],
    ['tr', document.createElement('tr')],
  ]);

  function dataHead(table, parent) {
    const thIndex = document.createElement('th');
    thIndex.innerHTML = "№";
    parentObj.get('tr').appendChild(thIndex);
    parentObj.get('columns').forEach((item) => {
      const thTitle = document.createElement('th');
      thTitle.innerHTML = item.title;
      parentObj.get('tr').appendChild(thTitle);
    });

    const thActions = document.createElement('th');
    thActions.innerHTML = "Дії";

    parentObj.get('tr').appendChild(thActions);
    parentObj.get('thead').appendChild(parentObj.get('tr'));
    table.appendChild(parentObj.get('thead'));
    parent.appendChild(table);
  }

  async function getResponse() {
    const response = await fetch(parentObj.get('api'));
    const dataArray = await response.json();

    Object.entries(dataArray.data).reverse().map(([key,item], index) => {
      const tdIndex = document.createElement('td');
      const tr = document.createElement('tr');
      tdIndex.innerHTML = index + 1;
      tr.appendChild(tdIndex);

      parentObj.get('columns').map((elem) => {
        const td = document.createElement('td');
        if (elem.value === 'birthday') {
          const presentYear = new Date().getFullYear();
          const pastYear = new Date(item[elem.value]).getFullYear();
          const result = presentYear - pastYear;
          td.innerHTML = result;
        } else {
          td.innerHTML = item[elem.value];
        }

        tr.appendChild(td);
      });

      deleteResponse(key, tr);
      parentObj.get('tbody').appendChild(tr);
    });

    parentObj.get('table').appendChild(parentObj.get('tbody'));
    parentObj.get('parent').appendChild(parentObj.get('table'));

    postItems(dataArray.length + 1);
  }
  getResponse();
  async function deleteResponse(id, deleteRow) {
    const deleteTd = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = "Видалити";
    deleteButton.classList.add('delBtn');
    deleteTd.appendChild(deleteButton);
    deleteRow.appendChild(deleteTd);
    deleteButton.addEventListener('click', async () => {
      try {
        const deleteResponse = await fetch(`${parentObj.get('api')}/${id}`, { method: 'DELETE' });
        if (deleteResponse.ok) {
          deleteRow.remove();
          updateRowNumbers();
        } else {
          throw new Error('Delete request failed');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  function updateRowNumbers() {
    const rows = parentObj.get('tbody').querySelectorAll('tr');
    rows.forEach((row, index) => {
      const tdIndex = row.children[0];
      tdIndex.innerHTML = index + 1;
    });
  }

  let postItemsNested = false;

  function postItems(counter) {
    if (!postItemsNested) {
      postItemsNested = true;

      const thButton = document.createElement('button');
      const thInput = document.createElement('input');
      const theadElements = document.createElement('th');
      theadElements.appendChild(thInput);
      theadElements.appendChild(thButton);
      thButton.innerHTML = "Додати";
      thButton.classList.add('postBtn');
      parentObj.get('tr').appendChild(theadElements);

      thButton.addEventListener('click', () => {
        const tdIndex = document.createElement('td');
        const tdInput1 = document.createElement('td');
        const tdInput2 = document.createElement('td');
        const tdInput3 = document.createElement('td');
        const tr = document.createElement('tr');
        counter++;
        tdIndex.innerHTML = counter;

        const postInput1 = document.createElement('input');
        const postInput2 = document.createElement('input');
        const postInput3 = document.createElement('input');

        tdInput1.appendChild(postInput1);
        tdInput2.appendChild(postInput2);
        tdInput3.appendChild(postInput3);

        tr.appendChild(tdIndex);
        tr.appendChild(tdInput1);
        tr.appendChild(tdInput2);
        tr.appendChild(tdInput3);

        parentObj.get('tbody').insertBefore(tr, parentObj.get('tbody').firstChild);
        updateRowNumbers();

        postInput3.addEventListener('keydown', async (event) => {
          if (event.key === 'Enter') {
            const currentDate = new Date();
            const newRecord = {
              name: postInput1.value,
              surname: postInput2.value,
              birthday: String(currentDate.getFullYear() - postInput3.value),
              avatar: 'https://cloudflare-ipfs.com/ipfs',
            };

            if (postInput1.value === '' || postInput2.value === '' || postInput3.value === '') {
              postInput1.style.border = postInput1.value === '' ? '1px solid red' : '';
              postInput2.style.border = postInput2.value === '' ? '1px solid red' : '';
              postInput3.style.border = postInput3.value === '' ? '1px solid red' : '';
            } else {
              try {
                const postResponse = await fetch(parentObj.get('api'), {
                  method: 'POST',
                  body: JSON.stringify(newRecord),
                  headers: {
                    'Content-Type': 'application/json'
                  },
                });

                if (postResponse.ok) {
                  const responseData = await postResponse.json();
                  tdInput1.style.display = "none";
                  tdInput2.style.display = "none";
                  tdInput3.style.display = "none";
                  addRecordToTable(newRecord, tr);
                  deleteResponse(responseData.id, tr);
                  updateRowNumbers();
                  getResponse();
                } else {
                  throw new Error('Post request failed');
                }
              } catch (error) {
                console.error(error);
              }
            }
          }
        });
      });
    } else {
      return false;
    }
  }

  function addRecordToTable(record, tr) {
    const tdInput1 = document.createElement('td');
    const tdInput2 = document.createElement('td');
    const tdInput3 = document.createElement('td');

    tdInput1.innerHTML = record.name;
    tdInput2.innerHTML = record.surname;
    tdInput3.innerHTML = record.birthday;

    tr.insertBefore(tdInput1, tr.firstChild);
    tr.insertBefore(tdInput2, tr.firstChild);
    tr.insertBefore(tdInput3, tr.firstChild);
  }

  dataHead(parentObj.get('table'), parentObj.get('parent'));

}

const config1 = {
  parent: '#usersTable',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Вік', value: 'birthday' },
  ],
  apiUrl: 'https://mock-api.shpp.me/nsurname/users', // замініть nsurname на своє ім'я та прізвище
};

DataTable(config1);






















































  






















































