export default class Command {

    constructor(execute, undo, value) {
        // Value will be UI
        this.execute = execute;
        this.undo = undo;
        this.value = value;
    }
}