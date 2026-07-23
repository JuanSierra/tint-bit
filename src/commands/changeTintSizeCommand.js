import Command from './command.js'

export default function ChangeTintSizeCommand(size, graphics) {

    let oldValue;

    const execute = () => {
        oldValue = graphics.size;
        graphics.size = parseInt(size, 10);
    };

    const undo = () => {
        if (oldValue !== undefined) {
            graphics.size = oldValue;
        }
    };

    return new Command(execute, undo, size);
}
