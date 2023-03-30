export default class Zoom {
    constructor(window, element) {
      this.eventHandler = {};
      this.window = window;

      this._els = {
        zoom_x1: element.getElementById("A"),
        zoom_x2: element.getElementById("B"),
        zoom_x3: element.getElementById("C")
      };
    }
  
    addEvent(actions) {
      this.eventHandler.zoomSelected = this._zoomSelected.bind(this);
  
      this.actions = actions;
      //this.ele.addEventListener('click', this.eventHandler.rotationAngleChanged);
      //this._els.paletteList.addEventListener('click', this.eventHandler.rotationAngleChanged);
      //this._els.paletteList.addEventListener('change', this._listChanged.bind(this));
      this._els.zoom_x1.addEventListener("change", this._zoomSelected.bind(this));
      this._els.zoom_x2.addEventListener("change", this._zoomSelected.bind(this));
      this._els.zoom_x3.addEventListener("change", this._zoomSelected.bind(this));
    }

    _zoomSelected(event) {
      this.actions.changeZoom(event.target.value);
    }
  /*
    _paletteChanged(event) {
        //console.log(event)
      const palette = this._els.paletteList.value;
      //console.log('aasd ')
      //console.log(this._els.paletteList)
      this.actions.updatePalette(palette);
    }
    
    _listChanged(event) {
        console.log(event)
        //const palette = this._els.paletteList.value;
      //this.actions.updatePalette(palette);
      this.actions.updatePalette('palette');
    }*/
  }