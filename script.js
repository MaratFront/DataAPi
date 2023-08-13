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
