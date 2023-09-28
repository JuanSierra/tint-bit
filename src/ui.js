import Palette from "./ui/palette";
import Upload from "./ui/upload";
import Zoom from "./ui/zoom";
import Tint from "./ui/tint";

const SUB_UI_COMPONENT = {
  Palette,
  Upload,
  Zoom,
  Tint
};

export default class UI {
  constructor() {
    this._options = {
      menu: ["Palette", "Upload", "Zoom", "Tint"],
    };
  }

  // TODO: rename element to document in all files
  init(element, actions) {
    this._actions = actions;
    this._window = element;
    this._element = element.document;
    console.log('init ui')
    this._makeMenu();
    this._addMenuEvent();
  }

  _makeMenu() {
    this._options.menu.forEach((menuName) => {
      const menuClass = (this[menuName] = SUB_UI_COMPONENT[menuName]);

      this[menuName] = new menuClass(this._window, this._element);
    });
  }

  _addMenuEvent() {
    this._options.menu.forEach((menuName) => {
      this[menuName].addEvent(this._actions[menuName]);
    });
  }
}
