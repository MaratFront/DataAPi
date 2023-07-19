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
  postBtn.classList.add('postBtn')
  const postPut = document.createElement('th');
  postBtn.innerHTML = 'Додати';
  const postInputTh = document.createElement('input');
  postPut.appendChild(postInputTh);
  postPut.appendChild(postBtn);
  parentObj.tr.appendChild(postPut);

  Object.entries(dataArray.data).map(([key, item],index) => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.innerHTML = index+1
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
          tr.style.display="none";
        } else {
          throw new Error('Delete request failed');
        }
      } catch (error) {
        console.error(error);
      }
    });
    
    
  });
  let counter = dataArray.length + 1;
      function updateRowNumbers() {
        const rows = Array.from(parentObj.tbody.querySelectorAll('tr'));
        rows.forEach((row, index) => {
          row.classList.add('row-number')
          const tdIndex = row.value;
          tdIndex.innerHTML = index + 1;
        });
      }
      
  postBtn.addEventListener('click', async () => {
    const tr = document.createElement('tr');
    const tdIndex = document.createElement('td');
    const tdInput1 = document.createElement('td');
    const tdInput2 = document.createElement('td');
    const tdInput3 = document.createElement('td');
    updateRowNumbers();
    tdIndex.innerHTML=counter++
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

    parentObj.tbody.insertBefore(tr, parentObj.tbody.firstChild);

    postInput3.addEventListener('keydown', (event) => {
      counter++;
      if (event.key === 'Enter') {
        const newRecord = {
          name: postInput1.value,
          surname: postInput2.value,
          birthday: postInput3.value,
        };

        if (postInput1.value === '' || postInput2.value === '' || postInput3.value === '') {
          postInput1.style.border = postInput1.value === '' ? '1px solid red' : '';
          postInput2.style.border = postInput2.value === '' ? '1px solid red' : '';
          postInput3.style.border = postInput3.value === '' ? '1px solid red' : '';

        } else {
          addRecordToTable(newRecord, tr);
          tdInput1.style.display="none";
          tdInput2.style.display="none";
          tdInput3.style.display="none";

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
                  tr.style.display='none';
                } else {
                  throw new Error('Delete request failed');
                }
              } catch (error) {
                console.error(error);
              }
            });
          
          }
        }
      } else {
        postInput1.style.border = '';
        postInput2.style.border = '';
        postInput3.style.border = '';
      }
    });
  });
  
  function addRecordToTable(record, tr) {
    const tdInput1 = document.createElement('td');
    const tdInput2 = document.createElement('td');
    const tdInput3 = document.createElement('td');

    tdInput1.innerHTML = record.name;
    tdInput2.innerHTML = record.surname;
    tdInput3.innerHTML = record.birthday;

    tr.appendChild(tdInput1);
    tr.appendChild(tdInput2);
    tr.appendChild(tdInput3);
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
  apiUrl: 'https://mock-api.shpp.me/malev/users', // замініть nsurname на своє ім'я та прізвище
};

DataTable(config1);














/*
async function DataTable(config){
  const parent=document.querySelector(config.parent);
  const table=document.createElement('table');
  const thead=document.createElement('thead');
  const tbody=document.createElement('tbody');
  const tr=document.createElement('tr');

  function getTitleData(){
    const indexTh=document.createElement('th');
    indexTh.innerHTML='№';
    tr.appendChild(indexTh);
    
    config.columns.map((item)=>{
      const th=document.createElement('th');
      th.innerHTML=item.title;
      tr.appendChild(th);
    })
    const thActions=document.createElement('th');
    thActions.innerHTML='Дії';
    tr.appendChild(thActions);

    thead.appendChild(tr);
    table.appendChild(thead);
    parent.appendChild(table);
  
  }
  getTitleData();

  async function valueData(api){
   const response=await fetch(api); 
   const data=await response.json();
   const dataArray=data;
   Object.entries(dataArray.data).map(([key,item],index)=>{
    const tr=document.createElement('tr');
    const td=document.createElement('td');
    td.innerHTML=index+1;
    tr.appendChild(td);
    const presentYear = new Date();
    config.columns.map((element)=>{
      const td=document.createElement('td');
      if (element.value === 'birthday') {
        const pastYear = new Date(item[element.value]);
        const result = presentYear.getFullYear() - pastYear.getFullYear();
        td.innerHTML = result;
        tr.appendChild(td)
      }
      else{
        td.innerHTML=item[element.value];
        tr.appendChild(td);
      }
    })
    const delTd=document.createElement('td');
    const delBtn=document.createElement('button')
    delBtn.innerHTML='Видалити'
    delBtn.style.background='#8B0000';
    delTd.appendChild(delBtn);
    tr.appendChild(delTd);
    delBtn.addEventListener('click',async()=>{
      try{
        const deleteResponse=await fetch(`${config.apiUrl}/${key}`,{
          method:'DELETE',
        })
        if(deleteResponse.ok){
          tr.style.display='none';
        }else{
          throw new Error('delete request failed')
        }
      }catch(error){
        console.error(error);
      }
    })
    tbody.appendChild(tr);
   })
   function postElemnts(){
    const postTh=document.createElement('th');
    const postInput=document.createElement('input');
    postTh.appendChild(postInput);
    const postBtn=document.createElement('button');
    postBtn.innerHTML="Додати";
    postTh.appendChild(postBtn);
    tr.appendChild(postTh);
    tr.appendChild(postTh);
    thead.appendChild(tr);

    postBtn.addEventListener('click',()=>{
      const tr = document.createElement('tr');
      const tdIndex = document.createElement('td');
      const tdInput1 = document.createElement('td');
      const tdInput2 = document.createElement('td');
      const tdInput3 = document.createElement('td');
      tdIndex.innerHTML='NaN'
     // updateRowNumbers();
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
      tbody.appendChild(tr);
      table.appendChild(tbody);
      tbody.insertBefore(tr,tbody.firstChild)
      parent.appendChild(table);
      
      postInput.addEventListener('keydown',(event)=>{
        if(event.key=='Enter'){
          // eslint-disable-next-line no-unused-vars
          const newRecord = {
            name: postInput1.value,
            surname: postInput2.value,
            birthday: postInput3.value,
          };   
          // eslint-disable-next-line no-inner-declarations
          function blockButton(inputsElement){
            if(inputsElement.value==""){
              inputsElement.style.border="1px solid red";
              return false;
            }else{ }
          }
          blockButton(postInput1);
        }
      })
    });
   }
   postElemnts();
   table.appendChild(thead);
   table.appendChild(tbody);
   parent.appendChild(table);
  }
  valueData(config.apiUrl);

}


const config1 = {
  parent: '#usersTable',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Вік', value: 'birthday' },
  ],
  apiUrl: 'https://mock-api.shpp.me/ma/users', // замініть nsurname на своє ім'я та прізвище
};

DataTable(config1)
*

*/












































