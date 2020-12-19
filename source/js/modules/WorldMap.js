const URL = {
  SUMMARY: 'https://api.covid19api.com/summary'
};

export class WorldMap {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.data = null;
  }

  init() {
    this.data = this.getData();
  }

  renderContent() {

  }

  getData() {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', URL.SUMMARY);

    xhr.responseType = 'json';
    
    xhr.send();

    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.log(`Error ${xhr.status}: ${xhr.statusText}`);
        return;
      }
      console.log(xhr.response);
    };

    return xhr.response;
  }
}
