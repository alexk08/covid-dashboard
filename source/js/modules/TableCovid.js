const SWITCH = {
  left: 'left',
  right: 'right',
  title: 'title',
};

const OPTIONS_NAMES = ['Confirmed', 'Dead', 'Recovered'];
const SWITCHES_NAMES = ['All period', 'Last day', 'All period 100000', 'Last day 100000'];

const DATA_ATTRIBUTE = {
  option: 'option',
  switch: 'switch',
};

export class TableCovid {
  constructor(rootElement, mainPage) {
    this.rootElement = rootElement;
    this.country = null;
    this.dataAttributeOption = DATA_ATTRIBUTE.option;
    this.dataAttributeSwitch = DATA_ATTRIBUTE.switch;
    this.mainPage = mainPage;
    this.onSwitchesClick = this.onSwitchesClick.bind(this);
    this.onOptionsClick = this.onOptionsClick.bind(this);
    this.liMenuVisibility = false;
    this.dataCurrent = null;
  }

  init() {
    this.renderContent();
  }

  renderContent() {
    const containerGlobalInformation = document.createElement('div');
    const globalInformationTitle = document.createElement('div');
    const globalInformationCount = document.createElement('div');

    const containerSwitcher = document.createElement('div');
    const switcherLeft = document.createElement('div');
    this.switcherText = document.createElement('div');
    const switcherRight = document.createElement('div');

    const fullScreenButton = document.createElement('i');
    fullScreenButton.classList.add('fa', 'fa-arrows-alt', 'fa-sm', 'container-table__fullscreen');
    fullScreenButton.setAttribute('aria-hidden', 'true');

    const navConfirmed = document.createElement('nav');
    const ulConfirmed = document.createElement('ul');

    const containerOptions = document.createElement('div');

    for (let i = 0; i < 3; i += 1) {
      const option = document.createElement('div');
      option.textContent = OPTIONS_NAMES[i];
      option.dataset[this.dataAttributeOption] = OPTIONS_NAMES[i];
      option.classList.add('container-table-options__item');
      containerOptions.append(option);
    }

    this.rootElement.classList.add('container-table');
    containerGlobalInformation.classList.add('container-global-information');
    globalInformationTitle.classList.add('container-global-information__title');
    globalInformationCount.classList.add('container-global-information__count');
    containerSwitcher.classList.add('container-switcher');
    switcherLeft.classList.add('container-switcher__left');
    this.switcherText.classList.add('container-switcher__title');
    switcherRight.classList.add('container-switcher__right');
    switcherLeft.textContent = '<';
    switcherRight.textContent = '>';
    this.switcherText.textContent = 'All period';
    switcherLeft.dataset[this.dataAttributeSwitch] = SWITCH.left;
    switcherRight.dataset[this.dataAttributeSwitch] = SWITCH.right;
    globalInformationTitle.textContent = 'Global';

    containerGlobalInformation.append(globalInformationTitle, globalInformationCount);

    navConfirmed.classList.add('nav');
    ulConfirmed.classList.add('nav', 'menu');

    containerOptions.classList.add('container-table-options');

    navConfirmed.append(ulConfirmed);
    containerSwitcher.append(switcherLeft, this.switcherText, switcherRight);

    this.rootElement.append(fullScreenButton, containerGlobalInformation, containerSwitcher, navConfirmed, containerOptions);
    this.getData();
  }

  getData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://disease.sh/v3/covid-19/countries', true);
    xhr.responseType = 'json';
    xhr.send();

    xhr.onload = () => {
      this.data = xhr.response;
      const sortCountry = this.sortData(this.data);
      this.dataCurrent = sortCountry;
      this.drawTable(sortCountry);
      this.addListeners();
    };
  }

  drawTable(data) {
    const navMenu = document.querySelector('.nav.menu');
    const buttons = document.querySelectorAll('.container-table-options__item');
    this.changeActiveButton(buttons);

    for (let i = 0; i < data.length; i += 1) {
      const liMenu = document.createElement('li');
      const country = document.createElement('div');
      const count = document.createElement('div');

      liMenu.classList.add('menu-item');
      country.classList.add('menu-item__country');
      count.classList.add('menu-item__count');
      liMenu.append(country, count);
      navMenu.append(liMenu);

      liMenu.addEventListener('click', () => {
        if (this.liMenuVisibility) {
          this.clearTable();
          const sortCountry = this.sortData(this.data);
          this.dataCurrent = sortCountry;
          this.drawTable(this.dataCurrent);
          this.renderTable(this.dataCurrent);
          this.liMenuVisibility = false;
          this.country = null;
          this.mainPage.selectedCountryName = this.country;
          this.mainPage.showRateByCountry();
        } else {
          this.clearTable();
          const sortCountry = this.sortData(this.data);
          this.dataCurrent = [sortCountry[i]];
          this.drawTable(this.dataCurrent);
          this.renderTable(this.dataCurrent);
          this.liMenuVisibility = true;
          this.country = sortCountry[i].country;
          this.mainPage.selectedCountryName = this.country;
          this.mainPage.showRateByCountry();
        }
      });
    }

    this.renderTable(data);
    this.renderGlobal();
  }

  addListeners() {
    document.querySelector('.container-switcher').addEventListener('click', this.onSwitchesClick);
    document.querySelector('.container-table-options').addEventListener('click', this.onOptionsClick);
    document.querySelector('.container-table__fullscreen').addEventListener('click', this.onFullScreen);
  }

  onSwitchesClick({target}) {
    const dataSwitch = target.dataset[this.dataAttributeSwitch];
    if (dataSwitch) {
      this.mainPage.changeSwithesIndex(dataSwitch, SWITCH.right, SWITCH.left);
      this.changeTable();
    }
  }

  onOptionsClick({target}) {
    const dataOption = target.dataset[this.dataAttributeOption];
    if (dataOption) {
      this.mainPage.changeOptionsIndex(dataOption, OPTIONS_NAMES);
      this.changeTable();
    }
  }

  renderTable(data) {
    const menuItemsCountry = document.querySelectorAll('.menu-item__country');
    const menuItemsCount = document.querySelectorAll('.menu-item__count');
    const buttons = document.querySelectorAll('.container-table-options__item');
    this.changeActiveButton(buttons);

    for (let i = 0; i < data.length; i += 1) {
      menuItemsCountry[i].textContent = data[i].country;
      if (this.mainPage.switchesIndex === 0 && this.mainPage.optionsIndex === 0) {
        menuItemsCount[i].textContent = data[i].cases;
      } else if (this.mainPage.switchesIndex === 0 && this.mainPage.optionsIndex === 1) {
        menuItemsCount[i].textContent = data[i].deaths;
      } else if (this.mainPage.switchesIndex === 0 && this.mainPage.optionsIndex === 2) {
        menuItemsCount[i].textContent = data[i].recovered;
      } else if (this.mainPage.switchesIndex === 1 && this.mainPage.optionsIndex === 0) {
        menuItemsCount[i].textContent = data[i].todayCases;
      } else if (this.mainPage.switchesIndex === 1 && this.mainPage.optionsIndex === 1) {
        menuItemsCount[i].textContent = data[i].todayDeaths;
      } else if (this.mainPage.switchesIndex === 1 && this.mainPage.optionsIndex === 2) {
        menuItemsCount[i].textContent = data[i].todayRecovered;
      } else if (this.mainPage.switchesIndex === 2 && this.mainPage.optionsIndex === 0) {
        menuItemsCount[i].textContent = data[i].allThousandCases;
      } else if (this.mainPage.switchesIndex === 2 && this.mainPage.optionsIndex === 1) {
        menuItemsCount[i].textContent = data[i].allThousandDeaths;
      } else if (this.mainPage.switchesIndex === 2 && this.mainPage.optionsIndex === 2) {
        menuItemsCount[i].textContent = data[i].allThousandRecovered;
      } else if (this.mainPage.switchesIndex === 3 && this.mainPage.optionsIndex === 0) {
        menuItemsCount[i].textContent = data[i].lastThousandCases;
      } else if (this.mainPage.switchesIndex === 3 && this.mainPage.optionsIndex === 1) {
        menuItemsCount[i].textContent = data[i].lastThousandDeaths;
      } else if (this.mainPage.switchesIndex === 3 && this.mainPage.optionsIndex === 2) {
        menuItemsCount[i].textContent = data[i].lastThousandRecovered;
      }
    }
  }

  renderGlobal() {
    const globalCountElement = document.querySelector('.container-global-information__count');
    const sortCountry = this.sortData(this.data);

    if (this.mainPage.switchesIndex === 0 && this.mainPage.optionsIndex === 0) {
      globalCountElement.textContent = sortCountry.map((value) => value.cases).reduce((previousValue, currentValue) => previousValue + currentValue);
    } else if (this.mainPage.switchesIndex === 0 && this.mainPage.optionsIndex === 1) {
      globalCountElement.textContent = sortCountry.map((value) => value.deaths).reduce((previousValue, currentValue) => previousValue + currentValue);
    } else if (this.mainPage.switchesIndex === 0 && this.mainPage.optionsIndex === 2) {
      globalCountElement.textContent = sortCountry.map((value) => value.recovered).reduce((previousValue, currentValue) => previousValue + currentValue);
    } else if (this.mainPage.switchesIndex === 1 && this.mainPage.optionsIndex === 0) {
      globalCountElement.textContent = sortCountry.map((value) => value.todayCases).reduce((previousValue, currentValue) => previousValue + currentValue);
    } else if (this.mainPage.switchesIndex === 1 && this.mainPage.optionsIndex === 1) {
      globalCountElement.textContent = sortCountry.map((value) => value.todayDeaths).reduce((previousValue, currentValue) => previousValue + currentValue);
    } else if (this.mainPage.switchesIndex === 1 && this.mainPage.optionsIndex === 2) {
      globalCountElement.textContent = sortCountry.map((value) => value.todayRecovered).reduce((previousValue, currentValue) => previousValue + currentValue);
    } else if (this.mainPage.switchesIndex === 2 && this.mainPage.optionsIndex === 0) {
      globalCountElement.textContent = sortCountry.map((value) => value.allThousandCases).reduce((previousValue, currentValue) => previousValue + currentValue);
    } else if (this.mainPage.switchesIndex === 2 && this.mainPage.optionsIndex === 1) {
      globalCountElement.textContent = sortCountry.map((value) => value.allThousandDeaths).reduce((previousValue, currentValue) => previousValue + currentValue);
    } else if (this.mainPage.switchesIndex === 2 && this.mainPage.optionsIndex === 2) {
      globalCountElement.textContent = sortCountry.map((value) => value.allThousandRecovered).reduce((previousValue, currentValue) => previousValue + currentValue);
    } else if (this.mainPage.switchesIndex === 3 && this.mainPage.optionsIndex === 0) {
      globalCountElement.textContent = sortCountry.map((value) => value.lastThousandCases).reduce((previousValue, currentValue) => previousValue + currentValue).toFixed(2);
    } else if (this.mainPage.switchesIndex === 3 && this.mainPage.optionsIndex === 1) {
      globalCountElement.textContent = sortCountry.map((value) => value.lastThousandDeaths).reduce((previousValue, currentValue) => previousValue + currentValue).toFixed(2);
    } else if (this.mainPage.switchesIndex === 3 && this.mainPage.optionsIndex === 2) {
      globalCountElement.textContent = sortCountry.map((value) => value.lastThousandRecovered).reduce((previousValue, currentValue) => previousValue + currentValue).toFixed(2);
    }
  }

  changeTable() {
    this.switcherText.textContent = SWITCHES_NAMES[this.mainPage.switchesIndex];
    this.renderTable(this.dataCurrent);
    this.renderGlobal();
  }

  sortData(data) {
    const sortCountry = [];
    for (let i = 0; i < data.length; i += 1) {
      const lastThousandCases = isNaN(+((data[i].todayCases / data[i].population * 100000).toFixed(2))) ? 0 : +((data[i].todayCases / data[i].population * 100000).toFixed(2));
      const lastThousandDeaths = isNaN(+((data[i].todayDeaths / data[i].population * 100000).toFixed(2))) ? 0 : +((data[i].todayDeaths / data[i].population * 100000).toFixed(2));
      const lastThousandRecovered = isNaN(+((data[i].todayRecovered / data[i].population * 100000).toFixed(2))) ? 0 : +((data[i].todayRecovered / data[i].population * 100000).toFixed(2));

      let obj = {
        'country': data[i].country,
        'cases': data[i].cases,
        'deaths': data[i].deaths,
        'recovered': data[i].recovered,
        'todayCases': data[i].todayCases,
        'todayDeaths': data[i].todayDeaths,
        'todayRecovered': data[i].todayRecovered,
        'allThousandCases': +((data[i].casesPerOneMillion / 10).toFixed()),
        'allThousandDeaths': +((data[i].deathsPerOneMillion / 10).toFixed()),
        'allThousandRecovered': +((data[i].recoveredPerOneMillion / 10).toFixed()),
        'lastThousandCases': lastThousandCases,
        'lastThousandDeaths': lastThousandDeaths,
        'lastThousandRecovered': lastThousandRecovered,
      };
      sortCountry.push(obj);
    }
    sortCountry.sort();

    return sortCountry;
  }

  clearTable() {
    const navMenu = document.querySelector('.nav.menu');
    const menuItem = document.querySelectorAll('.menu-item');
    for (let i = 0; i < menuItem.length; i += 1) {
      navMenu.removeChild(menuItem[i]);
    }
  }

  changeActiveButton(arrayButtons) {
    for (let i = 0; i < arrayButtons.length; i += 1) {
      arrayButtons[i].classList.remove('active-background');
    }
    arrayButtons[this.mainPage.optionsIndex].classList.add('active-background');
  }

  selectCountry(name) {
    if (name !== null) {
      const sortCountry = this.sortData(this.data);
      const selectedCountry = sortCountry.find((value) => name === value.country);
      this.dataCurrent = [selectedCountry];
      this.clearTable();
      this.liMenuVisibility = true;
      this.drawTable([selectedCountry]);
    }
  }

  onFullScreen() {
    document.querySelector('.container-list').classList.toggle('visibility');
    document.querySelector('.map-container').classList.toggle('visibility');
    document.querySelector('.container-graphic').classList.toggle('visibility');
    document.querySelector('.main').classList.toggle('main-full-screen');

    document.querySelector('.container-table').classList.toggle('full-screen');
  }
}
