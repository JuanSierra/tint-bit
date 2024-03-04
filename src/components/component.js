export default class Component {
    constructor(name, graphics) {
        // Value will be UI
        this.name = name;
        this.graphics = graphics;
    }

    getName = () => this.name;

    getCanvas() {
        return this.graphics.getCanvas();
    }
}