import {Graphic} from './Graphic';
import {TableCovid} from './TableCovid';
import {WorldMap} from './WorldMap';
import {ListCountries} from './ListCountries';
import {Keyboard} from './keyboard';

const START_INDEX = 0;
const END_INDEX = 3;

export class MainPage {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.headerElement = null;
    this.footerElement = null;
    this.contentElement = null;
    this.tableContainer = null;
    this.listContainer = null;
    this.mapContainer = null;
    this.graphicContainer = null;
    this.dataAttributeIndex = 0;
    this.dataAttributeBottomSwitcher = 'Confirmed';
    this.dataAttributeArray = ['All period', 'Last day', 'All period 100000', 'Last day 100000'];

    this.optionsIndex = START_INDEX;
    this.switchesIndex = START_INDEX;

    this.worldMap = null;
    this.tableCovid = null;
    this.graphic = null;

    this.selectedCountryName = null;
    this.selectedCountryId = null;
  }

  init() {
    this.renderHeader();
    this.renderContent();
    this.renderFooter();
    this.rootElement.append(this.headerElement, this.contentElement, this.footerElement);
    window.addEventListener('DOMContentLoaded', function () {
      Keyboard.init();
    });
  }

  renderHeader() {
    this.headerElement = document.createElement('header');
    this.headerElement.classList.add('header');
    this.headerElement.textContent = 'Coronavirus Dashboard';
  }

  renderContent() {
    this.contentElement = document.createElement('main');
    this.contentElement.classList.add('main');

    this.tableContainer = document.createElement('div');
    this.listContainer = document.createElement('div');
    this.mapContainer = document.createElement('div');
    this.graphicContainer = document.createElement('div');
    this.graphicContainer.classList.add('graphic_container');

    this.mapContainer.classList.add('map-container');

    this.contentElement.append(this.tableContainer, this.listContainer, this.mapContainer, this.graphicContainer);

    this.worldMap = new WorldMap(this.mapContainer, this);
    this.worldMap.init();
    this.tableCovid = new TableCovid(this.tableContainer, this);
    this.tableCovid.init();
    this.listCountries = new ListCountries(this.listContainer, this);
    this.listCountries.init();
    this.graphic = new Graphic(this.graphicContainer, this);
    this.graphic.init();
    // const worldMap = new WorldMap(this.mapContainer, this);
    // const tableCovid = new TableCovid(this.tableContainer, this);
    // const listCountries = new ListCountries(this.listContainer);
    //const graphic = new Graphic(this.graphicContainer);
    // worldMap.init();
    // tableCovid.init();
    // listCountries.init();
    //graphic.init();
    // worldMap.changeRate(this.mainPage.optionsIndex, this.mainPage.switchesIndex);
    // tableCovid.changeTable();
  }

  renderFooter() {
    this.footerElement = document.createElement('footer');
    this.footerElement.classList.add('footer');
  }

  changeSwithesIndex(targetDataAttribute, switchRight, switchLeft) {
    if (targetDataAttribute === switchRight) {
      this.switchesIndex = this.switchesIndex === END_INDEX ? START_INDEX : this.switchesIndex + 1;
    } else if (targetDataAttribute === switchLeft) {
      this.switchesIndex = this.switchesIndex === START_INDEX ? END_INDEX : this.switchesIndex - 1;
    }

    this.worldMap.changeRate(this.optionsIndex, this.switchesIndex);
    this.tableCovid.changeTable();
    this.listCountries.changeList();
    this.graphic.drawGraphic(this.optionsIndex, this.switchesIndex, this.selectedCountryName);
  }

  changeOptionsIndex(targetDataAttribute, names) {
    this.optionsIndex = names.findIndex((name) => name === targetDataAttribute);
    this.worldMap.changeRate(this.optionsIndex, this.switchesIndex);
    this.tableCovid.changeTable();
    this.listCountries.changeList();
    this.graphic.drawGraphic(this.optionsIndex, this.switchesIndex, this.selectedCountryName);
    //console.log(`this.optionsIndex ${this.optionsIndex}`);
    //console.log(`this.switchesIndex ${this.switchesIndex}`);
  }

  showRateByCountry() {
    console.log(this.selectedCountryName);
    console.log(this.selectedCountryId);

    this.graphic.drawGraphic(this.optionsIndex, this.switchesIndex, this.selectedCountryName);
    this.tableCovid.selectCountry(this.selectedCountryName);
    this.listCountries.selectCountry(this.selectedCountryName);
  }
}
