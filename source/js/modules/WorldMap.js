import {countries} from './countries'

const URL = {
  SUMMARY: 'https://corona.lmao.ninja/v2/countries',
  SUMMARY1: 'https://api.covid19api.com/summary'
};

const RATE = {
  cases: 'cases',
  deaths: 'deaths',
  recovered: 'recovered',
  todayCases: 'todayCases',
  todayDeaths: 'todayDeaths',
  todayRecovered: 'todayRecovered',
}

export class WorldMap {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.mapElement = null;
    this.data = null;
    this.containerSwitches = null;
    this.containerOptions = null;
    this.dataAttributeOptions = 'options';
    this.onSwithesClick = this.onSwithesClick.bind(this);
    this.onOptionsClick = this.onOptionsClick.bind(this);
  }

  init() {
    this.getData();
    this.renderContent();
    // document.addEventListener('DOMContentLoaded', this.renderMap);
  }

  renderContent() {
    this.mapElement = document.createElement('div');
    this.mapElement.classList.add('map');
    const map = this.createMap();
    this.mapElement.appendChild(map);

    this.containerSwitches = this.createSwitches();
    this.containerOptions = this.createOptions();
    this.rootElement.append(this.containerSwitches, this.mapElement, this.containerOptions);
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
    const switchText = document.createElement('div');
    const switchRight = document.createElement('button');

    containerSwitches.classList.add('map-switches');
    switchLeft.classList.add('map-switches__left');
    switchText.classList.add('map-switches__title');
    switchRight.classList.add('map-switches__right');
    switchLeft.textContent = '<';
    switchRight.textContent = '>';
    switchText.textContent = 'All period';
    containerSwitches.append(switchLeft, switchText, switchRight);
    containerSwitches.addEventListener('click', this.onSwithesClick);

    return containerSwitches;
  }

  createOptions() {
    const containerOptions = document.createElement('div');

    for (let i = 0; i < 3; i += 1) {
      const option = document.createElement('button');
      switch (i) {
        case 0:
          option.textContent = 'Confirmed';
          option.classList.add('map-options__item');
          option.classList.add('map-options__item--confirmed');
          option.dataset[this.dataAttributeOptions] = RATE.cases;
          break;
        case 1:
          option.textContent = 'Dead';
          option.classList.add('map-options__item');
          option.classList.add('map-options__item--dead');
          option.dataset[this.dataAttributeOptions] = RATE.deaths;
          break;
        case 2:
          option.textContent = 'Recovered';
          option.classList.add('map-options__item');
          option.classList.add('map-options__item--recovered');
          option.dataset[this.dataAttributeOptions] = RATE.recovered;
          break;
      }
      containerOptions.append(option);
    }
    containerOptions.classList.add('map-options');
    containerOptions.addEventListener('click', this.onOptionsClick);

    return containerOptions;
  }

  renderMap(data, rate) {
    var mapboxAccessToken = 'pk.eyJ1Ijoia2FwYWN1ayIsImEiOiJja2l2Z29uZGgzOWMzMnZxanF4NG9neTJxIn0.1-lo4qPbQ2u_XnwjwVQHIA';
    var map = L.map('map-covid').setView([37.8, 10], 2);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
        id: 'mapbox/light-v9',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    function getColor(d) {
      return d > 10000000 ? '#800026' :
             d > 1000000  ? '#BD0026' :
             d > 100000  ? '#E31A1C' :
             d > 10000  ? '#FC4E2A' :
             d > 1000   ? '#FD8D3C' :
             d > 500   ? '#FEB24C' :
             d > 100   ? '#FED976' :
                        '#FFEDA0';
    }

    function style(feature) {
      return {
          fillColor: getColor(feature.properties[rate]),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
      };
    }

    var geojson;

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = `<h4>${rate} of Covid-19</h4>` +  (props ?
            '<b>' + props.name + '</b><br />' + props[rate] + ' people'
            : 'Hover over a country');
    };

    info.addTo(map);

    function highlightFeature(e) {
      var layer = e.target;
  
      layer.setStyle({
          weight: 2,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
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

    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
      layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
      });
    }
  
    geojson = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 100, 500, 1000, 10000, 100000, 1000000, 10000000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
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
        return
      }
      this.data = xhr.response;
      this.transformData();
      this.renderMap(countries, RATE.recovered);
    };
  }

  transformData() {
    const arr = [];

    this.data.forEach(item => {
      const goodCountry = countries.features.find(el => el.id === item.countryInfo.iso3);
      if (goodCountry !== undefined) {
        goodCountry.properties[RATE.cases] = item[RATE.cases];
        goodCountry.properties[RATE.deaths] = item[RATE.deaths];
        goodCountry.properties[RATE.recovered] = item[RATE.recovered];
        goodCountry.properties[RATE.todayCases] = item[RATE.todayCases];
        goodCountry.properties[RATE.todayDeaths] = item[RATE.todayDeaths];
        goodCountry.properties[RATE.todayRecovered] = item[RATE.todayRecovered];
        arr.push(goodCountry);
      }
    });

    countries.features = arr;
    
    console.log(arr);
    console.log(countries.features);
    console.log(this.data)
  }

  onSwithesClick({ target }) {

  }

  onOptionsClick({ target }) {
    if (target.dataset[this.dataAttributeOptions]) {
      const rate = target.dataset[this.dataAttributeOptions];
      this.refreshMap();
      this.renderMap(countries, rate);
    }
  }
}
