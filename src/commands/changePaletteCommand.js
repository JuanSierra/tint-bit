import Command from './command.js'

export default function ChangePaletteCommand(color, graphics) {

    let oldValue;

    const execute = () => {
        if (graphics) {
            oldValue = graphics._color;
            graphics.setColor(color);
        }
    };

    const undo = () => {
        if (graphics && oldValue !== undefined) {
            graphics.setColor(oldValue);
        }
    };

    return new Command(execute, undo, color);
}