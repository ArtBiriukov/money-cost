'use strict'

//Переменные
const listEl = document.querySelector('.list'),
  headerApp = document.querySelector('.header'),
  mainUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';

let arrObj = [];

const takeData = async (url) => {
  let response = await fetch(url);
  let result = await response.json();
  return result;
}

//Создаем элемент информации за 10 дней
const creatInform = (element, titleValute) => {

  let infoElement = document.createElement('div');
  infoElement.classList.add('inform');

  element.appendChild(infoElement);

  infoElement.innerHTML = `
      <h3 class="inform__title">${titleValute}</h3>

      <ul class="inform__content">
        <li class="inform__item-top inform__decor">
          <p>Дата</p>
          <p>Курс</p>
        </li>
      </ul>
      `;
}

//Работа с одним элементом
const addAction = () => {
  const items = document.querySelectorAll('.item__content');

  items.forEach(item => {
    let parentItem = item.parentNode,
      itemCode = item.dataset.code,
      itemTitle = item.dataset.title;

    item.addEventListener('click', (e) => {

      const target = e.currentTarget;

      //Проверка на активный класс и на то что есть блок с информацией или нет
      if (target === item && item.classList.contains('active')) {
        item.classList.remove('active');

        if (parentItem.querySelector('.inform')) {
          parentItem.querySelector('.inform').remove();
        }
        return;
      }

      items.forEach(el => {
        if (el.classList.contains('active')) {
          el.classList.remove('active');
          el.parentNode.querySelector('.inform').remove();
          return;
        }
      })

      item.classList.add('active');

      //создание блока с информацией
      creatInform(parentItem, itemTitle);

      let informElement = parentItem.querySelector('.inform__content');

      arrObj.forEach(objectInfo => {

        let informDate = objectInfo.Date.substr(0, 10),
          informValute = objectInfo.Valute;

        for (const key in informValute) {
          if (itemCode === key) {

            let informContent = `<li class="inform__item inform__decor">
                                          <p>${informDate}</p>
                                          <p>${informValute[key].Value} ₽</p>
                                       </li>`;

            informElement.insertAdjacentHTML('beforeend', informContent);
          }
        }
      })

    })

    //Показывать подсказку когда мышку навели
    item.addEventListener('mouseenter', (e) => {
      let target = e.target;
      let valuteTitle = target.dataset.title;

      let creatTooltip = document.createElement('div');
      creatTooltip.classList.add('tooltip');
      creatTooltip.innerText = valuteTitle;

      parentItem.appendChild(creatTooltip);
    })

    //Удалять подсказку когда мышку убрали с элемента
    item.addEventListener('mouseleave', () => {
      let tooltipElement = document.querySelector('.tooltip');

      tooltipElement.remove();
    })
  })
}

//Создание элемента
const creatEl = ({
  CharCode,
  Name,
  Previous,
  Value
}) => {
  listEl.insertAdjacentHTML('beforeend', `
  <li class='item'>
    <div class="item__body item__content" data-code='${CharCode}' data-title='${Name}'>
      <p>${CharCode}</p>
      <p><b>${Value} ₽</b></p>
      <p>${(((Value-Previous)/Previous)*100).toFixed(2)}%</p>
    </div>
  </li>
  `)
}

const getInfo = async (url) => {
  try {
    let data = await takeData(url);

    //Предыдущие значения валют
    let prevtUrl = data.PreviousURL;
    //Значения валют
    const valute = data.Valute;

    //Вывод даты в заголовке
    headerApp.innerText = `Курс валют на ${data.Date.substr(0, 10)}`;


    //Получение массива данных за последние 10 дней
    for (let i = 1; i <= 10; i++) {
      data = await takeData(prevtUrl);
      arrObj.push(data);
      prevtUrl = data.PreviousURL;
    }

    //Создание элементов на странице
    for (const key in valute) {
      const element = valute[key];
      //Функция создания элемента
      creatEl(element);
    }

    //Навешивание клика
    addAction();
  } catch (error) {
    console.warn(error);
  }
}

getInfo(mainUrl);