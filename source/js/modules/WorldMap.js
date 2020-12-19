// import './../vendor/leaflet-src';

const URL = {
  SUMMARY: 'https://api.covid19api.com/summary'
};

export class WorldMap {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.mapElement = null;
    this.data = null;
    this.renderMap = this.renderMap.bind(this);
  }

  init() {
    this.data = this.getData();
    this.renderContent();
    document.addEventListener('DOMContentLoaded', this.renderMap);
  }

  renderContent() {
    this.mapElement = document.createElement('div');
    this.mapElement.setAttribute('id', 'mapid');
    this.mapElement.style.height = '400px';
    this.rootElement.appendChild(this.mapElement);
  }

  renderMap() {
    const mymap = L.map('mapid').setView([51.505, -0.09], 2);

    // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //   maxZoom: 18,
    //   id: 'mapbox/streets-v11',
    //   tileSize: 512,
    //   zoomOffset: -1,
    //   accessToken: 'pk.eyJ1Ijoia2FwYWN1ayIsImEiOiJja2l2Z29uZGgzOWMzMnZxanF4NG9neTJxIn0.1-lo4qPbQ2u_XnwjwVQHIA'
    // }).addTo(mymap);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    const marker = L.marker([51.5, -0.09]).addTo(mymap);
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
      console.log(xhr.response);
    };

    return xhr.response;
  }
}
