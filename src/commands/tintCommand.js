import Command from './command.js'

export default function TintCommand(graphics) {

    let initialImage = graphics ? graphics._image : null;
    let lastTileKey = null;

    const executeRegion = (mouseX, mouseY) => {
        if (!graphics) return;

        let scale = graphics.scale;
        let snappedX = graphics.snapToGrid(mouseX / scale);
        let snappedY = graphics.snapToGrid(mouseY / scale);
        let tileKey = `${snappedX},${snappedY}`;

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
