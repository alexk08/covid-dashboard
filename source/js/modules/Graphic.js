import {statesData} from './statesData';

const URL = {
  SUMMARY: 'https://api.covid19api.com/summary',
  TIME_LINE: 'https://covid19-api.org/api/timeline',                                                      //unstable access
  COUNTRY_TOTAL: 'https://api.covid19api.com/dayone/country/countryName/status/statusName',
  GOOGLE_CHART: 'https://www.gstatic.com/charts/loader.js',                                               
  GLOBAL_TOTAL: 'https://api.covid19api.com/world?from=2020-04-14T00:00:00Z&to=2020-12-19T00:00:00Z',     //incorrect data 
};
const DATE_START = new Date(2020, 3, 14, 0, 0, 0, 0);

export class Graphic {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.data = null;
    this.country = null;
    this.indexOfCountry = null;
    this.dataAttributeBottomSwitcher = 'Confirmed';
    this.dataAttributeHeaderSwitcher = 'All period';  
  }

  init() {
    this.renderContent();
    this.addLibraryGoogleChart().then(() => this.initGraphic('Global', 'Confirmed'));
  }

  renderContent() {
    const containerGraphic = document.createElement('div');

    const containerSwitcher = document.createElement('div');
    const switcherLeft = document.createElement('div');
    const switcherText = document.createElement('div');
    const switcherRight = document.createElement('div');

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

    containerGraphic.append(containerSwitcher, containerChart, containerOptions);
    this.rootElement.append(containerGraphic);
  }
    
  addLibraryGoogleChart() {
    return new Promise((resolve, reject) => {
      let scriptLibraries = document.createElement('script');
      scriptLibraries.src = URL.GOOGLE_CHART;
      scriptLibraries.onload = () => {
        console.log('Library onload');
        return resolve();
      }
      scriptLibraries.onerror =() => {
        console.log('Library onerror');
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
      console.log(statusBottom);
      this.DrawGraphic('Global', `${statusBottom}`);

      this.installActiveButton(buttons);
      button.classList.toggle('active');

      if (this.dataAttributeHeaderSwitcher === 'All period') {
        if (statusBottom === 'Confirmed') {
          
        } else if (statusBottom === 'Dead') {
          
        } else {
          
        }
      } else if (this.dataAttributeHeaderSwitcher === 'Last day') {
        if (statusBottom === 'Confirmed') {
          
        } else if (statusBottom === 'Dead') {
          
        } else {
          
        }
      } else if (this.dataAttributeHeaderSwitcher === 'All period 100000') {
        if (statusBottom === 'Confirmed') {
          
        } else if (statusBottom === 'Dead') {
          
        } else {
          
        }
      } else if (this.dataAttributeHeaderSwitcher === 'Last day 100000') {
        if (statusBottom === 'Confirmed') {
          
        } else if (statusBottom === 'Dead') {
          
        } else {
          
        }
      }
    });
  }


  DrawGraphic(countryName, statusBottom) {
    const chart = document.querySelector('.chart');
    chart.innerHTML = "";
    //this.drawGraphic('Global', 'Recovered');


    
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);

    let currentDate = DATE_START;
    function drawChart() {
      let srcDataCovid;
      if (countryName === 'Global') {
        srcDataCovid = URL.TIME_LINE;
        if (statusBottom === 'Confirmed') statusBottom = 'total_cases';
        if (statusBottom === 'Dead') statusBottom = 'total_deaths';
        if (statusBottom === 'Recovered') statusBottom = 'total_recovered';
      }
      else {
        srcDataCovid = URL.COUNTRY_TOTAL;
      }
      fetch(srcDataCovid)
      .then((res) => res.json())
      .then((res) => {
        let cases = [];
        if (res.length !== 0) {
/*  
          Date.prototype.addDays = function(days) {       // For Array of dates
            var date = new Date(this.valueOf())
            date.setDate(date.getDate() + days);
            return date;
          }
          
          res.forEach((day, index) => {                                                   // If use URL.GLOBAL_TOTAL
            cases.push([currentDate.addDays(index), day.TotalConfirmed]);
          });
          console.log(cases);
*/                                                  
          res.forEach((day) => {                                                          // If use URL.TIME_LINE
            cases.push([new Date(day.last_update), day[statusBottom]]);
          });

          let data = google.visualization.arrayToDataTable([
            ["Date", "Cumulative Cases"],
          ...cases
          ]);

          let options = {
          title: `${countryName}`,
          width: 550,
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

          let chart = new google.visualization.LineChart(document.querySelector('.chart'));
          chart.draw(data, options);

        } else {
          document.querySelector('.chart').innerHTML = "No data";
        }
      });
    }
  }

  installActiveButton(arrayButtons) {
    for (let i = 0; i < arrayButtons.length; i += 1) {
      arrayButtons[i].classList.remove('active');
    }
  }
}
