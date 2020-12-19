export class TableCovid {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.country = null;
    this.indexOfCountry = null;
  }

  init() {
    this.renderContent();
  }

  renderContent() {
    const containerTable = document.createElement('div');

    const navConfirmed = document.createElement('nav');
    const ulConfirmed = document.createElement('ul');

    const containerOptions = document.createElement('div');

    for (let i = 0; i < 3; i += 1) {
      const option = document.createElement('div');
      switch (i) {
        case 0:
          option.textContent = 'Confirmed';
          break;
        case 1:
          option.textContent = 'Dead';
          break;
        case 2:
          option.textContent = 'Recovered';
          break;
      }
      option.classList.add('options__item');
      containerOptions.append(option);
    }

    containerTable.classList.add('container-table');
    navConfirmed.classList.add('nav');
    ulConfirmed.classList.add('nav', 'menu');

    containerOptions.classList.add('options');

    navConfirmed.append(ulConfirmed);

    containerTable.append(navConfirmed, containerOptions);
    this.rootElement.append(containerTable);
    this.getData();
  }

  getData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.covid19api.com/summary', true);
    xhr.responseType = 'json';
    xhr.send();

    xhr.onload = () => {
      this.data = xhr.response;
      this.addListeners(this.data);
      document.querySelectorAll('.options__item')[0].click();
    };
  }

  addListeners(data) {
    const confirmedButton = document.querySelectorAll('.options__item')[0];
    const deadButton = document.querySelectorAll('.options__item')[1];
    const recoveredButton = document.querySelectorAll('.options__item')[2];

    const navMenu = document.querySelector('.nav.menu');

    confirmedButton.addEventListener('click', () => {
      this.clearTable();
      if (this.liMenuVisibility) {
        const liMenu = document.createElement('li');
        const country = document.createElement('div');
        const count = document.createElement('div');
        country.textContent = this.country;
        count.textContent = data.Countries[this.indexOfCountry].TotalConfirmed;
        liMenu.classList.add('menu-item');
        country.classList.add('menu-item__country');
        count.classList.add('menu-item__count');
        liMenu.append(country, count);
        navMenu.append(liMenu);

        liMenu.addEventListener('click', () => {
          if (this.liMenuVisibility) {
            this.liMenuVisibility = false;
            confirmedButton.click();
          }
        });
      } else {
        for (let i = 0; i < data.Countries.length; i += 1) {
          const liMenu = document.createElement('li');
          const country = document.createElement('div');
          const count = document.createElement('div');
          country.textContent = data.Countries[i].Country;
          count.textContent = data.Countries[i].TotalConfirmed;
          liMenu.classList.add('menu-item');
          country.classList.add('menu-item__country');
          count.classList.add('menu-item__count');
          liMenu.append(country, count);
          navMenu.append(liMenu);

          liMenu.addEventListener('click', () => {
            if (this.liMenuVisibility) {
              this.liMenuVisibility = false;
              confirmedButton.click();
            } else {
              this.clearTable();
              liMenu.append(country, count);
              navMenu.append(liMenu);
              this.liMenuVisibility = true;
              this.country = data.Countries[i].Country;
              this.indexOfCountry = i;
            }
          });
        }
      }
    });

    deadButton.addEventListener('click', () => {
      this.clearTable();
      if (this.liMenuVisibility) {
        const liMenu = document.createElement('li');
        const country = document.createElement('div');
        const count = document.createElement('div');
        country.textContent = this.country;
        count.textContent = data.Countries[this.indexOfCountry].TotalDeaths;
        liMenu.classList.add('menu-item');
        country.classList.add('menu-item__country');
        count.classList.add('menu-item__count');
        liMenu.append(country, count);
        navMenu.append(liMenu);

        liMenu.addEventListener('click', () => {
          if (this.liMenuVisibility) {
            this.liMenuVisibility = false;
            deadButton.click();
          }
        });
      } else {
        for (let i = 0; i < data.Countries.length; i += 1) {
          const liMenu = document.createElement('li');
          const country = document.createElement('div');
          const count = document.createElement('div');
          country.textContent = data.Countries[i].Country;
          count.textContent = data.Countries[i].TotalDeaths;
          liMenu.classList.add('menu-item');
          country.classList.add('menu-item__country');
          count.classList.add('menu-item__count');
          liMenu.append(country, count);
          navMenu.append(liMenu);

          liMenu.addEventListener('click', () => {
            if (this.liMenuVisibility) {
              this.liMenuVisibility = false;
              deadButton.click();
            } else {
              this.clearTable();
              liMenu.append(country, count);
              navMenu.append(liMenu);
              this.liMenuVisibility = true;
              this.country = data.Countries[i].Country;
              this.indexOfCountry = i;
            }
          });
        }
      }
    });

    recoveredButton.addEventListener('click', () => {
      this.clearTable();
      if (this.liMenuVisibility) {
        const liMenu = document.createElement('li');
        const country = document.createElement('div');
        const count = document.createElement('div');
        country.textContent = this.country;
        count.textContent = data.Countries[this.indexOfCountry].TotalRecovered;
        liMenu.classList.add('menu-item');
        country.classList.add('menu-item__country');
        count.classList.add('menu-item__count');
        liMenu.append(country, count);
        navMenu.append(liMenu);

        liMenu.addEventListener('click', () => {
          if (this.liMenuVisibility) {
            this.liMenuVisibility = false;
            recoveredButton.click();
          }
        });
      } else {
        for (let i = 0; i < data.Countries.length; i += 1) {
          const liMenu = document.createElement('li');
          const country = document.createElement('div');
          const count = document.createElement('div');
          country.textContent = data.Countries[i].Country;
          count.textContent = data.Countries[i].TotalRecovered;
          liMenu.classList.add('menu-item');
          country.classList.add('menu-item__country');
          count.classList.add('menu-item__count');
          liMenu.append(country, count);
          navMenu.append(liMenu);

          liMenu.addEventListener('click', () => {
            if (this.liMenuVisibility) {
              this.liMenuVisibility = false;
              recoveredButton.click();
            } else {
              this.clearTable();
              liMenu.append(country, count);
              navMenu.append(liMenu);
              this.liMenuVisibility = true;
              this.country = data.Countries[i].Country;
              this.indexOfCountry = i;
            }
          });
        }
      }
    });
  }

  clearTable() {
    const navMenu = document.querySelector('.nav.menu');
    const menuItem = document.querySelectorAll('.menu-item');
    for (let i = 0; i < menuItem.length; i += 1) {
      navMenu.removeChild(menuItem[i]);
    }
  }
}
