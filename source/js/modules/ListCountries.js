export class ListCountries {
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
    const containerList = document.createElement('div');

    const searchContainer = document.createElement('div');
    const searchText = document.createElement('textarea');
    const searchField = document.createElement('ul');
    searchText.setAttribute('placeholder', 'Click here');
    searchText.setAttribute('maxlength', '30');

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
      option.classList.add('container-list-options__item');
      containerOptions.append(option);
    }

    containerList.classList.add('container-list');
    searchContainer.classList.add('container-search');
    searchText.classList.add('use-keyboard-input');
    searchField.classList.add('container-search-list', 'visibility');
    containerSwitcher.classList.add('container-switcher');
    switcherLeft.classList.add('container-switcher__left');
    switcherText.classList.add('container-switcher__title');
    switcherRight.classList.add('container-switcher__right');
    switcherLeft.textContent = '<';
    switcherRight.textContent = '>';
    switcherText.textContent = 'All period';

    searchContainer.append(searchText, searchField);
    navConfirmed.classList.add('container-list-nav');
    ulConfirmed.classList.add('container-list-nav', 'container-list-menu');

    containerOptions.classList.add('container-list-options');

    navConfirmed.append(ulConfirmed);
    containerSwitcher.append(switcherLeft, switcherText, switcherRight);

    containerList.append(searchContainer, containerSwitcher, navConfirmed, containerOptions);
    this.rootElement.append(containerList);
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
      document.querySelectorAll('.container-list-options__item')[0].click();
    };
  }

  addListeners() {
    const confirmedButton = document.querySelectorAll('.container-list-options__item')[0];
    const deadButton = document.querySelectorAll('.container-list-options__item')[1];
    const recoveredButton = document.querySelectorAll('.container-list-options__item')[2];

    this.clickBottomPanel(confirmedButton, 'Confirmed', this.data);
    this.clickBottomPanel(deadButton, 'Dead', this.data);
    this.clickBottomPanel(recoveredButton, 'Recovered', this.data);
  }

  clickBottomPanel(button, statusBottom, data) {
    const navMenu = document.querySelector('.container-list-nav.container-list-menu');
    const buttons = document.querySelectorAll('.container-list-options__item');
    button.addEventListener('click', () => {
      this.clearTable();
      this.installActiveButton(buttons);
      button.classList.toggle('active-background');
      document.querySelector('.use-keyboard-input').value = '';

      const sortCountry = this.sortData(data, statusBottom);
      this.clickSearch(document.querySelector('.use-keyboard-input'), sortCountry, statusBottom);

      for (let i = 0; i < sortCountry.length; i += 1) {
        const liMenu = document.createElement('li');
        const flagDiv = document.createElement('div');
        const flagImg = document.createElement('img');
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
        liMenu.classList.add('container-list-menu-item');
        country.classList.add('container-list-menu-item__country');
        count.classList.add('container-list-menu-item__count');
        flagDiv.classList.add('flag-container');
        flagImg.setAttribute('src', `${sortCountry[i].flag}`);
        flagImg.setAttribute('alt', `flag ${sortCountry[i].country}`);

        flagDiv.append(flagImg);
        liMenu.append(flagDiv, country, count);
        navMenu.append(liMenu);

        liMenu.addEventListener('click', () => {
          console.log('Я тут');
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

  sortData(data, statusBottom) {
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
        'allThousandCases': +((data[i].casesPerOneMillion * 10).toFixed()),
        'allThousandDeaths': +((data[i].deathsPerOneMillion * 10).toFixed()),
        'allThousandRecovered': +((data[i].recoveredPerOneMillion * 10).toFixed()),
        'lastThousandCases': +((data[i].todayCases / data[i].population * 100000).toFixed(2)),
        'lastThousandDeaths': +((data[i].todayDeaths / data[i].population * 100000).toFixed(2)),
        'lastThousandRecovered': +((data[i].todayRecovered / data[i].population * 100000).toFixed(2)),
        'flag': data[i].countryInfo.flag,
      };
      sortCountry.push(obj);
    }

    if (this.dataAttributeHeaderSwitcher === 'All period') {
      if (statusBottom === 'Confirmed') {
        sortCountry.sort((a, b) => b.cases - a.cases);
      } else if (statusBottom === 'Dead') {
        sortCountry.sort((a, b) => b.deaths - a.deaths);
      } else {
        sortCountry.sort((a, b) => b.recovered - a.recovered);
      }
    } else if (this.dataAttributeHeaderSwitcher === 'Last day') {
      if (statusBottom === 'Confirmed') {
        sortCountry.sort((a, b) => b.todayCases - a.todayCases);
      } else if (statusBottom === 'Dead') {
        sortCountry.sort((a, b) => b.todayDeaths - a.todayDeaths);
      } else {
        sortCountry.sort((a, b) => b.todayRecovered - a.todayRecovered);
      }
    } else if (this.dataAttributeHeaderSwitcher === 'All period 100000') {
      if (statusBottom === 'Confirmed') {
        sortCountry.sort((a, b) => b.allThousandCases - a.allThousandCases);
      } else if (statusBottom === 'Dead') {
        sortCountry.sort((a, b) => b.allThousandDeaths - a.allThousandDeaths);
      } else {
        sortCountry.sort((a, b) => b.allThousandRecovered - a.allThousandRecovered);
      }
    } else if (this.dataAttributeHeaderSwitcher === 'Last day 100000') {
      if (statusBottom === 'Confirmed') {
        sortCountry.sort((a, b) => b.lastThousandCases - a.lastThousandCases);
      } else if (statusBottom === 'Dead') {
        sortCountry.sort((a, b) => b.lastThousandDeaths - a.lastThousandDeaths);
      } else {
        sortCountry.sort((a, b) => b.lastThousandRecovered - a.lastThousandRecovered);
      }
    }

    return sortCountry;
  }

  clickSearch(button, sortArray, statusBottom) {
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
            this.clearTable();
            const menuNav = document.querySelector('.container-list-menu');
            const menuItem = document.createElement('div');

            const flagContainer = document.createElement('div');
            const flagImg = document.createElement('img');
            const country = document.createElement('div');
            const count = document.createElement('div');

            menuItem.classList.add('container-list-menu-item');
            flagContainer.classList.add('flag-container');
            country.classList.add('container-list-menu-item__country');
            count.classList.add('container-list-menu-item__count');

            flagImg.setAttribute('src', `${response[i].flag}`);
            flagImg.setAttribute('alt', `flag ${response[i].country}`);
            country.textContent = response[i].country;
            if (this.dataAttributeHeaderSwitcher === 'All period') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].cases;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].deaths;
              } else {
                count.textContent = response[i].recovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'Last day') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].todayCases;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].todayDeaths;
              } else {
                count.textContent = response[i].todayRecovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'All period 100000') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].allThousandCases;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].allThousandDeaths;
              } else {
                count.textContent = response[i].allThousandRecovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'Last day 100000') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].lastThousandCases;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].lastThousandDeaths;
              } else {
                count.textContent = response[i].lastThousandRecovered;
              }
            }

            flagContainer.append(flagImg);
            menuItem.append(flagContainer, country, count);
            menuNav.append(menuItem);
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
            this.clearTable();
            const menuNav = document.querySelector('.container-list-menu');
            const menuItem = document.createElement('div');

            const flagContainer = document.createElement('div');
            const flagImg = document.createElement('img');
            const country = document.createElement('div');
            const count = document.createElement('div');

            menuItem.classList.add('container-list-menu-item');
            flagContainer.classList.add('flag-container');
            country.classList.add('container-list-menu-item__country');
            count.classList.add('container-list-menu-item__count');

            flagImg.setAttribute('src', `${response[i].flag}`);
            flagImg.setAttribute('alt', `flag ${response[i].country}`);
            country.textContent = response[i].country;
            if (this.dataAttributeHeaderSwitcher === 'All period') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].cases;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].deaths;
              } else {
                count.textContent = response[i].recovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'Last day') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].todayCases;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].todayDeaths;
              } else {
                count.textContent = response[i].todayRecovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'All period 100000') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].allThousandCases;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].allThousandDeaths;
              } else {
                count.textContent = response[i].allThousandRecovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'Last day 100000') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].lastThousandCases;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].lastThousandDeaths;
              } else {
                count.textContent = response[i].lastThousandRecovered;
              }
            }

            flagContainer.append(flagImg);
            menuItem.append(flagContainer, country, count);
            menuNav.append(menuItem);
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

  clearTable() {
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

  installActiveButton(arrayButtons) {
    for (let i = 0; i < arrayButtons.length; i += 1) {
      arrayButtons[i].classList.remove('active-background');
    }
  }
}
