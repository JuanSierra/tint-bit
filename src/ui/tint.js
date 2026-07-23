export default class Tint {
    constructor(window, element) {
      this.eventHandler = {};
      this.window = window;

      this._els = {
        canvasTop: element.getElementById("canvasTop"),
        tintSize: element.getElementById("tint-size")
      };
    }
  
    addEvent(actions) {
      this.actions = actions;
      console.log("adding tint events")
      this._els.canvasTop.addEventListener("mousedown", this._mouseDown.bind(this));
      if (this._els.tintSize) {
        this._els.tintSize.addEventListener("change", this._changeSize.bind(this));
        this._els.tintSize.addEventListener("input", this._changeSize.bind(this));
      }
    }

    _mouseDown(event) {
        let rect = this._els.canvasTop.getBoundingClientRect();
        let scaleX = rect.width ? (this._els.canvasTop.width / rect.width) : 1;
        let scaleY = rect.height ? (this._els.canvasTop.height / rect.height) : 1;

        let mouseX = parseInt((event.clientX - rect.left) * scaleX);
        let mouseY = parseInt((event.clientY - rect.top) * scaleY);

        this.actions.tintRegion(mouseX, mouseY);
    }

    _changeSize(event) {
        let val = parseInt(event.target.value, 10);
        if (!isNaN(val) && val > 0) {
            this.actions.changeSize(val);
        }
    }
  }