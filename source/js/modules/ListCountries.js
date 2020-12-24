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

export class ListCountries {
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
    const searchContainer = document.createElement('div');
    const searchText = document.createElement('textarea');
    const searchField = document.createElement('ul');
    searchText.setAttribute('placeholder', 'Click here');
    searchText.setAttribute('maxlength', '30');

    const containerSwitcher = document.createElement('div');
    const switcherLeft = document.createElement('div');
    this.switcherText = document.createElement('div');
    const switcherRight = document.createElement('div');

    const fullScreenButton = document.createElement('i');
    fullScreenButton.classList.add('fa', 'fa-arrows-alt', 'fa-sm', 'container-list__fullscreen');
    fullScreenButton.setAttribute('aria-hidden', 'true');

    const navConfirmed = document.createElement('nav');
    const ulConfirmed = document.createElement('ul');

    const containerOptions = document.createElement('div');

    for (let i = 0; i < 3; i += 1) {
      const option = document.createElement('div');
      option.textContent = OPTIONS_NAMES[i];
      option.dataset[this.dataAttributeOption] = OPTIONS_NAMES[i];
      option.classList.add('container-list-options__item');
      containerOptions.append(option);
    }

    this.rootElement.classList.add('container-list');
    searchContainer.classList.add('container-search');
    searchText.classList.add('use-keyboard-input');
    searchField.classList.add('container-search-list', 'visibility');
    containerSwitcher.classList.add('container-list-switcher');
    switcherLeft.classList.add('container-list-switcher__left');
    this.switcherText.classList.add('container-switcher__title');
    switcherRight.classList.add('container-list-switcher__right');
    switcherLeft.textContent = '<';
    switcherRight.textContent = '>';
    this.switcherText.textContent = 'All period';
    switcherLeft.dataset[this.dataAttributeSwitch] = SWITCH.left;
    switcherRight.dataset[this.dataAttributeSwitch] = SWITCH.right;

    searchContainer.append(searchText, searchField);
    navConfirmed.classList.add('container-list-nav');
    ulConfirmed.classList.add('container-list-nav', 'container-list-menu');

    containerOptions.classList.add('container-list-options');

    navConfirmed.append(ulConfirmed);
    containerSwitcher.append(switcherLeft, this.switcherText, switcherRight);

    this.rootElement.append(fullScreenButton, searchContainer, containerSwitcher, navConfirmed, containerOptions);
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
      this.drawList(sortCountry);
      this.addListeners();
    };
  }

  drawList(data) {
    const navMenu = document.querySelector('.container-list-nav.container-list-menu');
    const buttons = document.querySelectorAll('.container-list-options__item');
    this.changeActiveButton(buttons);

    for (let i = 0; i < data.length; i += 1) {
      const liMenu = document.createElement('li');
      const flag = document.createElement('div');
      const imgFlag = document.createElement('img');
      const country = document.createElement('div');
      const count = document.createElement('div');

      liMenu.classList.add('container-list-menu-item');
      flag.classList.add('flag-container');
      imgFlag.classList.add('flag-container__item');
      country.classList.add('container-list-menu-item__country');
      count.classList.add('container-list-menu-item__count');
      flag.append(imgFlag);
      liMenu.append(flag, country, count);
      navMenu.append(liMenu);

      liMenu.addEventListener('click', () => {
        if (this.liMenuVisibility) {
          this.clearList();
          const sortCountry = this.sortData(this.data);
          this.dataCurrent = sortCountry;
          this.drawList(this.dataCurrent);
          this.renderList(this.dataCurrent);
          this.liMenuVisibility = false;
          this.country = null;
          this.mainPage.selectedCountryName = this.country;
          this.mainPage.showRateByCountry();
        } else {
          this.clearList();
          const sortCountry = this.sortData(this.data);
          this.dataCurrent = [sortCountry[i]];
          this.drawList(this.dataCurrent);
          this.renderList(this.dataCurrent);
          this.liMenuVisibility = true;
          this.country = sortCountry[i].country;
          this.mainPage.selectedCountryName = this.country;
          this.mainPage.showRateByCountry();
        }
      });
    }

    this.renderList(data);
    this.clickSearch(document.querySelector('.use-keyboard-input'), this.sortData(this.data));
  }

  addListeners() {
    document.querySelector('.container-list-switcher').addEventListener('click', this.onSwitchesClick);
    document.querySelector('.container-list-options').addEventListener('click', this.onOptionsClick);
    document.querySelector('.container-list__fullscreen').addEventListener('click', this.onFullScreen);
  }

  onSwitchesClick({target}) {
    const dataSwitch = target.dataset[this.dataAttributeSwitch];
    if (dataSwitch) {
      this.mainPage.changeSwithesIndex(dataSwitch, SWITCH.right, SWITCH.left);
      this.changeList();
    }
  }

  onOptionsClick({target}) {
    const dataOption = target.dataset[this.dataAttributeOption];
    if (dataOption) {
      this.mainPage.changeOptionsIndex(dataOption, OPTIONS_NAMES);
      this.changeList();
    }
  }

  changeList() {
    this.switcherText.textContent = SWITCHES_NAMES[this.mainPage.switchesIndex];
    this.renderList(this.dataCurrent);
  }

  renderList(data) {
    const menuItemsCountry = document.querySelectorAll('.container-list-menu-item__country');
    const menuItemsCount = document.querySelectorAll('.container-list-menu-item__count');
    const flag = document.querySelectorAll('.flag-container__item');
    const buttons = document.querySelectorAll('.container-list-options__item');
    this.changeActiveButton(buttons);

    for (let i = 0; i < data.length; i += 1) {
      menuItemsCountry[i].textContent = data[i].country;
      flag[i].setAttribute('src', `${data[i].flag}`);
      flag[i].setAttribute('alt', `${data[i].flag}`);
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

  sortData(data) {
    const sortCountry = [];
    for (let i = 0; i < data.length; i += 1) {
      let obj = {
        'country': data[i].country,
        'cases': data[i].cases,
        'deaths': data[i].deaths,
        'recovered': data[i].recovered,
        'todayCases': data[i].todayCases,
        'todayDeaths': data[i].todayDeaths,
        'todayRecovered': data[i].todayRecovered,
        'allThousandCases': +((data[i].casesPerOneMillion / 10).toFixed(2)),
        'allThousandDeaths': +((data[i].deathsPerOneMillion / 10).toFixed(2)),
        'allThousandRecovered': +((data[i].recoveredPerOneMillion / 10).toFixed(2)),
        'lastThousandCases': +((data[i].todayCases / data[i].population * 100000).toFixed(2)),
        'lastThousandDeaths': +((data[i].todayDeaths / data[i].population * 100000).toFixed(2)),
        'lastThousandRecovered': +((data[i].todayRecovered / data[i].population * 100000).toFixed(2)),
        'flag': data[i].countryInfo.flag,
      };
      sortCountry.push(obj);
    }

    if (this.mainPage.switchesIndex === 0 && this.mainPage.optionsIndex === 0) {
      sortCountry.sort((a, b) => b.cases - a.cases);
    } else if (this.mainPage.switchesIndex === 0 && this.mainPage.optionsIndex === 1) {
      sortCountry.sort((a, b) => b.deaths - a.deaths);
    } else if (this.mainPage.switchesIndex === 0 && this.mainPage.optionsIndex === 2) {
      sortCountry.sort((a, b) => b.recovered - a.recovered);
    } else if (this.mainPage.switchesIndex === 1 && this.mainPage.optionsIndex === 0) {
      sortCountry.sort((a, b) => b.todayCases - a.todayCases);
    } else if (this.mainPage.switchesIndex === 1 && this.mainPage.optionsIndex === 1) {
      sortCountry.sort((a, b) => b.todayDeaths - a.todayDeaths);
    } else if (this.mainPage.switchesIndex === 1 && this.mainPage.optionsIndex === 2) {
      sortCountry.sort((a, b) => b.todayRecovered - a.todayRecovered);
    } else if (this.mainPage.switchesIndex === 2 && this.mainPage.optionsIndex === 0) {
      sortCountry.sort((a, b) => b.allThousandCases - a.allThousandCases);
    } else if (this.mainPage.switchesIndex === 2 && this.mainPage.optionsIndex === 1) {
      sortCountry.sort((a, b) => b.allThousandDeaths - a.allThousandDeaths);
    } else if (this.mainPage.switchesIndex === 2 && this.mainPage.optionsIndex === 2) {
      sortCountry.sort((a, b) => b.allThousandRecovered - a.allThousandRecovered);
    } else if (this.mainPage.switchesIndex === 3 && this.mainPage.optionsIndex === 0) {
      sortCountry.sort((a, b) => b.lastThousandCases - a.lastThousandCases);
    } else if (this.mainPage.switchesIndex === 3 && this.mainPage.optionsIndex === 1) {
      sortCountry.sort((a, b) => b.lastThousandDeaths - a.lastThousandDeaths);
    } else if (this.mainPage.switchesIndex === 3 && this.mainPage.optionsIndex === 2) {
      sortCountry.sort((a, b) => b.lastThousandRecovered - a.lastThousandRecovered);
    }

    return sortCountry;
  }

  clickSearch(button, sortArray) {
    button.addEventListener('click', () => {
      button.addEventListener('keyup', (e) => {
        const searchField = document.querySelector('.container-search-list');
        searchField.classList.remove('visibility');
        this.clearSearch();

        const request = e.target.value.toLowerCase();
        const response = sortArray.filter((value) => value.country.toLowerCase().startsWith(request));

        for (let i = 0; i < response.length; i += 1) {
          const searchItem = document.createElement('li');

          searchItem.textContent = response[i].country;

          searchItem.addEventListener('click', () => {
            searchField.classList.add('visibility');
            document.querySelector('.use-keyboard-input').value = response[i].country;
            this.clearList();
            this.dataCurrent = [response[i]];
            this.drawList(this.dataCurrent);
            this.liMenuVisibility = true;
            this.country = response[i].country;
            this.mainPage.selectedCountryName = this.country;
            this.mainPage.showRateByCountry();
          });
          searchItem.classList.add('container-search-list__item');
          searchField.append(searchItem);
        }
        if (e.target.value.length === 0) {
          searchField.classList.add('visibility');
          this.clearSearch();
        }
      });

      button.addEventListener('click', (e) => {
        const searchField = document.querySelector('.container-search-list');
        searchField.classList.remove('visibility');
        this.clearSearch();

        const request = e.target.value.toLowerCase();
        const response = sortArray.filter((value) => value.country.toLowerCase().startsWith(request));

        for (let i = 0; i < response.length; i += 1) {
          const searchItem = document.createElement('li');

          searchItem.textContent = response[i].country;

          searchItem.addEventListener('click', () => {
            searchField.classList.add('visibility');
            document.querySelector('.use-keyboard-input').value = response[i].country;
            this.clearList();
            this.dataCurrent = [response[i]];
            this.drawList(this.dataCurrent);
            this.liMenuVisibility = true;
            this.country = response[i].country;
            this.mainPage.selectedCountryName = this.country;
            this.mainPage.showRateByCountry();
          });
          searchItem.classList.add('container-search-list__item');
          searchField.append(searchItem);
          if (e.target.value.length === 0) {
            searchField.classList.add('visibility');
            this.clearSearch();
          }
        }
      });
    });
  }

  clearList() {
    const navMenu = document.querySelector('.container-list-nav.container-list-menu');
    const menuItem = document.querySelectorAll('.container-list-menu-item');
    for (let i = 0; i < menuItem.length; i += 1) {
      navMenu.removeChild(menuItem[i]);
    }
  }

  clearSearch() {
    const searchField = document.querySelector('.container-search-list');
    const searchItems = document.querySelectorAll('.container-search-list__item');
    for (let i = 0; i < searchItems.length; i += 1) {
      searchField.removeChild(searchItems[i]);
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
      this.clearList();
      this.liMenuVisibility = true;
      this.drawList([selectedCountry]);
    }
  }

  onFullScreen() {
    document.querySelector('.container-table').classList.toggle('visibility');
    document.querySelector('.map-container').classList.toggle('visibility');
    document.querySelector('.container-graphic').classList.toggle('visibility');
    //containerGraphic.style.display = containerGraphic.style.display === 'flex' ? 'none' : 'flex';
    //console.log('click onFullScreen');
    
    document.querySelector('.main .container').classList.toggle('container-full-screen');
    document.querySelector('.container-list').classList.toggle('full-screen');
  }
}
