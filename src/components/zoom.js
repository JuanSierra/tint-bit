import Component from './component'

/*export class PaletteCommand {
    constructor(operation, graphics, color) {
      this.operation = operation;
      this.graphics = graphics;
      this.color = color;
    }
  }
*/
export default class Zoom extends Component() {
    constructor(graphics){
        super("ZOOM", graphics);
    }
}