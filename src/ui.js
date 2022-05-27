import Palette from "./ui/palette";
import Upload from "./ui/upload";

const SUB_UI_COMPONENT = {
  Palette,
  Upload
};

export default class UI {
  constructor() {
    this._options = {
      menu: ["Palette", "Upload"],
    };
  }

  // TODO: rename element to document in all files
  init(element, actions) {
    this._actions = actions;
    this._window = element;
    this._element = element.document;

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
