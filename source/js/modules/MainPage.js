import {Graphic} from './Graphic';
import {TableCovid} from './TableCovid';
import {WorldMap} from './WorldMap';
import {ListCountries} from './ListCountries';

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

    this.contentElement.append(this.tableContainer, this.listContainer, this.mapContainer, this.graphicContainer);

    const worldMap = new WorldMap(this.mapContainer);
    const tableCovid = new TableCovid(this.tableContainer);
    const listCountries = new ListCountries(this.listContainer);
    const graphic = new Graphic(this.graphicContainer);
    worldMap.init();
    tableCovid.init();
    listCountries.init();
    graphic.init();
    this.clickSwitcher(this.rootElement, tableCovid, listCountries);
  }

  renderFooter() {
    this.footerElement = document.createElement('footer');
    this.footerElement.classList.add('footer');
  }

  clickSwitcher(button, instanceClassTable, instanceClassList) {
    button.addEventListener('click', (e) => {
      if (e.target.textContent === '<' || e.target.textContent === '>') {
        if (this.dataAttributeIndex > 3) {
          this.dataAttributeIndex = 0;
        } else if (this.dataAttributeIndex < 0) {
          this.dataAttributeIndex = 3;
        }
      }

      if (e.target.textContent === 'Confirmed') {
        this.dataAttributeBottomSwitcher = 'Confirmed';
        const confirmedButtonTable = document.querySelectorAll('.options__item')[0];
        const confirmedButtonList = document.querySelectorAll('.container-list-options__item')[0];
        confirmedButtonTable.click();
        confirmedButtonList.click();
      } else if (e.target.textContent === 'Dead') {
        this.dataAttributeBottomSwitcher = 'Dead';
        const deadButtonTable = document.querySelectorAll('.options__item')[1];
        const deadButtonList = document.querySelectorAll('.container-list-options__item')[1];
        deadButtonTable.click();
        deadButtonList.click();
      } else if (e.target.textContent === 'Recovered') {
        this.dataAttributeBottomSwitcher = 'Recovered';
        const recoveredButtonTable = document.querySelectorAll('.options__item')[2];
        const recoveredButtonList = document.querySelectorAll('.container-list-options__item')[2];
        recoveredButtonTable.click();
        recoveredButtonList.click();
      }

      if (e.target.textContent === '<') {
        const switcherTextArray = document.querySelectorAll('.container-switcher__title');
        this.dataAttributeIndex -= 1;
        this.dataAttributeIndex = this.dataAttributeIndex < 0 ? 3 : this.dataAttributeIndex;
        for (let i = 0; i < switcherTextArray.length; i += 1) {
          switcherTextArray[i].textContent = this.dataAttributeArray[this.dataAttributeIndex];
        }
        const confirmedButtonTable = document.querySelectorAll('.options__item')[0];
        const deadButtonTable = document.querySelectorAll('.options__item')[1];
        const recoveredButtonTable = document.querySelectorAll('.options__item')[2];
        const confirmedButtonList = document.querySelectorAll('.container-list-options__item')[0];
        const deadButtonList = document.querySelectorAll('.container-list-options__item')[1];
        const recoveredButtonList = document.querySelectorAll('.container-list-options__item')[2];
        instanceClassTable.dataAttributeHeaderSwitcher = this.dataAttributeArray[this.dataAttributeIndex];
        instanceClassList.dataAttributeHeaderSwitcher = this.dataAttributeArray[this.dataAttributeIndex];
        if (this.dataAttributeBottomSwitcher === 'Confirmed') {
          confirmedButtonTable.click();
          confirmedButtonList.click();
        } else if (this.dataAttributeBottomSwitcher === 'Dead') {
          deadButtonTable.click();
          deadButtonList.click();
        } else if (this.dataAttributeBottomSwitcher === 'Recovered') {
          recoveredButtonTable.click();
          recoveredButtonList.click();
        }
      } else if (e.target.textContent === '>') {
        const switcherTextArray = document.querySelectorAll('.container-switcher__title');
        this.dataAttributeIndex += 1;
        this.dataAttributeIndex = this.dataAttributeIndex > 3 ? 0 : this.dataAttributeIndex;
        for (let i = 0; i < switcherTextArray.length; i += 1) {
          switcherTextArray[i].textContent = this.dataAttributeArray[this.dataAttributeIndex];
        }
        const confirmedButtonTable = document.querySelectorAll('.options__item')[0];
        const deadButtonTable = document.querySelectorAll('.options__item')[1];
        const recoveredButtonTable = document.querySelectorAll('.options__item')[2];
        const confirmedButtonList = document.querySelectorAll('.container-list-options__item')[0];
        const deadButtonList = document.querySelectorAll('.container-list-options__item')[1];
        const recoveredButtonList = document.querySelectorAll('.container-list-options__item')[2];
        instanceClassTable.dataAttributeHeaderSwitcher = this.dataAttributeArray[this.dataAttributeIndex];
        instanceClassList.dataAttributeHeaderSwitcher = this.dataAttributeArray[this.dataAttributeIndex];
        if (this.dataAttributeBottomSwitcher === 'Confirmed') {
          confirmedButtonTable.click();
          confirmedButtonList.click();
        } else if (this.dataAttributeBottomSwitcher === 'Dead') {
          deadButtonTable.click();
          deadButtonList.click();
        } else if (this.dataAttributeBottomSwitcher === 'Recovered') {
          recoveredButtonTable.click();
          recoveredButtonList.click();
        }
      }
    });
  }
}
