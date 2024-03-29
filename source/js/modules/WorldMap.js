import {countries} from './countries';

const URL = {
  SUMMARY: 'https://corona.lmao.ninja/v2/countries',
  SUMMARY1: 'https://api.covid19api.com/summary',
  // SUMMARY: 'https://disease.sh/v3/covid-19/countries'
};

const RATE = {
  cases: 'cases',
  deaths: 'deaths',
  recovered: 'recovered',
  todayCases: 'todayCases',
  todayDeaths: 'todayDeaths',
  todayRecovered: 'todayRecovered',
  casesPerOneMillion: 'casesPerOneMillion',
  deathsPerOneMillion: 'deathsPerOneMillion',
  recoveredPerOneMillion: 'recoveredPerOneMillion',
  casesPerHundredThousands: 'casesPerHundredThousands',
  deathsPerHundredThousands: 'deathsPerHundredThousands',
  recoveredPerHundredThousands: 'recoveredPerHundredThousands',
  todayCasesPerHundredThousands: 'todayCasesPerHundredThousands',
  todayDeathsPerHundredThousands: 'todayDeathsPerHundredThousands',
  todayRecoveredPerHundredThousands: 'todayRecoveredPerHundredThousands',
  population: 'population',
  coefficient: 10,
  oneHundredThousands: 100000,
};

const TEXT_INFO = {
  cases: 'Total cases',
  deaths: 'Total deathes',
  recovered: 'Total recovered',
  todayCases: 'Today cases',
  todayDeaths: 'Today deaths',
  todayRecovered: 'Today recovered',
  casesPerHundredThousands: 'Cases per 100K',
  deathsPerHundredThousands: 'Deaths per 100K',
  recoveredPerHundredThousands: 'Recovered per 100K',
  todayCasesPerHundredThousands: 'Today cases per 100K',
  todayDeathsPerHundredThousands: 'Today deaths per 100K',
  todayRecoveredPerHundredThousands: 'Today recovered per 100K',
};

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

export class WorldMap {
  constructor(rootElement, mainPage) {
    this.rootElement = rootElement;
    this.mapElement = null;
    this.data = null;
    this.containerSwitches = null;
    this.containerOptions = null;
    this.switchText = null;
    this.dataAttributeOption = DATA_ATTRIBUTE.option;
    this.dataAttributeSwitch = DATA_ATTRIBUTE.switch;

    this.onSwitchesClick = this.onSwitchesClick.bind(this);
    this.onOptionsClick = this.onOptionsClick.bind(this);
    this.onFullScreen = this.onFullScreen.bind(this);

    this.mainPage = mainPage;
  }

  init() {
    this.getData();
    this.renderContent();
  }

  renderContent() {
    this.mapElement = document.createElement('div');
    this.mapElement.classList.add('map');
    const map = this.createMap();
    this.mapElement.appendChild(map);

    const fullScreenButton = document.createElement('i');
    fullScreenButton.classList.add('fa', 'fa-arrows-alt', 'fa-sm', 'map-container__fullscreen');
    fullScreenButton.setAttribute('aria-hidden', 'true');
    fullScreenButton.addEventListener('click', this.onFullScreen);

    this.containerSwitches = this.createSwitches();
    this.containerOptions = this.createOptions();
    this.rootElement.append(fullScreenButton, this.containerSwitches, this.mapElement, this.containerOptions);
  }

  createMap() {
    const map = document.createElement('div');
    map.setAttribute('id', 'map-covid');
    map.classList.add('map__covid');

    return map;
  }

  createSwitches() {
    const containerSwitches = document.createElement('div');
    const switchLeft = document.createElement('button');
    const switchRight = document.createElement('button');

    this.switchText = document.createElement('div');
    this.switchText.classList.add(`map-switches__${SWITCH.title}`);
    this.switchText.textContent = SWITCHES_NAMES[this.mainPage.switchesIndex];

    containerSwitches.classList.add('map-switches');
    switchLeft.classList.add(`map-switches__${SWITCH.left}`);
    switchRight.classList.add(`map-switches__${SWITCH.right}`);
    switchLeft.dataset[this.dataAttributeSwitch] = SWITCH.left;
    switchRight.dataset[this.dataAttributeSwitch] = SWITCH.right;
    switchLeft.textContent = '<';
    switchRight.textContent = '>';
    containerSwitches.append(switchLeft, this.switchText, switchRight);
    containerSwitches.addEventListener('click', this.onSwitchesClick);

    return containerSwitches;
  }

  createOptions() {
    const containerOptions = document.createElement('div');

    OPTIONS_NAMES.forEach((item, index) => {
      const option = document.createElement('button');
      option.textContent = item;
      option.classList.add('map-options__item');
      option.classList.add(`map-options__item--${item.toLowerCase()}`);
      if (index === 0) {
        option.classList.add('active-background');
      }
      option.dataset[this.dataAttributeOption] = item;
      containerOptions.append(option);
    });

    containerOptions.classList.add('map-options');
    containerOptions.addEventListener('click', this.onOptionsClick);

    return containerOptions;
  }

  renderMap(data, rate) {
    let mapboxAccessToken = 'pk.eyJ1Ijoia2FwYWN1ayIsImEiOiJja2l2Z29uZGgzOWMzMnZxanF4NG9neTJxIn0.1-lo4qPbQ2u_XnwjwVQHIA';
    let map = L.map('map-covid').setView([37.8, 10], 2);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
      id: 'mapbox/dark-v9',
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(map);

    function getColor(d) {
      return d > 10000000 ? '#800026' :
        d > 1000000 ? '#BD0026' :
          d > 100000 ? '#E31A1C' :
            d > 10000 ? '#FC4E2A' :
              d > 1000 ? '#FD8D3C' :
                d > 500 ? '#FEB24C' :
                  d > 100 ? '#FED976' :
                    '#FFEDA0';
    }

    function style(feature) {
      return {
        fillColor: getColor(feature.properties[rate]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      };
    }

    let geojson;

    let info = L.control();

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
      this._div.innerHTML = `<h4>${TEXT_INFO[rate]} of Covid-19</h4>` + (props ?
        '<b>' + props.name + '</b><br />' + props[rate] + ' people'
        : 'Hover over a country');
    };

    info.addTo(map);

    function highlightFeature(e) {
      let layer = e.target;

      layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7,
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
      geojson.resetStyle(e.target);
      info.update();
    }

    const selectCountry = (e) => {
      this.mainPage.selectedCountryName = e.target.feature.properties.name;
      this.mainPage.showRateByCountry();
    };

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: selectCountry,
      });
    }

    geojson = L.geoJson(data, {
      style,
      onEachFeature,
    }).addTo(map);

    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

      let div = L.DomUtil.create('div', 'info legend');
      let grades = [0, 100, 500, 1000, 10000, 100000, 1000000, 10000000];
      let labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
    };

    legend.addTo(map);
  }

  refreshMap() {
    this.mapElement.innerHTML = '';
    const map = this.createMap();
    this.mapElement.appendChild(map);
  }

  getData() {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', URL.SUMMARY);

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.log(`Error ${xhr.status}: ${xhr.statusText}`);
        return;
      }
      this.data = xhr.response;
      this.transformData();
      this.renderMap(countries, RATE.cases);
    };
  }

  transformData() {
    const arr = [];

    this.data.forEach((item) => {
      const goodCountry = countries.features.find((el) => el.id === item.countryInfo.iso3);
      if (goodCountry !== undefined) {
        goodCountry.properties[RATE.cases] = item[RATE.cases];
        goodCountry.properties[RATE.deaths] = item[RATE.deaths];
        goodCountry.properties[RATE.recovered] = item[RATE.recovered];
        goodCountry.properties[RATE.todayCases] = item[RATE.todayCases];
        goodCountry.properties[RATE.todayDeaths] = item[RATE.todayDeaths];
        goodCountry.properties[RATE.todayRecovered] = item[RATE.todayRecovered];
        goodCountry.properties[RATE.casesPerHundredThousands] = +(item[RATE.casesPerOneMillion] / RATE.coefficient).toFixed(2);
        goodCountry.properties[RATE.deathsPerHundredThousands] = +(item[RATE.deathsPerOneMillion] / RATE.coefficient).toFixed(2);
        goodCountry.properties[RATE.recoveredPerHundredThousands] = +(item[RATE.recoveredPerOneMillion] / RATE.coefficient).toFixed(2);
        goodCountry.properties[RATE.todayCasesPerHundredThousands] = +(item[RATE.todayCases] / item[RATE.population] * RATE.oneHundredThousands).toFixed(2);
        goodCountry.properties[RATE.todayDeathsPerHundredThousands] = +(item[RATE.todayDeaths] / item[RATE.population] * RATE.oneHundredThousands).toFixed(2);
        goodCountry.properties[RATE.todayRecoveredPerHundredThousands] = +(item[RATE.todayRecovered] / item[RATE.population] * RATE.oneHundredThousands).toFixed(2);
        arr.push(goodCountry);
      }
    });

    countries.features = arr;
  }

  onSwitchesClick({target}) {
    const dataSwitch = target.dataset[this.dataAttributeSwitch];
    if (dataSwitch) {
      this.mainPage.changeSwithesIndex(dataSwitch, SWITCH.right, SWITCH.left);
    }
  }

  onOptionsClick({target}) {
    const dataOption = target.dataset[this.dataAttributeOption];
    if (dataOption) {
      this.mainPage.changeOptionsIndex(dataOption, OPTIONS_NAMES);
    }
  }

  changeRate(optionsIndex, switchesIndex) {
    const buttons = this.containerOptions.querySelectorAll(`[data-${this.dataAttributeOption}]`);
    this.changeActiveButton(buttons);
    this.refreshMap();
    this.switchText.textContent = SWITCHES_NAMES[this.mainPage.switchesIndex];

    if (optionsIndex === 0 && switchesIndex === 0) {
      this.renderMap(countries, RATE.cases);
    } else if (optionsIndex === 1 && switchesIndex === 0) {
      this.renderMap(countries, RATE.deaths);
    } else if (optionsIndex === 2 && switchesIndex === 0) {
      this.renderMap(countries, RATE.recovered);
    } else if (optionsIndex === 0 && switchesIndex === 1) {
      this.renderMap(countries, RATE.todayCases);
    } else if (optionsIndex === 1 && switchesIndex === 1) {
      this.renderMap(countries, RATE.todayDeaths);
    } else if (optionsIndex === 2 && switchesIndex === 1) {
      this.renderMap(countries, RATE.todayRecovered);
    } else if (optionsIndex === 0 && switchesIndex === 2) {
      this.renderMap(countries, RATE.casesPerHundredThousands);
    } else if (optionsIndex === 1 && switchesIndex === 2) {
      this.renderMap(countries, RATE.deathsPerHundredThousands);
    } else if (optionsIndex === 2 && switchesIndex === 2) {
      this.renderMap(countries, RATE.recoveredPerHundredThousands);
    } else if (optionsIndex === 0 && switchesIndex === 3) {
      this.renderMap(countries, RATE.todayCasesPerHundredThousands);
    } else if (optionsIndex === 1 && switchesIndex === 3) {
      this.renderMap(countries, RATE.todayDeathsPerHundredThousands);
    } else if (optionsIndex === 2 && switchesIndex === 3) {
      this.renderMap(countries, RATE.todayRecoveredPerHundredThousands);
    }
  }

  changeActiveButton(arrayButtons) {
    for (let i = 0; i < arrayButtons.length; i += 1) {
      arrayButtons[i].classList.remove('active-background');
    }
    arrayButtons[this.mainPage.optionsIndex].classList.add('active-background');
  }

  onFullScreen() {
    document.querySelector('.container-list').classList.toggle('visibility');
    document.querySelector('.container-graphic').classList.toggle('visibility');
    document.querySelector('.container-table').classList.toggle('visibility');
    document.querySelector('.main .container').classList.toggle('container-full-screen');

    this.rootElement.classList.toggle('full-screen');
    this.changeRate(this.mainPage.optionsIndex, this.mainPage.switchesIndex);
  }
}
