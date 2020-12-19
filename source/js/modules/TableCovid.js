export class TableCovid {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.country = null;
    this.indexOfCountry = null;
    this.dataAttributeBottomSwitcher = 'Confirmed';
    this.dataAttributeHeaderSwitcher = 'All period';
  }

  init() {
    this.renderContent();
  }

  renderContent() {
    const containerTable = document.createElement('div');

    const containerSwitcher = document.createElement('div');
    const switcherLeft = document.createElement('div');
    const switcherText = document.createElement('div');
    const switcherRight = document.createElement('div');

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

    containerSwitcher.classList.add('container-switcher');
    switcherLeft.classList.add('container-switcher__left');
    switcherText.classList.add('container-switcher__title');
    switcherRight.classList.add('container-switcher__right');
    switcherLeft.textContent = '<';
    switcherRight.textContent = '>';
    switcherText.textContent = 'All period';

    navConfirmed.classList.add('nav');
    ulConfirmed.classList.add('nav', 'menu');

    containerOptions.classList.add('options');

    navConfirmed.append(ulConfirmed);
    containerSwitcher.append(switcherLeft, switcherText, switcherRight);

    containerTable.append(containerSwitcher, navConfirmed, containerOptions);
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
      const xhrSecond = new XMLHttpRequest();
      xhrSecond.open('GET', 'https://restcountries.eu/rest/v2/all?fields=name;population;flag', true);
      xhrSecond.responseType = 'json';
      xhrSecond.send();

      xhrSecond.onload = () => {
        this.addListeners(xhrSecond.response);
        document.querySelectorAll('.options__item')[0].click();
      };
    };
  }

  addListeners(population) {
    const confirmedButton = document.querySelectorAll('.options__item')[0];
    const deadButton = document.querySelectorAll('.options__item')[1];
    const recoveredButton = document.querySelectorAll('.options__item')[2];

    this.clickBottomPanel(confirmedButton, 'Confirmed', this.data, population);
    this.clickBottomPanel(deadButton, 'Dead', this.data, population);
    this.clickBottomPanel(recoveredButton, 'Recovered', this.data, population);
  }

  clickBottomPanel(button, statusBottom, data, population) {
    const navMenu = document.querySelector('.nav.menu');
    const buttons = document.querySelectorAll('.options__item');
    button.addEventListener('click', () => {
      this.clearTable();
      this.installActiveButton(buttons);
      button.classList.toggle('active');

      const differenceCountry = {
        'Bolivia': 'Bolivia (Plurinational State of)',
        'Cape Verde': 'Cabo Verde',
        'Congo (Brazzaville)': 'Congo',
        'Congo (Kinshasa)': 'Congo (Democratic Republic of the)',
        'Holy See (Vatican City State)': 'Holy See',
        'Iran, Islamic Republic of': 'Iran (Islamic Republic of)',
        'Korea (South)': 'Korea (Republic of)',
        'Lao PDR': 'Lao People\'s Democratic Republic',
        'Macao, SAR China': 'Macao',
        'Macedonia, Republic of': 'Macedonia (the former Yugoslav Republic of)',
        'Moldova': 'Moldova (Republic of)',
        'Palestinian Territory': 'Palestine, State of',
        'Saint Vincent and Grenadines': 'Saint Vincent and the Grenadines',
        'Syrian Arab Republic (Syria)': 'Syrian Arab Republic',
        'Taiwan, Republic of China': 'Taiwan',
        'United Kingdom': 'United Kingdom of Great Britain and Northern Ireland',
        'Venezuela (Bolivarian Republic)': 'Venezuela (Bolivarian Republic of)',
      };

      for (let i = 0; i < data.Countries.length; i += 1) {
        const liMenu = document.createElement('li');
        const country = document.createElement('div');
        const count = document.createElement('div');
        country.textContent = data.Countries[i].Country;
        if (this.dataAttributeHeaderSwitcher === 'All period') {
          if (statusBottom === 'Confirmed') {
            count.textContent = data.Countries[i].TotalConfirmed;
          } else if (statusBottom === 'Dead') {
            count.textContent = data.Countries[i].TotalDeaths;
          } else {
            count.textContent = data.Countries[i].TotalRecovered;
          }
        } else if (this.dataAttributeHeaderSwitcher === 'Last day') {
          if (statusBottom === 'Confirmed') {
            count.textContent = data.Countries[i].NewConfirmed;
          } else if (statusBottom === 'Dead') {
            count.textContent = data.Countries[i].NewDeaths;
          } else {
            count.textContent = data.Countries[i].NewRecovered;
          }
        } else if (this.dataAttributeHeaderSwitcher === 'All period 100000') {
          let index = population.findIndex((value) => value.name === data.Countries[i].Country);
          if (index === -1) {
            index = population.findIndex((value) => value.name === differenceCountry[data.Countries[i].Country]);
          }
          if (statusBottom === 'Confirmed') {
            count.textContent = (data.Countries[i].TotalConfirmed / population[index].population * 100000).toFixed(2);
          } else if (statusBottom === 'Dead') {
            count.textContent = (data.Countries[i].TotalDeaths / population[index].population * 100000).toFixed(2);
          } else {
            count.textContent = (data.Countries[i].TotalRecovered / population[index].population * 100000).toFixed(2);
          }
        } else if (this.dataAttributeHeaderSwitcher === 'Last day 100000') {
          let index = population.findIndex((value) => value.name === data.Countries[i].Country);
          if (index === -1) {
            index = population.findIndex((value) => value.name === differenceCountry[data.Countries[i].Country]);
          }
          if (statusBottom === 'Confirmed') {
            count.textContent = (data.Countries[i].NewConfirmed / population[index].population * 100000).toFixed(2);
          } else if (statusBottom === 'Dead') {
            count.textContent = (data.Countries[i].NewDeaths / population[index].population * 100000).toFixed(2);
          } else {
            count.textContent = (data.Countries[i].NewRecovered / population[index].population * 100000).toFixed(2);
          }
        }
        liMenu.classList.add('menu-item');
        country.classList.add('menu-item__country');
        count.classList.add('menu-item__count');
        liMenu.append(country, count);
        navMenu.append(liMenu);

        liMenu.addEventListener('click', () => {
          if (this.liMenuVisibility) {
            this.liMenuVisibility = false;
            button.click();
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
    });
  }

  clearTable() {
    const navMenu = document.querySelector('.nav.menu');
    const menuItem = document.querySelectorAll('.menu-item');
    for (let i = 0; i < menuItem.length; i += 1) {
      navMenu.removeChild(menuItem[i]);
    }
  }

  installActiveButton(arrayButtons) {
    for (let i = 0; i < arrayButtons.length; i += 1) {
      arrayButtons[i].classList.remove('active');
    }
  }
}
