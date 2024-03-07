import Zoom from './components/zoom'
import Palette from './components/palette'

export default class Graphics {
    constructor(name, canvas, top) {
        this.name = name;
        this._color = "#FF0000";
        this._componentMap = {};
        this._image = null;
        this._canvas = canvas;
        this._top = top;
        this._scale = 1;
        this._size = 8;

        Graphics.collection.set(name, this);

        this._createComponents();
    }
  
    static find(name) {
      return Graphics.collection.get(name);
    }

    get scale(){
        return this._scale;
    }
    
    set scale(value) {
        this._scale = value;
    }

    loadImage(image) {
        this._image = image;
        this.recolorImage(255, 0, 0, 0, 255, 0, true);
    }

    recolorImage(
        oldRed,
        oldGreen,
        oldBlue,
        newRed,
        newGreen,
        newBlue,
        isLoading)
    {
        let w = this._image.width;
        let h = this._image.height;
        isLoading = isLoading || false;

        this._canvas.width = w * this._scale;
        this._canvas.height = h * this._scale;
        this._top.width = w * this._scale;
        this._top.height = h * this._scale;
    
        let ctx = this._canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
    
        ctx.scale(this._scale, this._scale);
        // draw the image on the temporary canvas
        //if(isLoading)
        {
            ctx.drawImage(this._image, 0, 0, w, h);
        }
    
        // pull the entire image into an array of pixel data
        let imageData = ctx.getImageData(0, 0, w, h);
        console.log(imageData.data)
        let dark = 0;
        let clear = 0;
        // examine every pixel,
        // change any old rgb to the new-rgb
        for (let i = 0; i < imageData.data.length; i += 4) {
            // is this pixel the old rgb?
            
            /* 
            if (
                imageData.data[i] == oldRed &&
                imageData.data[i + 1] == oldGreen &&
                imageData.data[i + 2] == oldBlue
            ) {
                // change to your new rgb
                imageData.data[i] = newRed;
                imageData.data[i + 1] = newGreen;
                imageData.data[i + 2] = newBlue;
            }

       
            let hexa = this._fullColorHex(
                imageData.data[i],
                imageData.data[i + 1],
                imageData.data[i + 2]
            );
            let lum = this._calcLuminance(parseInt(hexa.toString(16),16));
        
            if (lum > 0.3) {
                imageData.data[i] = 255;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;
                dark++;
            } else clear++;
            this._fullColorHex(
                imageData.data[i],
                imageData.data[i + 1],
                imageData.data[i + 2]
            );*/
        }
    
        ctx.putImageData(imageData, 0, 0);
    
        console.log("dark:" + dark);
        console.log("clear:" + clear);
    }

    setColor(color) {
        this._color = color;
    }
    
    tintRegion(x, y) {
        let c = this._canvas;//document.getElementById("canvasBottom");
        let ctx = c.getContext("2d");
    
        let w = this._image.width;
        let h = this._image.height;
    
        var canvas = document.createElement("canvas");
        canvas.width = this._image.width;
        canvas.height = this._image.height;
        var vctx = canvas.getContext("2d");
        vctx.drawImage(this._image, 0, 0, w, h);
    
        let imageData = vctx.getImageData(0, 0, w, h);
        
        var size = this._size;
        var scale = this._scale;

        var x0 = parseInt(x / (size * scale));
        var y0 = parseInt(y / (size * scale));
        // examine every pixel,
        // change any old rgb to the new-rgb
        console.log('medidas');
        console.log(x);
        console.log(y);
        console.log(x0);
        console.log(y0);
    

        for (var x = x0 * size; x < x0 * size + size; x++ ) {
            for (var y = y0 * size; y < y0 * size + size; y++) {
                let index = y * (w * 4) + x * 4;
                let hexa = this._fullColorHex(imageData.data[index], imageData.data[index+1], imageData.data[index+2]);
                let lum = this._calcLuminance(parseInt(hexa.toString(16),16));
    
                if(lum < 0.3){
                    imageData.data[index] = 255;
                    imageData.data[index + 1] = 255;
                    imageData.data[index + 2] = 0;
                    //dark++;
                }
                
                //imageData.data[y * (w * 4) + x * 2] = 255;
            }
        }

        vctx.putImageData(imageData, 0, 0);
        //vctx.scale(scale, scale);
    

        // Tile extract
        var modified = canvas.toDataURL("image/png");
        console.log(modified);
        var tileCanvas = document.createElement("canvas");
        tileCanvas.width = canvas.width * scale;
        tileCanvas.height = canvas.height * scale;
        var tilectx = tileCanvas.getContext("2d");
        tilectx.imageSmoothingEnabled = false;
        tilectx.mozImageSmoothingEnabled = false;
        tilectx.webkitImageSmoothingEnabled = false;
    
        tilectx.scale(scale, scale);
        var modifiedImg = new Image();
        modifiedImg.src = modified;

        var changeImage = (newImage) => { this._image = newImage; }

        modifiedImg.onload = function (e) {
            changeImage(this);
            tilectx.drawImage(this, 0, 0);
            var f = tilectx.getImageData(
                x0 * size * scale,
                y0 * size * scale,
                size * scale,
                size * scale
            );
            ctx.putImageData(f, x0 * size * scale, y0 * size * scale);
        };
    }


    getComponent(name) {
        return this._componentMap[name];
    }

    _createComponents()
    {
        this._register(this._componentMap, new Zoom(this));
        this._register(this._componentMap, new Palette(this));
    }

    _register(map, module) {
        map[module.getName()] = module;
    }

    _rgbToHex = function (rgb) {
        let hex = Number(rgb).toString(16);
        if (hex.length < 2) {
          hex = "0" + hex;
        }
        return hex;
      };

      
    _fullColorHex = function (r, g, b) {
        var red = this._rgbToHex(r);
        var green = this._rgbToHex(g);
        var blue = this._rgbToHex(b);
        return red + green + blue;
      };

    _calcLuminance = function(rgb) {
        let r = (rgb & 0xff0000) >> 16;
        let g = (rgb & 0xff00) >> 8;
        let b = rgb & 0xff;
    
        return (r * 0.299 + g * 0.587 + b * 0.114) / 256;
    }
  }
  
  Graphics.collection = new Map();
