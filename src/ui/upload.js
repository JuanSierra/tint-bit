const acceptedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

export default class Upload {
    constructor(element) {
      this.eventHandler = {};
  
      this._els = {
        upload: element.getElementById("select-image"),
        button: element.getElementById("photo-button")
      };
    }
  
    addEvent(actions) {
      //this.eventHandler.paletteChanged = this._paletteChanged.bind(this);
  
      this.actions = actions;
      //this.ele.addEventListener('click', this.eventHandler.rotationAngleChanged);
      //this._els.paletteList.addEventListener('click', this.eventHandler.rotationAngleChanged);
      //this._els.paletteList.addEventListener('change', this._listChanged.bind(this));
      //this._els.zoom_x2.addEventListener("change", this._zoomSelected.bind(this));
      
      // indirect window opening 
      this._els.upload.addEventListener("click", _doClick);
      this._els.button.document.addEventListener("click", _setImage);
    }

    //var _URL = window.URL || window.webkitURL;

    _loadImage(e) {
        this.actions.loadImage(image);
/*
        theImage = this;
        recolorImage(this, 255, 0, 0, 0, 255, 0);*/
    }

    _setImage(e) {
      if (this.files && this.files[0]) {
        var file = this.files[0];
        
        if (_isSafeImage(file)) {
          var reader = new Image();
          reader.onload = _loadImage;
          reader.src = _URL.createObjectURL(this.files[0]);
        } else {
            alert("Not an accepted file type");
        }
      }
    }

    _doClick() {
        this._els.button.click();
    }

    _isSafeImage(file) {
        for (var i = 0; i < acceptedTypes.length; i++) {
          if (file.type === acceptedTypes[i]) {
            return true;
          }
        }
        return false;
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