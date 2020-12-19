const URL = {
  SUMMARY: 'https://api.covid19api.com/summary',
  TIME_LINE: 'https://covid19-api.org/api/timeline',
  GOOGLE_CHART: 'https://www.gstatic.com/charts/loader.js',
  GLOBAL_TOTAL: 'https://api.covid19api.com/world?from=2020-04-14T00:00:00Z&to=2020-12-19T00:00:00Z',
};
const DATE_START = new Date(2020, 3, 14, 0, 0, 0, 0);

export class Graphic {
  constructor(rootElement, data, country) {
    this.rootElement = rootElement;
    this.data = data;
    this.country = country;  
  }

  init() {
    this.addLibraryGoogleChart().then(() => this.drawGraphic('Global'));
  }

  renderContent() {

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
    
  drawGraphic(countryName) {
    
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);

    let currentDate = DATE_START;

    function drawChart() {
      fetch(URL.TIME_LINE)
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
            cases.push([new Date(day.last_update), day.total_cases]);
          });
          console.log(cases);


          let data = google.visualization.arrayToDataTable([
            ["Date", "Cumulative Cases"],
          ...cases
          ]);

          let options = {
          title: `${countryName}`,
          width: 600,
          height: 400,
          colors: ['#000000'],
          fontSize: 16,
          hAxis: {
            format: 'MMM',
            gridlines: {count: 15}
          },
          forceIFrame: true,
          vAxis: {
            gridlines: {color: 'none'},
            minValue: 0
          },
          legend: { position: "bottom" },
          };

          let chart = new google.visualization.LineChart(
          document.querySelector(".graphic_container")
          );

          chart.draw(data, options);
        } else {
          document.querySelector(".graphic_container").innerHTML = "No data";
        }
      });   
    }
  }
}
