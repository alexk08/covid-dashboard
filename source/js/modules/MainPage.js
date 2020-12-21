import {Graphic} from './Graphic';
import {TableCovid} from './TableCovid';
import {WorldMap} from './WorldMap';
import {ListCountries} from './ListCountries';
import {Keyboard} from './keyboard';

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

    const worldMap = new WorldMap(this.mapContainer);
    const tableCovid = new TableCovid(this.tableContainer);
    const listCountries = new ListCountries(this.listContainer);
    const graphic = new Graphic(this.graphicContainer);
    worldMap.init();
    tableCovid.init();
    listCountries.init();
    graphic.init();
    this.clickSwitcher(this.rootElement, tableCovid, listCountries, graphic);
  }

  renderFooter() {
    this.footerElement = document.createElement('footer');
    this.footerElement.classList.add('footer');
  }

  clickSwitcher(button, instanceClassTable, instanceClassList, instanceClassGraphic) {
    const confirmedButtonTable = document.querySelectorAll('.options__item')[0];
    const deadButtonTable = document.querySelectorAll('.options__item')[1];
    const recoveredButtonTable = document.querySelectorAll('.options__item')[2];
    const confirmedButtonList = document.querySelectorAll('.container-list-options__item')[0];
    const deadButtonList = document.querySelectorAll('.container-list-options__item')[1];
    const recoveredButtonList = document.querySelectorAll('.container-list-options__item')[2];
    const confirmedButtonGraphic = document.querySelectorAll('.container-graphic-options__item')[0];
    const deadButtonGraphic = document.querySelectorAll('.container-graphic-options__item')[1];
    const recoveredButtonGraphic = document.querySelectorAll('.container-graphic-options__item')[2];
    instanceClassTable.dataAttributeHeaderSwitcher = this.dataAttributeArray[this.dataAttributeIndex];
    instanceClassList.dataAttributeHeaderSwitcher = this.dataAttributeArray[this.dataAttributeIndex];
    instanceClassGraphic.dataAttributeHeaderSwitcher = this.dataAttributeArray[this.dataAttributeIndex];
  }
}
