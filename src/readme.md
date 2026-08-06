# Tint Bit
A tile coloring editor for 1-bit pixel art.

## Features
* Tint B&W tilesets with custom palette colors
* Import JPEG, PNG, or GIF files
* Change tile brush sizes easily
* Edit tilesets with custom gap spacing
* Undo previous edits
* View and export at 1x, 2x, or 3x scale

## Web demo


## Build from source

### Clone the repo and install
```
git clone https://github.com/JuanSierra/tint-bit.git
cd tint-bit

npm install
```

### Execute the local server
```
npm run dev
```

> [!TIP]
>  The web editor will be available at: http://localhost:3000

### Customize base palettes
File src/palettes.json can be update to define any set of color palettes. You need to follow the following structure:
```json
{"name":"Palette Name","author":"Artist","colors":["0aff2f","ff2f0a","2f0aff"]}
```

## Credits

* [dunjo](https://arks.itch.io/dungeon-platform-tileset) by Arks Digital
* [fantasy-RPG set](https://github.com/marlersoft/zigwin32) by Clint Bellanger
* [1-bit pack](https://kenney.nl/assets/1-bit-pack) by Kenney

## License

Tint Bit is licensed under the Apache License, see [LICENSE](LICENSE) for more information.