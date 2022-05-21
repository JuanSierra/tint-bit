import Palette from "./ui/palette";

const SUB_UI_COMPONENT = {
  Palette,
};

export default class UI {
  constructor() {
    this._options = {
      menu: ["Palette"],
    };
  }

  init(element, actions) {
    this._actions = actions;
    this._element = element;

    this._makeMenu();
    this._addMenuEvent();
  }

  _makeMenu() {
    this._options.menu.forEach((menuName) => {
      const menuClass = (this[menuName] = SUB_UI_COMPONENT[menuName]);

      this[menuName] = new menuClass(this._element);
    });
  }

  _addMenuEvent() {
    this._options.menu.forEach((menuName) => {
      this[menuName].addEvent(this._actions[menuName]);
    });
  }
}
