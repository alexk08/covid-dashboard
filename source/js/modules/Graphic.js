import {countryData} from './countryData';

const colors = {
  0: 'red',
  1: 'black',
  2: 'green',
}

const SWITCH = {
  left: 'left',
  right: 'right',
  title: 'title',
};

const OPTIONS_NAMES = ['Confirmed', 'Dead', 'Recovered'];
const SWITCHES_NAMES = ['Cumulative cases / total number', 'Daily cases / total number', 'Cumulative cases / per 100 thousands', 'Daily cases / per 100 thousands'];

const DATA_ATTRIBUTE = {
  option: 'option',
  switch: 'switch',
};

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
  constructor(rootElement, mainPage) {
    this.rootElement = rootElement;
    this.data = null;
    this.country = 'Global';
    this.dataAttributeOption = DATA_ATTRIBUTE.option;
    this.dataAttributeSwitch = DATA_ATTRIBUTE.switch;
    this.indexOfCountry = null;
    this.mainPage = mainPage;
    this.onSwitchesClick = this.onSwitchesClick.bind(this);
    this.onOptionsClick = this.onOptionsClick.bind(this);
    this.dataAttributeBottomSwitcher = 'Confirmed';
    this.dataAttributeHeaderSwitcher = 'All period';  
  }

  init() {
    this.renderContent();
    this.addLibraryGoogleChart().then(() => this.initGraphic(0, 0));
    window.addEventListener('resize', (event) => {
      this.drawGraphic(this.mainPage.optionsIndex, this.mainPage.switchesIndex, this.mainPage.selectedCountryName);
    });
  }

  renderContent() {
    //const containerGraphic = document.createElement('div');
    this.rootElement.classList.add('container-graphic');

    const containerSwitcher = document.createElement('div');
    const switcherLeft = document.createElement('div');
    this.switcherText = document.createElement('div');
    const switcherRight = document.createElement('div');

    const fullScreenButton = document.createElement('i');
    fullScreenButton.classList.add('fa', 'fa-arrows-alt', 'fa-sm', 'container-graphic__fullscreen');
    fullScreenButton.setAttribute('aria-hidden', 'true');
    fullScreenButton.addEventListener('click', () => {
      this.onFullScreen();
      this.mainPage.showRateByCountry();
    })


    const select = document.createElement('select');
    select.classList.add('select-country')
    countryData.forEach((item) => {
      select.innerHTML += `<option value="${item.country}">${item.country}</option>`;
    });
    select.value = "global";
    select.addEventListener("change", () => {
      this.mainPage.selectedCountryName = select.value;
      this.mainPage.showRateByCountry();
      //console.log(this.mainPage.optionsIndex, this.mainPage.switchesIndex);
      //this.drawGraphic(this.mainPage.optionsIndex, this.mainPage.switchesIndex, this.mainPage.selectedCountryName);
    });

    const containerChart = document.createElement('div');
    //const chart = document.createElement('div');
    //containerChart.append(chart);

    const containerOptions = document.createElement('div');

    for (let i = 0; i < 3; i += 1) {
      const option = document.createElement('div');
      option.textContent = OPTIONS_NAMES[i];
      option.dataset[this.dataAttributeOption] = OPTIONS_NAMES[i];
      option.classList.add('container-graphic-options__item');
      containerOptions.append(option);
    }

    //containerGraphic.classList.add('container-graphic');

    containerSwitcher.classList.add('container-graphic-switcher');
    switcherLeft.classList.add(`container-graphic-switcher__${SWITCH.left}`);
    switcherRight.classList.add(`container-graphic-switcher__${SWITCH.right}`);
    this.switcherText.classList.add('container-switcher__title');
    switcherLeft.classList.add('container-switcher__left');
    switcherRight.classList.add('container-switcher__right');
    switcherLeft.textContent = '<';
    switcherRight.textContent = '>';
    this.switcherText.textContent = 'All period';

    switcherLeft.dataset[this.dataAttributeSwitch] = SWITCH.left;
    switcherRight.dataset[this.dataAttributeSwitch] = SWITCH.right;

    containerChart.classList.add('container-chart');
    //chart.classList.add('chart');

    containerOptions.classList.add('container-graphic-options');

    containerSwitcher.append(switcherLeft, this.switcherText, switcherRight);

    //containerGraphic.append(fullScreenButton, containerSwitcher, select, containerChart, containerOptions);
    //this.rootElement.append(containerGraphic);

    this.rootElement.append(fullScreenButton, containerSwitcher, select, containerChart, containerOptions);
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
    
  initGraphic(optionsIndex, switchesIndex) {
    //console.log('initGraphic');
    this.drawGraphic(optionsIndex, switchesIndex, this.mainPage.selectedCountryName);
    this.addListeners();
  }

  addListeners() {
    document.querySelector('.container-graphic-switcher').addEventListener('click', this.onSwitchesClick);
    document.querySelector('.container-graphic-options').addEventListener('click', this.onOptionsClick);
    //document.querySelector('.container-graphic__fullscreen').addEventListener('click', this.onFullScreen);
    //document.querySelector('.container-graphic__fullscreen').addEventListener('click', console.log('click'));
  }
  
  onSwitchesClick({target}) {
    const dataSwitch = target.dataset[this.dataAttributeSwitch];
    if (dataSwitch) {
      this.mainPage.changeSwithesIndex(dataSwitch, SWITCH.right, SWITCH.left);
      //this.drawGraphic(1,1);
      console.log('onSwitchesClick');
    }
  }

  onOptionsClick({target}) {
    const dataOption = target.dataset[this.dataAttributeOption];
    const buttons = document.querySelectorAll('.container-graphic-options__item');
    if (dataOption) {
      //this.changeActiveButton(buttons);
      //target.classList.toggle('active-background');
      this.mainPage.changeOptionsIndex(dataOption, OPTIONS_NAMES);
      //this.drawGraphic(2, 2);
      //console.log('onOptionsClick');
    }
  }

  drawGraphic(optionsIndex, switchesIndex, countryName) {
    console.log('click');
    //console.log(`optionsIndex: ${optionsIndex}`);
    //console.log(`switchesIndex: ${switchesIndex}`);
    //console.log(`countryName: ${countryName}`);

    this.switcherText.textContent = SWITCHES_NAMES[this.mainPage.switchesIndex];
    const buttons = document.querySelectorAll('.container-graphic-options__item');
    this.changeActiveButton(buttons);
    const select = document.querySelector('select');

    const chart = document.querySelector('.container-chart');
    //chart.innerHTML = '';
    if (countryName === null) countryName = 'Global';
    select.value = `${countryName}`;

    let populationFactor;
    if (switchesIndex === 2 || switchesIndex === 3) {
      populationFactor = countryData.filter((item) => item.country === countryName)[0].population / (10 ** 5);
    }
    else populationFactor = 1;

    let srcDataCovid;
    let optionCases;
    if (countryName === 'Global') {
      srcDataCovid = URL.TIME_LINE;
      if (optionsIndex === 0) optionCases = 'total_cases';
      if (optionsIndex === 1) optionCases = 'total_deaths';
      if (optionsIndex === 2) optionCases = 'total_recovered';
    }
    else {
      srcDataCovid = URL.COUNTRY_TOTAL.replace('countryName', `${this.mainPage.selectedCountryName}`);
      if (optionsIndex === 0) optionCases = 'cases';
      if (optionsIndex === 1) optionCases = 'deaths';
      if (optionsIndex === 2) optionCases = 'recovered';
    }
    //console.log(srcDataCovid);

    let mode = false;
    if (switchesIndex === 1 || switchesIndex === 3) 
    mode = true;
    Array.prototype.cumulativeToDaily = function() {
      let arrDaily = [this[0]];
      for (let i = 1; i < this.length; i += 1) {
        arrDaily.push([this[i][0], this[i][1] - this[i - 1][1]]);
      }
      return arrDaily;
    }

    google.load("visualization", "1", {packages:["corechart"]});
    google.setOnLoadCallback(drawChart);
    //google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      let options = {
        title: `${countryName}`,
        //width: 500,
        //height: 100,
        colors: [`${colors[optionsIndex]}`],
        fontSize: 16,
        hAxis: {
          format: 'MMM',
          textStyle:{
             color:'black',
             fontSize:14,
             fontName:'Arial',
             bold:false,
             italic:false
          }
        },
        forceIFrame: false,
        vAxis: {
          format: 'short',
          gridlines: {color: 'black'},
          minValue: 0,
          textStyle:{
            color:'black',
            fontSize:14,
            fontName:'Arial',
            bold:false,
            italic:false
         }
        },
        backgroundColor:'#999',
        chartArea: {
          height: '70%',
          width: '70%',
          top: '15%',
          left: '20%'
        },

        legend: 'none',
      };
      if (countryName === 'Global') {
        fetch(srcDataCovid)
        .then((res) => res.json())
        .then((res) => {
          let cases = [];
          if (res.length !== 0) {
            res.forEach((day) => {
              cases.push([new Date(day.last_update), day[optionCases] / populationFactor]);
            });
            cases.reverse();
            if (mode) cases = cases.cumulativeToDaily();
            let data = google.visualization.arrayToDataTable([
              ["Date", `${SWITCHES_NAMES[switchesIndex]}`],
            ...cases
            ]);
  
            let chart = new google.visualization.AreaChart(document.querySelector('.container-chart'));
            chart.draw(data, options);
  
          } else {
            document.querySelector('.container-chart').innerHTML = "No data";
          }
        })
        .catch(error => document.querySelector('.container-chart').innerHTML = "No data, try again later");
      } else {
        fetch(srcDataCovid)
        .then((res) => res.json())
        .then((res) => {
          let cases = [];
          if (res.length !== 0) {
            cases = Object.entries(res.timeline[optionCases]);
            cases = cases.map((item) => [new Date(item[0]), item[1] / populationFactor]);
            let casesNonNull = [];
            for (let i = 0; i < cases.length; i += 1) {
              if (cases[i][1] !== 0) 
              casesNonNull.push(cases[i]);
            }
            if (mode) casesNonNull = casesNonNull.cumulativeToDaily();
            //console.log(cases);
            let data = google.visualization.arrayToDataTable([
              ["Date", `${SWITCHES_NAMES[switchesIndex]}`],
              ...casesNonNull
            ]);
            let chart = new google.visualization.AreaChart(document.querySelector('.container-chart'));
            chart.draw(data, options);

          } else {
            document.querySelector('.container-chart').innerHTML = "No data";
          }
        })
        .catch(error => document.querySelector('.container-chart').innerHTML = "No data for the selected country");
      }
    }
  }

  changeActiveButton(arrayButtons) {
    for (let i = 0; i < arrayButtons.length; i += 1) {
      arrayButtons[i].classList.remove('active-background');
    }
    arrayButtons[this.mainPage.optionsIndex].classList.add('active-background');
  }
  onFullScreen() {
    document.querySelector('.container-table').classList.toggle('visibility');
    document.querySelector('.map-container').classList.toggle('visibility');
    document.querySelector('.container-list').classList.toggle('visibility');
    document.querySelector('.main .container').classList.toggle('container-full-screen');

    document.querySelector('.container-graphic').classList.toggle('full-screen');
    //console.log(this.mainPage.selectedCountryName);
    //this.drawGraphic(0, 0, 'Global');
  }
}
