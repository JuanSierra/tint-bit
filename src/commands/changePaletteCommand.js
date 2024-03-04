import Command from './command'

/*export class PaletteCommand {
    constructor(operation, graphics, color) {
      this.operation = operation;
      this.graphics = graphics;
      this.color = color;
    }
  }
*/
export default function ChangePaletteCommand(key, value) {

    let oldValue;

    const execute = (graphics, color) => {
        /*if (mockupDB.hasOwnProperty(key)) {
            oldValue = mockupDB[key];
            mockupDB[key] = value;
        }*/
        //const paletteComponent = graphics.getComponent('PALETTE');
        graphics.setColor(color);
    };

    const undo = () => {
        /*if (oldValue) {
            mockupDB[key] = oldValue;
        }*/
    };

    return new Command(execute, undo, value);
}