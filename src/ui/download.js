export default class Download {
  constructor(window, element) {
    this.eventHandler = {};
    this.window = window;

    this._els = {
      download: element.getElementById("download-btn"),
      withScaling: element.getElementById("with-scaling")
    };
  }

  addEvent(actions) {
    this.actions = actions;
    this._els.download.addEventListener("click", this._download.bind(this));
  }

  _download() {
    const withScaling = this._els.withScaling ? this._els.withScaling.checked : false;
    this.actions.download(withScaling);
  }
}
