const palettes = {
  "pico":[ '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA']
};


export default class Palette {
  constructor(window, element) {
    this.eventHandler = {};
    this.window = window;

    this._els = {
      paletteList: element.getElementById("paletteList"),
      palettePanel: element.getElementById("palettePanel"),
    };
  }

  addEvent(actions) {
    this.eventHandler.paletteChanged = this._paletteChanged.bind(this);

    this.actions = actions;
    //this.ele.addEventListener('click', this.eventHandler.rotationAngleChanged);
    //this._els.paletteList.addEventListener('click', this.eventHandler.rotationAngleChanged);
    /*this._els.paletteList.addEventListener(
      "change",
      this._listChanged.bind(this)
    );*/
  }

  _paletteChanged(event) {
    //console.log(event)
    const palette = this._els.paletteList.value;
    //console.log('aasd ')
    //console.log(this._els.paletteList)
    this.actions.updatePalette(palette);
  }

  _listChanged(event) {
    console.log(event);
    //const palette = this._els.paletteList.value;
    //this.actions.updatePalette(palette);
    this.actions.updatePalette("palette");
  }
}