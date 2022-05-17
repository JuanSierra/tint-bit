let scale = 1;
let size = 16;

function calcLuminance(rgb) {
  let r = (rgb & 0xff0000) >> 16;
  let g = (rgb & 0xff00) >> 8;
  let b = rgb & 0xff;

  return (r * 0.299 + g * 0.587 + b * 0.114) / 256;
}

let rgbToHex = function (rgb) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

let fullColorHex = function (r, g, b) {
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return red + green + blue;
};

function recolorImage(
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

function colorRegion(x, y) {
  let c = document.getElementById("canvasBottom");
  let ctx = c.getContext("2d");

  let w = theImage.width;
  let h = theImage.height;

  var canvas = document.createElement("canvas");
  canvas.width = theImage.width;
  canvas.height = theImage.height;
  var vctx = canvas.getContext("2d");
  vctx.drawImage(theImage, 0, 0, w, h);

  let imageData = vctx.getImageData(0, 0, w, h);
  var x0 = parseInt(x / (size * scale));
  var y0 = parseInt(y / (size * scale));
  // examine every pixel,
  // change any old rgb to the new-rgb
  console.log(y0 * size + x0);
  console.log(y0 * size + x0 + size * 4);

  for (var x = x0 * size; x < x0 * size + size; x++) {
    for (var y = y0 * size; y < y0 * size + size; y++) {
      imageData.data[y * (w * 4) + x * 4] = 255;
    }
  }
  /*
    for (let i = y0*size+x0*size; i < (y0*size+x0*size)+size*4; i += 4) {

        // is this pixel the old rgb?
        if (imageData.data[i] == oldRed && imageData.data[i + 1] == oldGreen && imageData.data[i + 2] == oldBlue) {
            // change to your new rgb
            imageData.data[i] = newRed;
            imageData.data[i + 1] = newGreen;
            imageData.data[i + 2] = newBlue;
        }
        //let hexa = fullColorHex(imageData.data[i], imageData.data[i+1], imageData.data[i+2]);
        //let lum = calcLuminance(hexa);

        //if(lum>0.3){
		  imageData.data[i] = 255;
		  imageData.data[i + 1] = 255;
		  imageData.data[i + 2] = 0;
          //dark++;
        //}
        //else
          //clear++;
        fullColorHex(imageData.data[i], imageData.data[i+1], imageData.data[i+2])
    }
   */

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

  modifiedImg.onload = function (e) {
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

let cnv = document.getElementById("canvasTop");
let ctx = cnv.getContext("2d");
let isDrawing = false;

cnv.addEventListener("mousedown", (e) => {
  isDrawing = true;
  //drawHelper(e)

  let posX = cnv.getBoundingClientRect().left;
  let posY = cnv.getBoundingClientRect().top;
  let mouseX = parseInt(e.clientX - posX);
  let mouseY = parseInt(e.clientY - posY);

  colorRegion(mouseX, mouseY);
});

window.addEventListener("mouseup", (e) => {
  if (isDrawing === true) {
    isDrawing = false;
  }
});

cnv.addEventListener("mousemove", (e) => {
  //if (isDrawing === true)
  {
    e.preventDefault();
    e.stopPropagation();
    drawHelper(e);
  }
});

function drawHelper(e) {
  ctx.clearRect(0, 0, cnv.width * scale, cnv.height * scale);
  let posX = cnv.getBoundingClientRect().left;
  let posY = cnv.getBoundingClientRect().top;

  let mouseX = parseInt(e.clientX - posX);
  let mouseY = parseInt(e.clientY - posY);
  let prop = size * scale;
  let newX = parseInt(mouseX / prop) * prop;
  let newY = parseInt(mouseY / prop) * prop;

  ctx.fillStyle = "rgb(200,0,0)";
  ctx.strokeRect(newX, newY, prop, prop);
}

// Upload file

var btn = document.getElementById("photo-button");
var setImg = document.getElementById("select-image");
btn.addEventListener("change", setImage);
setImg.addEventListener("click", setImage2);

var _URL = window.URL || window.webkitURL;

function setImage(e) {
  if (this.files && this.files[0]) {
    var file = this.files[0];
    var img = safeImage(file);
    if (img) {
      var reader = new Image();
      reader.onload = loadImage;
      reader.src = _URL.createObjectURL(this.files[0]);
    } else {
      alert("Not an accepted file type");
    }
  }
}

function safeImage(file) {
  var acceptedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
  for (var i = 0; i < acceptedTypes.length; i++) {
    if (file.type === acceptedTypes[i]) {
      return true;
    }
  }
  return false;
}

function setImage2() {
  btn.click();
}
var theImage;

function loadImage(e) {
  theImage = this;
  recolorImage(this, 255, 0, 0, 0, 255, 0);
}

// Dialog

const modal = document.querySelector("dialog");

function showDialog() {
  const closeButton = document.getElementById("close");

  // close modal on backdrop click
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close("cancelled");
    }
  });

  // makes modal appear (adds `open` attribute)
  if (modal.showModal) {
    modal.showModal();
    modal.addEventListener("close", function onClose() {
      //outputBox.value = modal.returnValue;
    });
  } else {
    // polyfil
    modal.returnValue = "false";
    modal.setAttribute("open", "open");
    const closeButton = document.getElementById("close");
    if (closeButton) {
      closeButton.addEventListener("click", function onClose() {
        modal.returnValue = "false";
        //outputBox.value = modal.returnValue;
        modal.removeAttribute("open");
      });
    }
    const okButton = document.getElementById("ok");
    if (okButton) {
      okButton.addEventListener("click", function onConfirm() {
        modal.returnValue = "true";
        //outputBox.value = modal.returnValue;
        modal.removeAttribute("open");
      });
    }
  }

  setTimeout(function () {
    // hides modal (removes `open` attribute)
    if (modal.close) {
      modal.close("false");
    } else {
      modal.removeAttribute("open");
    }
    console.log(modal.returnValue); // logs `Accepted`
  }, 60000);
}

const showDialogButton = document.getElementById("select-imag");
if (showDialogButton) {
  showDialogButton.addEventListener("click", function onClose() {
    showDialog();
  });
}

function Zoom(e) {
  scale = parseInt(e.target.value) * 2;
  recolorImage(theImage, 255, 0, 0, 0, 255, 0);
}

var x1 = document.getElementById("A");
var x2 = document.getElementById("B");
var x3 = document.getElementById("C");

x1.addEventListener("change", Zoom);
x2.addEventListener("change", Zoom);
x3.addEventListener("change", Zoom);

var op = document.getElementById("op");
var pal = new Palette(op);
op.addEventListener("change", function (ev) {
  alert(ev);
});

class Palette {
  constructor(element) {
    this.eventHandler = {};

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
    //this._els.palettePanel.on('change', this._changeRotateForRange.bind(this));
  }

  _paletteChanged(event) {
    //const button = event.target.closest('.tui-image-editor-button');
    this.actions.rotate(rotateAngle);
  }
}

class PaletteComponent {
  constructor() {
    //this.parent = el;
    this.actions = null;
  }
}

const SUB_UI_COMPONENT = {
  Palette,
};

var UI = {
  _options: {
    menu: ["palette"],
  },
  init: function (element, actions) {
    this._actions = actions;
    this._element = element;

    this._makeMenu();
  },

  _makeMenu: function () {
    forEach(this._options.menu, (menuName) => {
      const menuClass = (this[menuName] = SUB_UI_COMPONENT[menuName]);

      this[menuName] = new menuClass(this._element);
    });
  },

  _addMenuEvent: function () {
    forEach(this._options.menu, (menuName) => {
      this[menuName].addEvent(this._actions[menuName]);
    });
  },
};

var Editor = {
  init: function (element) {
    this._ui = UI.init(element, this.getActions());
  },

  getActions: function () {
    return {
      changePalette: this._changePaletteAction(),
    };
  },

  _changePaletteAction: function () {
    console.log("change");
  },

  execute(commandName, ...args) {
    // Inject an Graphics instance as first parameter
    //const theArgs = [this._graphics].concat(args);

    return this._invoker.execute(commandName, ...args);
  },
};

Editor.init(document);

class Command {
  constructor(invoker) {
    this._invoker = invoker;
  }

  execute(commandName, ...args) {
    // Inject an Graphics instance as first parameter
    //const theArgs = [this._graphics].concat(args);

    return this._invoker.execute(commandName, ...args);
  }
}
