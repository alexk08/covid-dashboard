import {populationData} from './populationData';
import {slagsData} from './slagsData';

const URL = {
  SUMMARY: 'https://api.covid19api.com/summary',
  TIME_LINE: 'https://covid19-api.org/api/timeline',                                                      //unstable access
  //COUNTRY_TOTAL: 'https://api.covid19api.com/dayone/country/countryName/status/statusName',                 not responding
  COUNTRY_TOTAL: 'https://disease.sh/v3/covid-19/historical/countryName?lastdays=365',
  GOOGLE_CHART: 'https://www.gstatic.com/charts/loader.js',                                               
  GLOBAL_TOTAL: 'https://api.covid19api.com/world?from=2020-04-14T00:00:00Z&to=2020-12-19T00:00:00Z',     //incorrect data 
};
const DATE_START = new Date(2020, 3, 14, 0, 0, 0, 0);

export class Graphic {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.data = null;
    this.country = 'Global';
    this.indexOfCountry = null;
    this.dataAttributeBottomSwitcher = 'Confirmed';
    this.dataAttributeHeaderSwitcher = 'All period';  
  }

  init() {
    this.renderContent();
    this.addLibraryGoogleChart().then(() => this.initGraphic('Global', 'Confirmed', 'All period'));
  }

  renderContent(statusBottom) {
    const containerGraphic = document.createElement('div');

    const containerSwitcher = document.createElement('div');
    const switcherLeft = document.createElement('div');
    const switcherText = document.createElement('div');
    const switcherRight = document.createElement('div');

    const select = document.createElement('select');
    populationData.forEach((item) => {
      select.innerHTML += `<option value="${item.name}">${item.name}</option>`;
    });
    select.value = "global";
    select.addEventListener("change", () => {
      this.country = select.value;
      //console.log(this.dataAttributeBottomSwitcher);
      this.DrawGraphic(`${this.country}`, `${this.dataAttributeBottomSwitcher}`);
    });

    const containerChart = document.createElement('div');
    const chart = document.createElement('div');
    containerChart.append(chart);

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
      option.classList.add('container-graphic-options__item');
      containerOptions.append(option);
    }

    containerGraphic.classList.add('container-graphic');

    containerSwitcher.classList.add('container-switcher');
    switcherLeft.classList.add('container-switcher__left');
    switcherText.classList.add('container-switcher__title');
    switcherRight.classList.add('container-switcher__right');
    switcherLeft.textContent = '<';
    switcherRight.textContent = '>';
    switcherText.textContent = 'All period';

    containerChart.classList.add('container-chart');
    chart.classList.add('chart');

    containerOptions.classList.add('container-graphic-options');

    containerSwitcher.append(switcherLeft, switcherText, switcherRight);

    containerGraphic.append(containerSwitcher, select, containerChart, containerOptions);
    this.rootElement.append(containerGraphic);
  }
    
  addLibraryGoogleChart() {
    return new Promise((resolve, reject) => {
      let scriptLibraries = document.createElement('script');
      scriptLibraries.src = URL.GOOGLE_CHART;
      scriptLibraries.onload = () => {
        //console.log('Library onload');
        return resolve();
      }
      scriptLibraries.onerror =() => {
        //console.log('Library onerror');
        return reject();
      }
      document.body.append(scriptLibraries);
    })
  }
    
  initGraphic(countryName, statusBottom) {
    this.DrawGraphic(countryName, statusBottom);
    this.addListeners();
    document.querySelectorAll('.container-graphic-options__item')[0].click();
  }

  addListeners(population) {
    const confirmedButton = document.querySelectorAll('.container-graphic-options__item')[0];
    const deadButton = document.querySelectorAll('.container-graphic-options__item')[1];
    const recoveredButton = document.querySelectorAll('.container-graphic-options__item')[2];

    this.clickBottomPanel(confirmedButton, 'Confirmed', this.data, population);
    this.clickBottomPanel(deadButton, 'Dead', this.data, population);
    this.clickBottomPanel(recoveredButton, 'Recovered', this.data, population);
  }

  clickBottomPanel(button, statusBottom, data, population) {

    const buttons = document.querySelectorAll('.container-graphic-options__item');
    button.addEventListener('click', () => {
      this.dataAttributeBottomSwitcher = statusBottom;
      //console.log(statusBottom);
      this.DrawGraphic('Global', `${statusBottom}`);

      this.installActiveButton(buttons);
      button.classList.toggle('active-background');
    });
  }

  DrawGraphic(f, statusBottom) {
    const chart = document.querySelector('.chart');
    chart.innerHTML = "";
    let countryName = this.country;
    //console.log(countryName);

    let populationFactor;
    if (/10/.test(this.dataAttributeHeaderSwitcher)) 
    populationFactor = populationData.filter((item) => item.name === countryName)[0].population / (10 ** 5);
    else populationFactor = 1;

    let srcDataCovid;
    if (countryName === 'Global') {
      srcDataCovid = URL.TIME_LINE;
      if (statusBottom === 'Confirmed') statusBottom = 'total_cases';
      if (statusBottom === 'Dead') statusBottom = 'total_deaths';
      if (statusBottom === 'Recovered') statusBottom = 'total_recovered';
    }
    else {
      srcDataCovid = URL.COUNTRY_TOTAL.replace('countryName', `${this.country}`);
      if (statusBottom === 'Confirmed') statusBottom = 'cases';
      if (statusBottom === 'Dead') statusBottom = 'deaths';
      if (statusBottom === 'Recovered') statusBottom = 'recovered';
    }
    //console.log(srcDataCovid);

    let mode = false;
    if (/da/.test(this.dataAttributeHeaderSwitcher)) 
    mode = true;
    Array.prototype.cumulativeToDaily = function() {
      let arrDaily = [this[0]];
      for (let i = 1; i < this.length; i += 1) {
        arrDaily.push([this[i][0], this[i][1] - this[i - 1][1]]);
      }
      return arrDaily;
    }

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      let options = {
        title: `${countryName}`,
        width: 500,
        height: 400,
        colors: ['#000000'],
        fontSize: 16,
        hAxis: {
          format: 'MMM',
          gridlines: {count: 15},
          title: '',
        },
        forceIFrame: true,
        vAxis: {
          gridlines: {color: 'none'},
          minValue: 0,
          title: '',
          titleTextStyle: {
            color: '#000000'
          }
        },
        legend: { position: "bottom" },
      };
      if (countryName === 'Global') {
        fetch(srcDataCovid)
        .then((res) => res.json())
        .then((res) => {
          let cases = [];
          if (res.length !== 0) {
            res.forEach((day) => {
              cases.push([new Date(day.last_update), day[statusBottom] / populationFactor]);
            });
            cases.reverse();
            if (mode) cases = cases.cumulativeToDaily();
            let data = google.visualization.arrayToDataTable([
              ["Date", "Cumulative Cases"],
            ...cases
            ]);
  
            let chart = new google.visualization.LineChart(document.querySelector('.chart'));
            chart.draw(data, options);
  
          } else {
            document.querySelector('.chart').innerHTML = "No data";
          }
        })
      } else {
        fetch(srcDataCovid)
        .then((res) => res.json())
        .then((res) => {
          let cases = [];
          if (res.length !== 0) {
            cases = Object.entries(res.timeline[statusBottom]);
            cases = cases.map((item) => [new Date(item[0]), item[1] / populationFactor]);
            let casesNonNull = [];
            for (let i = 0; i < cases.length; i += 1) {
              if (cases[i][1] !== 0) 
              casesNonNull.push(cases[i]);
            }
            if (mode) casesNonNull = casesNonNull.cumulativeToDaily();
            //console.log(cases);
            let data = google.visualization.arrayToDataTable([
              ["Date", "Cumulative Cases"],
              ...casesNonNull
            ]);
            let chart = new google.visualization.LineChart(document.querySelector('.chart'));
            chart.draw(data, options);

          } else {
            document.querySelector('.chart').innerHTML = "No data";
          }
        });
      }
    }
  }
  installActiveButton(arrayButtons) {
    for (let i = 0; i < arrayButtons.length; i += 1) {
      arrayButtons[i].classList.remove('active-background');
    }
  }
}
