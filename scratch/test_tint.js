import TintCommand from '../src/commands/tintCommand.js';
import ChangeTintSizeCommand from '../src/commands/changeTintSizeCommand.js';

// Mock Graphics
class MockGraphics {
    constructor() {
        this._size = 8;
        this._scale = 1;
        this._image = { width: 64, height: 64 };
        this.tintedPixels = 0;
    }
    get size() { return this._size; }
    set size(val) { this._size = parseInt(val, 10) || 8; }
    get scale() { return this._scale; }
}

const g = new MockGraphics();

console.log("Initial size:", g.size);

const cmd1 = ChangeTintSizeCommand(32, g);
cmd1.execute();

console.log("Size after ChangeTintSizeCommand(32):", g.size);
