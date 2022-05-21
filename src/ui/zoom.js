export class Zoom {
    constructor(element) {
      this.eventHandler = {};
  
      this._els = {
        zoom_x2: element.getElementById("B")
      };
    }
  
    addEvent(actions) {
      this.eventHandler.paletteChanged = this._paletteChanged.bind(this);
  
      this.actions = actions;
      //this.ele.addEventListener('click', this.eventHandler.rotationAngleChanged);
      //this._els.paletteList.addEventListener('click', this.eventHandler.rotationAngleChanged);
      //this._els.paletteList.addEventListener('change', this._listChanged.bind(this));
      this._els.zoom_x2.addEventListener("change", this._zoomSelected.bind(this));
    }

    _zoomSelected(event) {
        console.log(event)
        //const palette = this._els.paletteList.value;
      //this.actions.updatePalette(palette);
      //this.actions.updatePalette('palette');
      this.actions.changeZoom(2);
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