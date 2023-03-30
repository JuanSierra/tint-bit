import Command from './command'

/*export class PaletteCommand {
    constructor(operation, graphics, color) {
      this.operation = operation;
      this.graphics = graphics;
      this.color = color;
    }
  }
*/
export default function ZoomCommand(scale, graphics/*key, value*/) {

    let oldValue;

    const execute = () => {
        /*if (mockupDB.hasOwnProperty(key)) {
            oldValue = mockupDB[key];
            mockupDB[key] = value;
        }*/

        scale = parseInt(scale) * 2;
        graphics.scale = scale;
        graphics.recolorImage(255, 0, 0, 0, 255, 0);
    };

    const undo = () => {
        /*if (oldValue) {
            mockupDB[key] = oldValue;
        }*/
    };

    return new Command(execute, undo, scale);
}

/*
function Zoom(e) {
    scale = parseInt(e.target.value) * 2;
    recolorImage(theImage, 255, 0, 0, 0, 255, 0);
}*/