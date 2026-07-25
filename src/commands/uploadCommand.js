import Command from './command'

/*export class PaletteCommand {
    constructor(operation, graphics, color) {
      this.operation = operation;
      this.graphics = graphics;
      this.color = color;
    }
  }
*/
export default function UploadCommand(graphics, image) {

    let oldImage;
    let oldSourceImage;

    const execute = () => {
        oldImage = graphics._image;
        oldSourceImage = graphics._sourceImage;
        graphics.loadImage(image);
        // remove undo stack ?
    };

    const undo = () => {
        if (oldImage) {
            graphics._image = oldImage;
            graphics._sourceImage = oldSourceImage;
            graphics.recolorImage();
        }
    };

    return new Command(execute, undo, image);
}

/*
function Zoom(e) {
    scale = parseInt(e.target.value) * 2;
    recolorImage(theImage, 255, 0, 0, 0, 255, 0);
}*/
