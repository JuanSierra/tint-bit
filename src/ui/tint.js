export default class Tint {
    constructor(window, element) {
      this.eventHandler = {};
      this.window = window;

      this._els = {
        canvasTop: element.getElementById("canvasTop")
      };
    }
  
    addEvent(actions) {
      this.actions = actions;
      console.log("adding tint events")
      this._els.canvasTop.addEventListener("mousedown", this._mouseDown.bind(this));
    }

    _mouseDown(event) {
        let posX = this._els.canvasTop.getBoundingClientRect().left;
        let posY = this._els.canvasTop.getBoundingClientRect().top;
        let mouseX = parseInt(event.clientX - posX);
        let mouseY = parseInt(event.clientY - posY);

        this.actions.tintRegion(mouseX, mouseY);
    }
  }