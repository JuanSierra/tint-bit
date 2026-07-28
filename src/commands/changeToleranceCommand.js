import Command from './command.js'

export default function ChangeToleranceCommand(value, graphics) {

    let oldValue;

    const execute = () => {
        if (graphics) {
            oldValue = graphics.tintLight;
            graphics.tintLight = Boolean(value);
        }
    };

    const undo = () => {
        if (graphics && oldValue !== undefined) {
            graphics.tintLight = oldValue;
        }
    };

    return new Command(execute, undo, value);
}
