import Command from './command.js'

export default function UndoCommand(editor) {
    const execute = () => {
        editor.undo();
    };

    const undo = () => {
        // Undo is its own inverse; nothing to restore here.
    };

    return new Command(execute, undo);
}
