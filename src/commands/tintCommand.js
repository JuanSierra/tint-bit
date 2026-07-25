import Command from './command.js'

export default function TintCommand(graphics) {

    let initialImage = graphics ? graphics._image : null;
    let lastTileKey = null;

    const executeRegion = (mouseX, mouseY) => {
        if (!graphics) return;

        let size = graphics.size;
        let scale = graphics.scale;
        let x0 = Math.floor(mouseX / (size * scale));
        let y0 = Math.floor(mouseY / (size * scale));
        let tileKey = `${x0},${y0}`;

        if (tileKey === lastTileKey) {
            return;
        }

        lastTileKey = tileKey;
        graphics.tintRegion(mouseX, mouseY);
    };

    const undo = () => {
        if (graphics && initialImage) {
            graphics._image = initialImage;
            graphics.recolorImage();
        }
    };

    const cmd = new Command(() => {}, undo);
    cmd.executeRegion = executeRegion;
    return cmd;
}
