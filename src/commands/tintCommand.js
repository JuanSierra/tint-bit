import Command from './command'

export default function TintCommand(mouseX, mouseY, graphics) {

    let oldValue;

    const execute = () => {
        graphics.tintRegion(mouseX, mouseY);
    };

    const undo = () => {
        /*if (oldValue) {
            mockupDB[key] = oldValue;
        }*/
    };

    return new Command(execute, undo, mouseX, mouseY);
}
