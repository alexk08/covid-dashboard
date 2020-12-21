export class TableCovid {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.country = null;
    this.indexOfCountry = null;
    // this.dataAttributeBottomSwitcher = 'Confirmed';
    this.dataAttributeHeaderSwitcher = 'All period';
  }

  init() {
    this.renderContent();
  }

  renderContent() {
    const containerTable = document.createElement('div');

    const containerGlobalInformation = document.createElement('div');
    const globalInformationTitle = document.createElement('div');
    const globalInformationCount = document.createElement('div');

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
    containerGlobalInformation.classList.add('container-global-information');
    globalInformationTitle.classList.add('container-global-information__title');
    globalInformationCount.classList.add('container-global-information__count');
    containerSwitcher.classList.add('container-switcher');
    switcherLeft.classList.add('container-switcher__left');
    switcherText.classList.add('container-switcher__title');
    switcherRight.classList.add('container-switcher__right');
    switcherLeft.textContent = '<';
    switcherRight.textContent = '>';
    switcherText.textContent = 'All period';
    globalInformationTitle.textContent = 'Global';

    containerGlobalInformation.append(globalInformationTitle, globalInformationCount);

    navConfirmed.classList.add('nav');
    ulConfirmed.classList.add('nav', 'menu');

    containerOptions.classList.add('options');

    navConfirmed.append(ulConfirmed);
    containerSwitcher.append(switcherLeft, switcherText, switcherRight);

    containerTable.append(containerGlobalInformation, containerSwitcher, navConfirmed, containerOptions);
    this.rootElement.append(containerTable);
    this.getData();
  }

  getData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://disease.sh/v3/covid-19/countries', true);
    xhr.responseType = 'json';
    xhr.send();

    xhr.onload = () => {
      this.data = xhr.response;
      this.addListeners();
      document.querySelectorAll('.options__item')[0].click();
    };
  }

  addListeners() {
    const confirmedButton = document.querySelectorAll('.options__item')[0];
    const deadButton = document.querySelectorAll('.options__item')[1];
    const recoveredButton = document.querySelectorAll('.options__item')[2];

    this.clickBottomPanel(confirmedButton, 'Confirmed', this.data);
    this.clickBottomPanel(deadButton, 'Dead', this.data);
    this.clickBottomPanel(recoveredButton, 'Recovered', this.data);
  }

  clickBottomPanel(button, statusBottom, data) {
    const navMenu = document.querySelector('.nav.menu');
    const buttons = document.querySelectorAll('.options__item');
    const globalCountElement = document.querySelector('.container-global-information__count');

    button.addEventListener('click', () => {
      this.clearTable();
      this.installActiveButton(buttons);
      button.classList.toggle('active-background');

      const sortCountry = this.sortData(data, statusBottom);
      if (this.dataAttributeHeaderSwitcher === 'All period') {
        if (statusBottom === 'Confirmed') {
          const globalCount = sortCountry.map((value) => value.cases).reduce((previousValue, currentValue) => previousValue + currentValue);
          globalCountElement.textContent = globalCount;
        } else if (statusBottom === 'Dead') {
          const globalCount = sortCountry.map((value) => value.deaths).reduce((previousValue, currentValue) => previousValue + currentValue);
          globalCountElement.textContent = globalCount;
        } else {
          const globalCount = sortCountry.map((value) => value.recovered).reduce((previousValue, currentValue) => previousValue + currentValue);
          globalCountElement.textContent = globalCount;
        }
      } else if (this.dataAttributeHeaderSwitcher === 'Last day') {
        if (statusBottom === 'Confirmed') {
          const globalCount = sortCountry.map((value) => value.todayCases).reduce((previousValue, currentValue) => previousValue + currentValue);
          globalCountElement.textContent = globalCount;
        } else if (statusBottom === 'Dead') {
          const globalCount = sortCountry.map((value) => value.todayDeaths).reduce((previousValue, currentValue) => previousValue + currentValue);
          globalCountElement.textContent = globalCount;
        } else {
          const globalCount = sortCountry.map((value) => value.todayRecovered).reduce((previousValue, currentValue) => previousValue + currentValue);
          globalCountElement.textContent = globalCount;
        }
      } else if (this.dataAttributeHeaderSwitcher === 'All period 100000') {
        if (statusBottom === 'Confirmed') {
          const globalCount = sortCountry.map((value) => value.allThousandCases).reduce((previousValue, currentValue) => previousValue + currentValue);
          globalCountElement.textContent = globalCount;
        } else if (statusBottom === 'Dead') {
          const globalCount = sortCountry.map((value) => value.allThousandDeaths).reduce((previousValue, currentValue) => previousValue + currentValue);
          globalCountElement.textContent = globalCount;
        } else {
          const globalCount = sortCountry.map((value) => value.allThousandRecovered).reduce((previousValue, currentValue) => previousValue + currentValue);
          globalCountElement.textContent = globalCount;
        }
      } else if (this.dataAttributeHeaderSwitcher === 'Last day 100000') {
        if (statusBottom === 'Confirmed') {
          const globalCount = sortCountry.map((value) => value.lastThousandCases).reduce((previousValue, currentValue) => previousValue + currentValue).toFixed(2);
          globalCountElement.textContent = globalCount;
        } else if (statusBottom === 'Dead') {
          const globalCount = sortCountry.map((value) => value.lastThousandDeaths).reduce((previousValue, currentValue) => previousValue + currentValue);
          globalCountElement.textContent = globalCount;
        } else {
          const globalCount = sortCountry.map((value) => value.lastThousandRecovered).reduce((previousValue, currentValue) => previousValue + currentValue);
          globalCountElement.textContent = globalCount;
        }
      }

      for (let i = 0; i < sortCountry.length; i += 1) {
        const liMenu = document.createElement('li');
        const country = document.createElement('div');
        const count = document.createElement('div');
        country.textContent = sortCountry[i].country;
        if (this.dataAttributeHeaderSwitcher === 'All period') {
          if (statusBottom === 'Confirmed') {
            count.textContent = sortCountry[i].cases;
          } else if (statusBottom === 'Dead') {
            count.textContent = sortCountry[i].deaths;
          } else {
            count.textContent = sortCountry[i].recovered;
          }
        } else if (this.dataAttributeHeaderSwitcher === 'Last day') {
          if (statusBottom === 'Confirmed') {
            count.textContent = sortCountry[i].todayCases;
          } else if (statusBottom === 'Dead') {
            count.textContent = sortCountry[i].todayDeaths;
          } else {
            count.textContent = sortCountry[i].todayRecovered;
          }
        } else if (this.dataAttributeHeaderSwitcher === 'All period 100000') {
          if (statusBottom === 'Confirmed') {
            count.textContent = sortCountry[i].allThousandCases;
          } else if (statusBottom === 'Dead') {
            count.textContent = sortCountry[i].allThousandDeaths;
          } else {
            count.textContent = sortCountry[i].allThousandRecovered;
          }
        } else if (this.dataAttributeHeaderSwitcher === 'Last day 100000') {
          if (statusBottom === 'Confirmed') {
            count.textContent = sortCountry[i].lastThousandCases;
          } else if (statusBottom === 'Dead') {
            count.textContent = sortCountry[i].lastThousandDeaths;
          } else {
            count.textContent = sortCountry[i].lastThousandRecovered;
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
            this.country = sortCountry[i].country;
            this.indexOfCountry = i;
          }
        });
      }
    });
  }

  sortData(data) {
    const sortCountry = [];
    console.log(data);
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
        'allThousandCases': +((data[i].casesPerOneMillion * 10).toFixed()),
        'allThousandDeaths': +((data[i].deathsPerOneMillion * 10).toFixed()),
        'allThousandRecovered': +((data[i].recoveredPerOneMillion * 10).toFixed()),
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

  installActiveButton(arrayButtons) {
    for (let i = 0; i < arrayButtons.length; i += 1) {
      arrayButtons[i].classList.remove('active-background');
    }
  }
}
