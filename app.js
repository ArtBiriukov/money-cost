'use strict'

//Переменные
const listEl = document.querySelector('.list'),
  headerApp = document.querySelector('.header'),
  URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

let iterator = 1,
  arrObj = [];

const nextInfo = async (nextInfoUrl) => {
  let response = await fetch(nextInfoUrl);
  let result = await response.json();
  return result;
}

const makeInformEl = (element, infoItem) => {
  body.insertAdjacentHTML('beforeend', `
      <div class="inform">
  <h3 class="inform__title">Валюта<h3>
        <div class="inform__top">
          <p class="data">222222</p>
          <p class="valute">12331</p>
        </div>
        <div class="inform__conten">
          <p class="data">222222</p>
          <p class="valute">12331</p>
        </div>
      </div>`)
  console.log(infoItem);
}

const addAction = () => {
  const items = document.querySelectorAll('.item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      //код валюты
      const itemCode = item.dataset.code;
      let itemInfo = [];

      arrObj.forEach(objectInfo => {

        let itemDate = objectInfo.Date.substr(0, 10),
          itemObj = objectInfo.Valute;

        for (const key in itemObj) {
          if (itemCode === key) {
            itemInfo.push(itemObj[key].Value);
          }
        }
      })

      makeInformEl(item, itemInfo);

    })
  })
}

const creatEl = ({
  CharCode,
  Name,
  Previous,
  Value
}) => {
  listEl.insertAdjacentHTML('beforeend', `
  <li class='item' data-title='${Name}' data-code='${CharCode}'>
    <div class="list__content decor">
      <p>${CharCode}</p>
      <p><b>${Value} ₽</b></p>
      <p>${(((Value-Previous)/Previous)*100).toFixed(2)}%</p>
    </div>
  </li>
  `)
}

const getInfo = async (url) => {
  try {
    let response = await fetch(url);
    let data = await response.json();

    //Значения валют
    const valute = data.Valute,
      date = data.Date.substr(0, 10);

    headerApp.innerText = `Курс валют на ${date}`;

    //Предыдущие значения валют
    let nextUrl = data.PreviousURL;
    arrObj.push(data);

    //Создание элементов на странице
    for (const key in valute) {

      const element = valute[key];

      //Функция создания элемента
      creatEl(element);
    }

    //Навешивание клика
    addAction();

    //Получение массива данных за последние 10 дней

    for (; iterator < 10; iterator++) {
      let next = await nextInfo(nextUrl);
      arrObj.push(next);
      nextUrl = next.PreviousURL;
    }

  } catch (error) {
    console.warn(error);
  }
}

getInfo(URL);


/* 
Date: "2022-03-18T11:30:00+03:00"
PreviousDate: "2022-03-17T11:30:00+03:00"
PreviousURL: "//www.cbr-xml-daily.ru/archive/2022/03/17/daily_json.js"
Timestamp: "2022-03-18T15:00:00+03:00"
Valute: {AUD: {…}, AZN: {…}, GBP: {…}, AMD: {…}, BYN: {…}, …}



CharCode: "AUD"
ID: "R01010"
Name: "Австралийский доллар"
Nominal: 1
NumCode: "036"
Previous: 76.9346
Value: 76.6025
*/