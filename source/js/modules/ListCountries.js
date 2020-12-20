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
        document.querySelectorAll('.container-list-options__item')[0].click();
      };
    };
  }

  addListeners(population) {
    const confirmedButton = document.querySelectorAll('.container-list-options__item')[0];
    const deadButton = document.querySelectorAll('.container-list-options__item')[1];
    const recoveredButton = document.querySelectorAll('.container-list-options__item')[2];

    this.clickBottomPanel(confirmedButton, 'Confirmed', this.data, population);
    this.clickBottomPanel(deadButton, 'Dead', this.data, population);
    this.clickBottomPanel(recoveredButton, 'Recovered', this.data, population);
  }

  clickBottomPanel(button, statusBottom, data, population) {
    const navMenu = document.querySelector('.container-list-nav.container-list-menu');
    const buttons = document.querySelectorAll('.container-list-options__item');
    button.addEventListener('click', () => {
      this.clearTable();
      this.installActiveButton(buttons);
      button.classList.toggle('active-background');
      document.querySelector('.use-keyboard-input').value = '';

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

      const sortCountry = this.sortData(data, statusBottom, population, differenceCountry);
      this.clickSearch(document.querySelector('.use-keyboard-input'), sortCountry);

      for (let i = 0; i < sortCountry.length; i += 1) {
        const liMenu = document.createElement('li');
        const flagDiv = document.createElement('div');
        const flagImg = document.createElement('img');
        const country = document.createElement('div');
        const count = document.createElement('div');
        country.textContent = sortCountry[i].Country;
        let index = index = population.findIndex((value) => value.name === sortCountry[i].Country);
        if (index === -1) {
          index = population.findIndex((value) => value.name === differenceCountry[sortCountry[i].Country]);
        }
        if (this.dataAttributeHeaderSwitcher === 'All period') {
          if (statusBottom === 'Confirmed') {
            count.textContent = sortCountry[i].TotalConfirmed;
          } else if (statusBottom === 'Dead') {
            count.textContent = sortCountry[i].TotalDeaths;
          } else {
            count.textContent = sortCountry[i].TotalRecovered;
          }
        } else if (this.dataAttributeHeaderSwitcher === 'Last day') {
          if (statusBottom === 'Confirmed') {
            count.textContent = sortCountry[i].NewConfirmed;
          } else if (statusBottom === 'Dead') {
            count.textContent = sortCountry[i].NewDeaths;
          } else {
            count.textContent = sortCountry[i].NewRecovered;
          }
        } else if (this.dataAttributeHeaderSwitcher === 'All period 100000') {
          if (statusBottom === 'Confirmed') {
            count.textContent = sortCountry[i].AllThousandConfirmed;
          } else if (statusBottom === 'Dead') {
            count.textContent = sortCountry[i].AllThousandDeaths;
          } else {
            count.textContent = sortCountry[i].AllThousandRecovered;
          }
        } else if (this.dataAttributeHeaderSwitcher === 'Last day 100000') {
          if (statusBottom === 'Confirmed') {
            count.textContent = sortCountry[i].LastThousandConfirmed;
          } else if (statusBottom === 'Dead') {
            count.textContent = sortCountry[i].LastThousandDeaths;
          } else {
            count.textContent = sortCountry[i].LastThousandRecovered;
          }
        }
        liMenu.classList.add('container-list-menu-item');
        country.classList.add('container-list-menu-item__country');
        count.classList.add('container-list-menu-item__count');
        flagDiv.classList.add('flag-container');
        flagImg.setAttribute('src', `${population[index].flag}`);
        flagImg.setAttribute('alt', `flag ${sortCountry[i].Country}`);

        flagDiv.append(flagImg);
        liMenu.append(flagDiv, country, count);
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
            this.country = sortCountry[i].Country;
            this.indexOfCountry = i;
          }
        });
      }
    });
  }

  sortData(data, statusBottom, population, differenceCountry) {
    const sortCountry = [];
    for (let i = 0; i < data.Countries.length; i += 1) {
      let index = index = population.findIndex((value) => value.name === data.Countries[i].Country);
      if (index === -1) {
        index = population.findIndex((value) => value.name === differenceCountry[data.Countries[i].Country]);
      }
      let obj = {
        'Country': data.Countries[i].Country,
        'TotalConfirmed': data.Countries[i].TotalConfirmed,
        'TotalDeaths': data.Countries[i].TotalDeaths,
        'TotalRecovered': data.Countries[i].TotalRecovered,
        'NewConfirmed': data.Countries[i].NewConfirmed,
        'NewDeaths': data.Countries[i].NewDeaths,
        'NewRecovered': data.Countries[i].NewRecovered,
        'AllThousandConfirmed': +((data.Countries[i].TotalConfirmed / population[index].population * 100000).toFixed(2)),
        'AllThousandDeaths': +((data.Countries[i].TotalDeaths / population[index].population * 100000).toFixed(2)),
        'AllThousandRecovered': +((data.Countries[i].TotalRecovered / population[index].population * 100000).toFixed(2)),
        'LastThousandConfirmed': +((data.Countries[i].NewConfirmed / population[index].population * 100000).toFixed(2)),
        'LastThousandDeaths': +((data.Countries[i].NewDeaths / population[index].population * 100000).toFixed(2)),
        'LastThousandRecovered': +((data.Countries[i].NewRecovered / population[index].population * 100000).toFixed(2)),
        'Flag': population[index].flag,
      };
      sortCountry.push(obj);
    }

    if (this.dataAttributeHeaderSwitcher === 'All period') {
      if (statusBottom === 'Confirmed') {
        sortCountry.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
      } else if (statusBottom === 'Dead') {
        sortCountry.sort((a, b) => b.TotalDeaths - a.TotalDeaths);
      } else {
        sortCountry.sort((a, b) => b.TotalRecovered - a.TotalRecovered);
      }
    } else if (this.dataAttributeHeaderSwitcher === 'Last day') {
      if (statusBottom === 'Confirmed') {
        sortCountry.sort((a, b) => b.NewConfirmed - a.NewConfirmed);
      } else if (statusBottom === 'Dead') {
        sortCountry.sort((a, b) => b.NewDeaths - a.NewDeaths);
      } else {
        sortCountry.sort((a, b) => b.NewRecovered - a.NewRecovered);
      }
    } else if (this.dataAttributeHeaderSwitcher === 'All period 100000') {
      if (statusBottom === 'Confirmed') {
        sortCountry.sort((a, b) => b.AllThousandConfirmed - a.AllThousandConfirmed);
      } else if (statusBottom === 'Dead') {
        sortCountry.sort((a, b) => b.AllThousandDeaths - a.AllThousandDeaths);
      } else {
        sortCountry.sort((a, b) => b.AllThousandRecovered - a.AllThousandRecovered);
      }
    } else if (this.dataAttributeHeaderSwitcher === 'Last day 100000') {
      if (statusBottom === 'Confirmed') {
        sortCountry.sort((a, b) => b.LastThousandConfirmed - a.LastThousandConfirmed);
      } else if (statusBottom === 'Dead') {
        sortCountry.sort((a, b) => b.LastThousandDeaths - a.LastThousandDeaths);
      } else {
        sortCountry.sort((a, b) => b.LastThousandRecovered - a.LastThousandRecovered);
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
        const response = sortArray.filter((value) => value.Country.toLowerCase().startsWith(request));

        for (let i = 0; i < response.length; i += 1) {
          const searchItem = document.createElement('li');

          searchItem.textContent = response[i].Country;

          searchItem.addEventListener('click', () => {
            searchField.classList.add('visibility');
            document.querySelector('.use-keyboard-input').value = response[i].Country;
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

            flagImg.setAttribute('src', `${response[i].Flag}`);
            flagImg.setAttribute('alt', `flag ${response[i].Country}`);
            country.textContent = response[i].Country;
            if (this.dataAttributeHeaderSwitcher === 'All period') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].TotalConfirmed;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].TotalDeaths;
              } else {
                count.textContent = response[i].TotalRecovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'Last day') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].NewConfirmed;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].NewDeaths;
              } else {
                count.textContent = response[i].NewRecovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'All period 100000') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].AllThousandConfirmed;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].AllThousandDeaths;
              } else {
                count.textContent = response[i].AllThousandRecovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'Last day 100000') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].LastThousandConfirmed;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].LastThousandDeaths;
              } else {
                count.textContent = response[i].LastThousandRecovered;
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

        // const countries = sortArray.map((value) => value.Country);
        const request = e.target.value.toLowerCase();
        const response = sortArray.filter((value) => value.Country.toLowerCase().startsWith(request));
        console.log(request);

        for (let i = 0; i < response.length; i += 1) {
          const searchItem = document.createElement('li');

          searchItem.textContent = response[i].Country;

          searchItem.addEventListener('click', () => {
            searchField.classList.add('visibility');
            document.querySelector('.use-keyboard-input').value = response[i].Country;
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

            flagImg.setAttribute('src', `${response[i].Flag}`);
            flagImg.setAttribute('alt', `flag ${response[i].Country}`);
            country.textContent = response[i].Country;
            if (this.dataAttributeHeaderSwitcher === 'All period') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].TotalConfirmed;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].TotalDeaths;
              } else {
                count.textContent = response[i].TotalRecovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'Last day') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].NewConfirmed;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].NewDeaths;
              } else {
                count.textContent = response[i].NewRecovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'All period 100000') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].AllThousandConfirmed;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].AllThousandDeaths;
              } else {
                count.textContent = response[i].AllThousandRecovered;
              }
            } else if (this.dataAttributeHeaderSwitcher === 'Last day 100000') {
              if (statusBottom === 'Confirmed') {
                count.textContent = response[i].LastThousandConfirmed;
              } else if (statusBottom === 'Dead') {
                count.textContent = response[i].LastThousandDeaths;
              } else {
                count.textContent = response[i].LastThousandRecovered;
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
