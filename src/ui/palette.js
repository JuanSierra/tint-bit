import paletteData from '../palettes.json';

export default class Palette {
  constructor(window, element) {
    this.eventHandler = {};
    this.window = window;
    this._palettes = paletteData;
    this._hasPalettes = Array.isArray(this._palettes) && this._palettes.length > 0;

    this._els = {
      paletteList: element.getElementById("op") || element.getElementById("paletteList"),
      palettePanel: element.getElementById("palettePanel"),
      paletteGrid: element.getElementById("palette-grid")
    };

    this._currentPalette = this._hasPalettes ? this._palettes[0] : { name: "Default", colors: [] };
    this._selectedIndex = 0;

    if (!this._hasPalettes) {
      this._showEmptyState();
      return;
    }

    this._initDropdown();
    this._applyPalette(this._currentPalette);
  }

  _initDropdown() {
    if (!this._els.paletteList) {
      return;
    }

    this._els.paletteList.innerHTML = "";
    this._palettes.forEach((palette) => {
      const option = this.window.document.createElement("option");
      option.value = palette.name;
      option.textContent = palette.name;
      this._els.paletteList.appendChild(option);
    });

    this._els.paletteList.value = this._currentPalette.name;
  }

  _applyPalette(palette) {
    if (!this._els.paletteGrid) {
      return;
    }

    this._els.paletteGrid.innerHTML = "";

    palette.colors.forEach((color, index) => {
      const swatch = this.window.document.createElement("div");
      const normalizedColor = `#${color}`;

      swatch.className = "palette-swatch";
      swatch.style.backgroundColor = normalizedColor;
      swatch.dataset.color = normalizedColor;
      swatch.dataset.index = String(index);

      if (index === this._selectedIndex) {
        swatch.classList.add("selected");
      }

      this._els.paletteGrid.appendChild(swatch);
    });

    if (this._selectedIndex >= palette.colors.length) {
      this._selectedIndex = 0;
    }

    this._selectSquare(this._selectedIndex);
  }

  _selectSquare(index) {
    if (!this._els.paletteGrid) {
      return;
    }

    this._selectedIndex = index;

    Array.from(this._els.paletteGrid.querySelectorAll(".palette-swatch")).forEach((square) => {
      square.classList.remove("selected");
    });

    const square = this._els.paletteGrid.querySelector(`.palette-swatch[data-index="${index}"]`);
    if (square) {
      square.classList.add("selected");
    }
  }

  _findPalette(name) {
    if (!this._hasPalettes) {
      return null;
    }

    return this._palettes.find((palette) => palette.name === name) || this._palettes[0];
  }

  _showEmptyState() {
    const document = this.window.document;
    const modal = document.createElement("dialog");

    modal.id = "palette-empty-modal";
    modal.innerHTML = `
      <h3 class="modal-header">No palettes available</h3>
      <div class="modal-body">
        <p>There are no palettes defined in <code>src/palettes.json</code>.</p>
        <p>Add at least one palette to continue.</p>
      </div>
      <footer class="modal-footer">
        <button id="palette-empty-ok" type="button">OK</button>
      </footer>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
      if (modal.close) {
        modal.close();
      } else {
        modal.removeAttribute("open");
      }
    };

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    const okButton = modal.querySelector("#palette-empty-ok");
    if (okButton) {
      okButton.addEventListener("click", closeModal);
    }

    if (modal.showModal) {
      modal.showModal();
    } else {
      modal.setAttribute("open", "open");
    }
  }

  addEvent(actions) {
    this.actions = actions;

    if (this._els.paletteGrid) {
      this._els.paletteGrid.addEventListener("mousedown", (e) => {
        const square = e.target.closest(".palette-swatch");
        if (!square) {
          return;
        }

        e.preventDefault();
        const index = parseInt(square.dataset.index, 10);
        this._selectSquare(index);

        if (this.actions && typeof this.actions.changeColor === "function") {
          this.actions.changeColor(square.dataset.color);
        }
      });
    }

    if (this._els.paletteList) {
      this._els.paletteList.addEventListener("change", this._paletteChanged.bind(this));
    }
  }

  _paletteChanged(event) {
    if (!this._els.paletteList || !this.actions) {
      return;
    }

    const palette = this._findPalette(this._els.paletteList.value);
    if (!palette) {
      return;
    }

    this._currentPalette = palette;
    this._selectedIndex = 0;
    this._applyPalette(palette);

    if (typeof this.actions.updatePalette === "function") {
      this.actions.updatePalette(palette.name);
    }

    if (typeof this.actions.changeColor === "function" && palette.colors[0]) {
      this.actions.changeColor(`#${palette.colors[0]}`);
    }
  }
}
