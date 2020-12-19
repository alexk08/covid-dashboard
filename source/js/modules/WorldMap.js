// import './../vendor/leaflet-src';
import {statesData} from './statesData';
import {geoJSON} from './geoJSON';
import {countries} from './countries'
const URL = {
  SUMMARY: 'https://api.covid19api.com/summary'
};

export class WorldMap {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.mapElement = null;
    this.data = null;
    // this.renderMap = this.renderMap.bind(this);
    this.data1 = null;
  }

  init() {
    this.getData();
    this.getData1();
    this.renderContent();
    // document.addEventListener('DOMContentLoaded', this.renderMap);
  }

  renderContent() {
    this.mapElement = document.createElement('div');
    this.mapElement.setAttribute('id', 'mapid');
    this.mapElement.style.height = '400px';
    this.rootElement.appendChild(this.mapElement);
  }

  renderMap() {
    // var geoJSON1 = JSON.parse(geoJSON);
    // console.log(geoJSON)
    // const mymap = L.map('mapid').setView([51.505, -0.09], 2);

    // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //   maxZoom: 18,
    //   id: 'mapbox/streets-v11',
    //   tileSize: 512,
    //   zoomOffset: -1,
    //   accessToken: 'pk.eyJ1Ijoia2FwYWN1ayIsImEiOiJja2l2Z29uZGgzOWMzMnZxanF4NG9neTJxIn0.1-lo4qPbQ2u_XnwjwVQHIA'
    // }).addTo(mymap);

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(mymap);

    // const marker = L.marker([51.5, -0.09]).addTo(mymap);

    var mapboxAccessToken = 'pk.eyJ1Ijoia2FwYWN1ayIsImEiOiJja2l2Z29uZGgzOWMzMnZxanF4NG9neTJxIn0.1-lo4qPbQ2u_XnwjwVQHIA';
    var map = L.map('mapid').setView([37.8, -96], 4);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
        id: 'mapbox/light-v9',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    // L.geoJson(countries).addTo(map);

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
          fillColor: getColor(feature.properties.cases),
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
        this._div.innerHTML = '<h4>Total confirmed cases of Covid-19</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.cases + ' people'
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
  
    geojson = L.geoJson(countries, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    // geojson = L.geoJson(countries, {style: style}).addTo(map);

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

  getData1() {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://corona.lmao.ninja/v2/countries');

    xhr.responseType = 'json';
    
    xhr.send();

    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.log(`Error ${xhr.status}: ${xhr.statusText}`);
        return
      }
      this.data1 = xhr.response;
      this.transformData();
      this.renderMap();
    };
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
    };
  }

  transformData() {
    // console.log(countries.features)
    // console.log(countries)
    const arr = [];
    // countries.features.map((item, index) => {
    //   if (item.properties.name.toLowerCase() === this.data.Countries[index].Country.toLowerCase()) return item.properties.TotalDeaths = this.data.Countries[index].TotalDeaths;
    // })

    // countries.features.sort((a, b) => {
    //   if (a.properties.name > b.properties.name) {
    //     return 1;
    //   }
    //   if (a.properties.name < b.properties.name) {
    //     return -1;
    //   }
    //   return 0;
    // })

    // this.data.Countries.sort((a, b) => {
    //   if (a.Country > b.Country) {
    //     return 1;
    //   }
    //   if (a.Country < b.Country) {
    //     return -1;
    //   }
    //   return 0;
    // })



    this.data1.forEach(item => {
      // if (this.data.Countries.includes(item.properties.name)
      const goodCountry = countries.features.find(el => el.id === item.countryInfo.iso3);
      if (goodCountry !== undefined) {
        goodCountry.properties.cases = item.cases;
        goodCountry.properties.deaths = item.deaths;
        arr.push(goodCountry);
      }
    });

    countries.features = arr;
    
    console.log(arr);
    console.log(countries.features);
    // console.log(this.data.Countries);
    // let str = 'ABC';
    // console.log(str.slice(0,2));
    console.log(this.data1)
  }
}
