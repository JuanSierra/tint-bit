export default class Component {
    constructor(name) {
        // Value will be UI
        this.name = name;
    }

    getName = () => this.name;
}