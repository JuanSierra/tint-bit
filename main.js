import Editor from './src/Editor' 
import Graphics from './src/Graphics' 
import { operations } from './src/operations.js' 

const account1 = new Graphics('canvas1', document.getElementById("canvasBottom"), document.getElementById("canvasTop"));

var editor = new Editor(window, account1);

//editor.operation(account1, 'ChangeColor', 'white');

let scale = 1;
let size = 8;


let cnv = document.getElementById("canvasTop");
let ctx = cnv.getContext("2d");
let isDrawing = false;
/*
cnv.addEventListener("mousedown", (e) => {
  isDrawing = true;
  //drawHelper(e)

  let posX = cnv.getBoundingClientRect().left;
  let posY = cnv.getBoundingClientRect().top;
  let mouseX = parseInt(e.clientX - posX);
  let mouseY = parseInt(e.clientY - posY);

  colorRegion(mouseX, mouseY);
});
*/
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
  let rect = cnv.getBoundingClientRect();
  let scaleX = rect.width ? (cnv.width / rect.width) : 1;
  let scaleY = rect.height ? (cnv.height / rect.height) : 1;

  ctx.clearRect(0, 0, cnv.width, cnv.height);

  let mouseX = parseInt((e.clientX - rect.left) * scaleX);
  let mouseY = parseInt((e.clientY - rect.top) * scaleY);

  let prop = account1.size * account1.scale;
  let newX = Math.floor(mouseX / prop) * prop;
  let newY = Math.floor(mouseY / prop) * prop;

  //ctx.fillStyle = "rgb(200,0,0)";
  ctx.strokeStyle = "#FFA300";
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
      //reader.onload = account1.loadImage;
      reader.addEventListener("load", () => account1.loadImage(reader));
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

// Sample images
const sampleConfigs = [
  { size: 12, gap: 0 },
  { size: 16, gap: 0 },
  { size: 16, gap: 2 }
];

for (let i = 1; i <= 3; i++) {
  const sampleBtn = document.getElementById(`sample-${i}`);
  if (sampleBtn) {
    sampleBtn.addEventListener("click", () => {
      const config = sampleConfigs[i - 1];
      account1.size = config.size;
      account1.gap = config.gap;
      if (document.getElementById("tint-size")) {
        document.getElementById("tint-size").value = config.size;
      }
      if (document.getElementById("tint-gap")) {
        document.getElementById("tint-gap").value = config.gap;
      }
      const reader = new Image();
      reader.addEventListener("load", () => account1.loadImage(reader));
      reader.src = `./assets/sample${i}.png`;
    });
  }
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

/*
var x1 = document.getElementById("A");
var x2 = document.getElementById("B");
var x3 = document.getElementById("C");

x1.addEventListener("change", Zoom);
x2.addEventListener("change", Zoom);
x3.addEventListener("change", Zoom);
*/

/*  ------------------  LAST ONE
var op = document.getElementById("op");
var pal = new Palette(op);
op.addEventListener("change",
  function (ev) {
    alert(ev);
});
*/

/*
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
*/