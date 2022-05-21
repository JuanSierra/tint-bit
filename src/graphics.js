import Zoom from './components/zoom'

export default class Graphics {
    constructor(name) {
        this.name = name;
        this.color = "default";
        this._componentMap = {};

        Graphics.collection.set(name, this);

        this._createComponents();
    }
  
    static find(name) {
      return Graphics.collection.get(name);
    }

    
    recolorImage(
    img,
    oldRed,
    oldGreen,
    oldBlue,
    newRed,
    newGreen,
    newBlue
  ) {
        let c = document.getElementById("canvasBottom");
    
        let w = img.width;
        let h = img.height;
    
        c.width = w * scale;
        c.height = h * scale;
        cnv.width = w * scale;
        cnv.height = h * scale;
    
        let ctx = c.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
    
        ctx.scale(scale, scale);
        // draw the image on the temporary canvas
        ctx.drawImage(img, 0, 0, w, h);
    
        // pull the entire image into an array of pixel data
        let imageData = ctx.getImageData(0, 0, w, h);
        let dark = 0;
        let clear = 0;
        // examine every pixel,
        // change any old rgb to the new-rgb
        for (let i = 0; i < imageData.data.length; i += 4) {
        // is this pixel the old rgb?
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
        let hexa = fullColorHex(
            imageData.data[i],
            imageData.data[i + 1],
            imageData.data[i + 2]
        );
        let lum = calcLuminance(hexa);
    
        if (lum > 0.3) {
            imageData.data[i] = 255;
            imageData.data[i + 1] = 0;
            imageData.data[i + 2] = 0;
            dark++;
        } else clear++;
        fullColorHex(
            imageData.data[i],
            imageData.data[i + 1],
            imageData.data[i + 2]
        );
        }
    
        ctx.putImageData(imageData, 0, 0);
    
        console.log("dark:" + dark);
        console.log("clear:" + clear);
    }


    _createComponents()
    {
        this._register(this._componentMap, new Zoom(this));
    }

    _register(map, module) {
        map[module.getName()] = module;
    }
  }
  
  Graphics.collection = new Map();
