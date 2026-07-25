import Zoom from './components/zoom'
import Palette from './components/palette'
import Tint from './components/tint'

export default class Graphics {
    constructor(name, canvas, top) {
        this.name = name;
        this._color = "#FF0000";
        this._componentMap = {};
        this._image = null;
        this._sourceImage = null;
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

    get size(){
        return this._size;
    }

    set size(value) {
        let val = parseInt(value, 10);
        if (!isNaN(val) && val > 0) {
            this._size = val;
        }
    }

    loadImage(image) {
        this._sourceImage = image;
        this._image = image;
        this.recolorImage(255, 0, 0, 0, 255, 0, true);
    }

    recolorImage() {
        if (!this._image) return;

        let w = this._image.width;
        let h = this._image.height;

        this._canvas.width = w * this._scale;
        this._canvas.height = h * this._scale;
        this._top.width = w * this._scale;
        this._top.height = h * this._scale;

        let ctx = this._canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;

        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.drawImage(this._image, 0, 0, this._canvas.width, this._canvas.height);
    }

    setColor(color) {
        this._color = color;
    }
    
    tintRegion(x, y) {
        if (!this._image) return;

        let c = this._canvas;
        let ctx = c.getContext("2d");
    
        let w = this._image.width;
        let h = this._image.height;
    
        let canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        let vctx = canvas.getContext("2d");

        // Start from the current working image so prior tint edits remain.
        // The original loaded image is only used for comparison.
        vctx.drawImage(this._image, 0, 0, w, h);

        let sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = w;
        sourceCanvas.height = h;
        let sourceCtx = sourceCanvas.getContext("2d");
        let sourceImage = this._sourceImage || this._image;
        sourceCtx.drawImage(sourceImage, 0, 0, w, h);
        let sourceImageData = sourceCtx.getImageData(0, 0, w, h);
    
        let imageData = vctx.getImageData(0, 0, w, h);
        
        let size = this._size;
        let scale = this._scale;

        let x0 = Math.floor(x / (size * scale));
        let y0 = Math.floor(y / (size * scale));

        let startX = x0 * size;
        let startY = y0 * size;
        let endX = Math.min(startX + size, w);
        let endY = Math.min(startY + size, h);

        let [r, g, b] = this._parseColor(this._color);

        for (let px = startX; px < endX; px++) {
            for (let py = startY; py < endY; py++) {
                let index = py * (w * 4) + px * 4;
                let sourceHexa = this._fullColorHex(
                    sourceImageData.data[index],
                    sourceImageData.data[index + 1],
                    sourceImageData.data[index + 2]
                );
                let lum = this._calcLuminance(parseInt(sourceHexa.toString(16), 16));

                if (lum < 0.3) {
                    imageData.data[index] = r;
                    imageData.data[index + 1] = g;
                    imageData.data[index + 2] = b;
                }
            }
        }

        vctx.putImageData(imageData, 0, 0);

        this._image = canvas;

        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(canvas, 0, 0, c.width, c.height);
    }


    getComponent(name) {
        return this._componentMap[name];
    }

    _createComponents()
    {
        this._register(this._componentMap, new Zoom(this));
        this._register(this._componentMap, new Palette(this));
        this._register(this._componentMap, new Tint(this));
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

    _parseColor(color) {
        if (!color) return [255, 0, 0];
        if (typeof color === 'string' && color.startsWith('#')) {
            let hex = color.slice(1);
            if (hex.length === 3) {
                hex = hex.split('').map(c => c + c).join('');
            }
            if (hex.length === 6) {
                let num = parseInt(hex, 16);
                return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
            }
        }
        if (typeof color === 'string') {
            let match = color.match(/\d+/g);
            if (match && match.length >= 3) {
                return [parseInt(match[0], 10), parseInt(match[1], 10), parseInt(match[2], 10)];
            }
        }
        return [255, 0, 0];
    }
  }
  
  Graphics.collection = new Map();
