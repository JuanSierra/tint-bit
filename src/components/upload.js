import Component from "./component";

/*export class PaletteCommand {
    constructor(operation, graphics, color) {
      this.operation = operation;
      this.graphics = graphics;
      this.color = color;
    }
  }
*/
export default class Upload extends Component() {
  constructor(graphics) {
    super("UPLOAD", graphics);
  }

  
}
