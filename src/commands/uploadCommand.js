import Command from './command'

/*export class PaletteCommand {
    constructor(operation, graphics, color) {
      this.operation = operation;
      this.graphics = graphics;
      this.color = color;
    }
  }
*/
export default function UploadCommand(key, value) {

    let oldValue;

    const execute = (graphics) => {
        /*if (mockupDB.hasOwnProperty(key)) {
            oldValue = mockupDB[key];
            mockupDB[key] = value;
        }*/
        //const loader = graphics.getComponent("UPLOAD");
        graphics.loadImage(image);
        // remove undo stack ?
    };

    const undo = () => {
        /*if (oldValue) {
            mockupDB[key] = oldValue;
        }*/
    };

    return new Command(execute, undo, value);
}

/*
function Zoom(e) {
    scale = parseInt(e.target.value) * 2;
    recolorImage(theImage, 255, 0, 0, 0, 255, 0);
}*/