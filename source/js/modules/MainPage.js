import {TableCovid} from './TableCovid';

export class MainPage {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  init() {
    this.renderContent();
  }

  renderHeader() {

  }

  renderContent() {
    new TableCovid(this.rootElement).init();
  }

  renderFooter() {

  }
}
