import {TableCovid} from './TableCovid';
import {WorldMap} from './WorldMap';

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

    this.contentElement.append(this.tableContainer, this.listContainer, this.mapContainer, this.graphicContainer);

    const worldMap = new WorldMap(this.mapContainer);
    const tableCovid = new TableCovid(this.tableContainer);
    worldMap.init();
    tableCovid.init();
    this.clickSwitcher(this.rootElement, tableCovid);
  }

  renderFooter() {
    this.footerElement = document.createElement('footer');
    this.footerElement.classList.add('footer');
  }

  clickSwitcher(button, instanceClass) {
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
      } else if (e.target.textContent === 'Dead') {
        this.dataAttributeBottomSwitcher = 'Dead';
      } else if (e.target.textContent === 'Recovered') {
        this.dataAttributeBottomSwitcher = 'Recovered';
      }

      if (e.target.textContent === '<') {
        const switcherText = document.querySelector('.container-switcher__title');
        this.dataAttributeIndex -= 1;
        this.dataAttributeIndex = this.dataAttributeIndex < 0 ? 3 : this.dataAttributeIndex;
        switcherText.textContent = this.dataAttributeArray[this.dataAttributeIndex];
        const confirmedButton = document.querySelectorAll('.options__item')[0];
        const deadButton = document.querySelectorAll('.options__item')[1];
        const recoveredButton = document.querySelectorAll('.options__item')[2];
        instanceClass.dataAttributeHeaderSwitcher = this.dataAttributeArray[this.dataAttributeIndex];
        if (this.dataAttributeBottomSwitcher === 'Confirmed') {
          confirmedButton.click();
        } else if (this.dataAttributeBottomSwitcher === 'Dead') {
          deadButton.click();
        } else if (this.dataAttributeBottomSwitcher === 'Recovered') {
          recoveredButton.click();
        }
      } else if (e.target.textContent === '>') {
        const switcherText = document.querySelector('.container-switcher__title');
        this.dataAttributeIndex += 1;
        this.dataAttributeIndex = this.dataAttributeIndex > 3 ? 0 : this.dataAttributeIndex;
        switcherText.textContent = this.dataAttributeArray[this.dataAttributeIndex];
        const confirmedButton = document.querySelectorAll('.options__item')[0];
        const deadButton = document.querySelectorAll('.options__item')[1];
        const recoveredButton = document.querySelectorAll('.options__item')[2];
        instanceClass.dataAttributeHeaderSwitcher = this.dataAttributeArray[this.dataAttributeIndex];
        if (this.dataAttributeBottomSwitcher === 'Confirmed') {
          confirmedButton.click();
        } else if (this.dataAttributeBottomSwitcher === 'Dead') {
          deadButton.click();
        } else if (this.dataAttributeBottomSwitcher === 'Recovered') {
          recoveredButton.click();
        }
      }
    });
  }
}
