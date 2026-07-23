import Command from './command.js'

export default function ZoomCommand(scale, graphics) {

    let oldValue;

    const execute = () => {
        oldValue = graphics.scale;
        graphics.scale = parseInt(scale, 10) || 1;
        graphics.recolorImage();
    };

    const undo = () => {
        if (oldValue !== undefined) {
            graphics.scale = oldValue;
            graphics.recolorImage();
        }
    };

    return new Command(execute, undo, scale);
}