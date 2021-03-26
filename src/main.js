// Dom Elements
const container = document.querySelector('.app__container');
const btnCheck = document.querySelector('.btn--check');
const btnReSort = document.querySelector('.btn--resort');
let personDesc;

// App class
class App {
  constructor() {
    this.init();
    btnCheck.addEventListener('click', this.check.bind(this));
    btnReSort.addEventListener('click', this.resort.bind(this));
  }

  async init() {
    const getData = async function () {
      const forbes = await require('forbes-list');
      const forbesList = await forbes.list({ limit: 10 });
      return forbesList;
    };
    this.data = await getData();
    this.resort();
  }

  displayArr(arr) {
    // functions
    const replace = function (arr, i1, i2) {
      const firstEl = arr[i1];
      const secondEl = arr[i2];
      arr[i2] = firstEl;
      arr[i1] = secondEl;
    };
    const displayEl = function (data, id) {
      const { personName: name, state, birthDate, thumbnail: imgPath } = data;
      const age = (() =>
        new Date().getFullYear() - new Date(birthDate).getFullYear())();
      const html = `
          <div class="person">
            <div class="person__rank person__rank--${
              id <= 3 ? id : 'solid'
            }">${id}</div>
            <div class="person__desc" draggable="true">
              <div class="person__info">
                <div class="person__header">Name</div>
                <div class="person__text">${name}</div>
              </div>
              <div class="person__info">
                <div class="person__header">State</div>
                <div class="person__text">${state || 'unkown'}</div>
              </div>
              <div class="person__info">
                <div class="person__header">Age</div>
                <div class="person__text">${age}</div>
              </div>
            </div>
            <img
              src="${imgPath}"
              alt=""
              srcset=""
              class="person__img"
            />
          </div>
    `;

      container.insertAdjacentHTML('beforeend', html);
    };
    // clearing container
    container.innerHTML = '';

    //displaying elements
    arr.forEach((data, i) => {
      displayEl(data, i + 1);
    });

    // Adding dragging event
    personDesc = document.querySelectorAll('.person__desc');
    personDesc.forEach((desc, i) => {
      desc.addEventListener('dragstart', function (e) {
        desc.classList.add('dragging');
        console.log(e);
        e.dataTransfer.setData('text/plain', i + '');
      });
      desc.addEventListener('dragend', () => {
        desc.classList.remove('dragging');
      });
      desc.addEventListener('dragover', e => {
        e.preventDefault();
        desc.classList.add('draggingover');
      });
      desc.addEventListener('dragleave', () => {
        desc.classList.remove('draggingover');
      });
      desc.addEventListener('drop', e => {
        e.preventDefault();
        desc.classList.remove('draggingover');
        const dragStartingIndex = e.dataTransfer.getData('text/plain');
        replace(this.curData, i, dragStartingIndex);
        this.displayArr(this.curData);
      });
    });
  }

  check() {
    personDesc = document.querySelectorAll('.person__desc');
    this.curData.forEach((data, i) => {
      console.log(this.data);
      if (data.personName == this.data[i].personName) {
        personDesc[i].classList.add('true');
      } else {
        personDesc[i].classList.add('false');
      }
      setTimeout(() => {
        personDesc[i].classList.remove('true');
        personDesc[i].classList.remove('false');
      }, 2000);
    });
  }

  resort() {
    const getRandomSort = function (arr) {
      return [...arr].sort(() => 0.5 - Math.random());
    };
    this.curData = getRandomSort(this.data);
    this.displayArr(this.curData);
  }
}

const app = new App();
