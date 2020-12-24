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
    this.headerContainer = null;
    this.footerElement = null;
    this.footerContainer = null;
    this.contentElement = null;
    this.contentContainer = null;
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
    const wrapper = this.createWrapper();
    this.renderHeader();
    this.renderContent();
    this.renderFooter();
    this.rootElement.appendChild(wrapper);
    wrapper.append(this.headerElement, this.contentElement, this.footerElement);
    window.addEventListener('DOMContentLoaded', function () {
      Keyboard.init();
    });
  }

  createWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    return wrapper;
  }

  renderHeader() {
    this.headerElement = document.createElement('header');
    this.headerElement.classList.add('header');
    this.headerContainer = document.createElement('div');
    this.headerContainer.classList.add('container');
    this.headerContainer.textContent = 'Coronavirus Dashboard';
    this.headerElement.appendChild(this.headerContainer);
  }

  renderContent() {
    this.contentElement = document.createElement('main');
    this.contentElement.classList.add('main');
    this.contentContainer = document.createElement('div');
    this.contentContainer.classList.add('container');
    this.contentElement.appendChild(this.contentContainer);

    this.tableContainer = document.createElement('div');
    this.listContainer = document.createElement('div');
    this.mapContainer = document.createElement('div');
    this.graphicContainer = document.createElement('div');

    this.mapContainer.classList.add('map-container');

    this.contentContainer.append(this.listContainer, this.mapContainer, this.tableContainer, this.graphicContainer);

    this.worldMap = new WorldMap(this.mapContainer, this);
    this.worldMap.init();
    this.tableCovid = new TableCovid(this.tableContainer, this);
    this.tableCovid.init();
    this.listCountries = new ListCountries(this.listContainer, this);
    this.listCountries.init();
    this.graphic = new Graphic(this.graphicContainer, this);
    this.graphic.init();
  }

  renderFooter() {
    const yearSpan = document.createElement('span');
    yearSpan.classList.add('copyright__year');
    yearSpan.textContent = '2020 ©';

    const by = document.createElement ('span');
    by.textContent = 'by';

    const student1Link = document.createElement('a');
    student1Link.classList.add('copyright__student-link');
    student1Link.setAttribute('href', 'https://github.com/alexk08');
    student1Link.setAttribute('target', '__blank');
    student1Link.textContent = 'Aleksandr Krasinikov';

    const student2Link = document.createElement('a');
    student2Link.classList.add('copyright__student-link');
    student2Link.setAttribute('href', 'https://github.com/11alexey11');
    student2Link.setAttribute('target', '__blank');
    student2Link.textContent = 'Alexey Yanvarev';

    const student3Link = document.createElement('a');
    student3Link.classList.add('copyright__student-link');
    student3Link.setAttribute('href', 'https://github.com/gtm003');
    student3Link.setAttribute('target', '__blank');
    student3Link.textContent = 'Tatyana Grigorovich';

    const logo = document.createElement('img');
    logo.classList.add('copyright__logo-rs');
    logo.setAttribute('src', 'img/svg/rs_school_js.svg');
    logo.setAttribute('alt', 'Logo RS School');

    const courseLink = document.createElement('a');
    courseLink.classList.add('copyright__course-link');
    courseLink.setAttribute('href', 'https://rs.school/js/');
    courseLink.setAttribute('target', '__blank');
    courseLink.appendChild(logo);

    const copyrightElement = document.createElement('div');
    copyrightElement.classList.add('copyright');
    copyrightElement.append(yearSpan, by, student1Link, student2Link, student3Link, courseLink);

    // const container = document.createElement('div');
    // container.classList.add('container');
    // container.appendChild(copyrightElement);


    this.footerElement = document.createElement('footer');
    this.footerElement.classList.add('footer');
    this.footerContainer = document.createElement('div');
    this.footerContainer.classList.add('container');
    this.footerContainer.append(copyrightElement);
    this.footerElement.appendChild(this.footerContainer);
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
