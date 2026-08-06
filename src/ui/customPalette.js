import paletteData from '../palettes.json';

const STORAGE_KEY = 'tint-bit-custom-palettes';

export default class CustomPalette {
  constructor(window, element) {
    this.eventHandler = {};
    this.window = window;
    this._element = element;
    this._customPalettes = this._loadCustomPalettes();
    this._selectedIndex = -1;
    this._allPalettes = this._getAllPalettes();

    this._els = {
      customPaletteBtn: element.getElementById('custom-palette-btn'),
      customPaletteModal: element.getElementById('custom-palette-modal'),
      paletteNameInput: element.getElementById('cp-name'),
      colorsTextarea: element.getElementById('cp-colors'),
      paletteList: element.getElementById('cp-list'),
      palettePreview: element.getElementById('cp-preview'),
      addBtn: element.getElementById('cp-add'),
      removeBtn: element.getElementById('cp-remove')
    };

    if (!this._els.customPaletteBtn) return;

    this._init();
  }

  _loadCustomPalettes() {
    try {
      const stored = this.window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  _saveCustomPalettes() {
    this.window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this._customPalettes));
  }

  _getAllPalettes() {
    return [...paletteData, ...this._customPalettes];
  }

  _init() {
    this._renderList();
    this._bindEvents();

    if (this._customPalettes.length > 0) {
      this._selectPalette(0);
    }
  }

  _bindEvents() {
    const { customPaletteBtn, addBtn, removeBtn, paletteList } = this._els;

    if (customPaletteBtn) {
      customPaletteBtn.addEventListener('click', () => this._showModal());
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => this._addPalette());
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => this._removePalette());
    }

    if (paletteList) {
      paletteList.addEventListener('click', (e) => {
        const item = e.target.closest('.cp-list-item');
        if (!item) return;
        const index = parseInt(item.dataset.index, 10);
        this._selectPalette(index);
      });
    }

    if (this._els.paletteNameInput) {
      this._els.paletteNameInput.addEventListener('input', () => this._liveUpdate());
    }

    if (this._els.colorsTextarea) {
      this._els.colorsTextarea.addEventListener('input', () => this._liveUpdate());
    }
  }

  _showModal() {
    const modal = this._els.customPaletteModal;
    if (!modal) return;

    this._renderList();

    const closeModal = () => {
      if (modal.close) {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    };

    modal.addEventListener('mousedown', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    if (modal.showModal) {
      modal.showModal();
    } else {
      modal.setAttribute('open', 'open');
    }
  }

  _renderList() {
    const list = this._els.paletteList;
    if (!list) return;

    list.innerHTML = '';

    if (this._customPalettes.length === 0) {
      const empty = this.window.document.createElement('div');
      empty.className = 'cp-empty';
      empty.textContent = 'No custom palettes yet.';
      list.appendChild(empty);
      return;
    }

    this._customPalettes.forEach((palette, index) => {
      const item = this.window.document.createElement('div');
      item.className = 'cp-list-item';
      item.dataset.index = String(index);

      if (index === this._selectedIndex) {
        item.classList.add('selected');
      }

      const nameSpan = this.window.document.createElement('span');
      nameSpan.className = 'cp-list-name';
      nameSpan.textContent = palette.name;

      item.appendChild(nameSpan);
      list.appendChild(item);
    });
  }

  _selectPalette(index) {
    if (index < 0 || index >= this._customPalettes.length) return;

    this._selectedIndex = index;
    const palette = this._customPalettes[index];

    if (this._els.paletteNameInput) {
      this._els.paletteNameInput.value = palette.name;
    }

    if (this._els.colorsTextarea) {
      this._els.colorsTextarea.value = palette.colors.join(', ');
    }

    this._renderList();
    this._renderPreview(palette);
  }

  _liveUpdate() {
    const name = this._els.paletteNameInput?.value?.trim() || 'Untitled';
    const colors = this._validateColors(this._els.colorsTextarea?.value || '');

    if (this._selectedIndex < 0 && (name !== 'New Palette' || colors.length !== 3)) {
      this._selectedIndex = this._customPalettes.length;
      this._customPalettes.push({ name, colors });
      this._saveCustomPalettes();
    } else if (this._selectedIndex >= 0) {
      this._customPalettes[this._selectedIndex] = { name, colors };
      this._saveCustomPalettes();
    }

    this._renderPreview({ name, colors });
    this._refreshSelectedItem(name, colors);
  }

  _refreshSelectedItem(name, colors) {
    const items = this._els.paletteList?.querySelectorAll('.cp-list-item');
    if (!items || !this._els.paletteList) return;

    items.forEach((item) => {
      const idx = parseInt(item.dataset.index, 10);
      if (idx === this._selectedIndex) {
        const nameSpan = item.querySelector('.cp-list-name');
        if (nameSpan) nameSpan.textContent = name;
      }
    });
  }

  _renderPreview(palette) {
    const preview = this._els.palettePreview;
    if (!preview) return;

    preview.innerHTML = '';

    if (!palette || !palette.colors || palette.colors.length === 0) {
      const empty = this.window.document.createElement('div');
      empty.className = 'cp-preview-empty';
      empty.textContent = 'No colors defined.';
      preview.appendChild(empty);
      return;
    }

    const grid = this.window.document.createElement('div');
    grid.className = 'cp-preview-grid';

    palette.colors.forEach((color) => {
      const swatch = this.window.document.createElement('div');
      swatch.className = 'cp-preview-swatch';
      swatch.style.backgroundColor = color;
      swatch.title = color;

      const wrapper = this.window.document.createElement('div');
      wrapper.className = 'cp-preview-item';
      wrapper.appendChild(swatch);
      grid.appendChild(wrapper);
    });

    preview.appendChild(grid);
  }

  _validateColors(value) {
    if (!value || !value.trim()) return [];

    return value
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0)
      .map(c => {
        if (!c.startsWith('#')) c = '#' + c;
        return c;
      })
      .filter(c => /^#[0-9A-Fa-f]{6}$/.test(c));
  }

  _addPalette() {
    this._els.paletteNameInput.value = 'New Palette';
    this._els.colorsTextarea.value = '#ff0000, #00ff00, #0000ff';

    this._selectedIndex = -1;
    this._renderList();
    this._renderPreview({ name: 'New Palette', colors: ['#ff0000', '#00ff00', '#0000ff'] });
  }

  _removePalette() {
    if (this._selectedIndex < 0 || this._selectedIndex >= this._customPalettes.length) {
      alert('Please select a palette to remove.');
      return;
    }

    if (!confirm(`Remove palette "${this._customPalettes[this._selectedIndex].name}"?`)) {
      return;
    }

    this._customPalettes.splice(this._selectedIndex, 1);
    this._saveCustomPalettes();

    if (this._customPalettes.length > 0) {
      this._selectedIndex = Math.min(this._selectedIndex, this._customPalettes.length - 1);
      this._selectPalette(this._selectedIndex);
    } else {
      this._selectedIndex = -1;
      if (this._els.paletteNameInput) this._els.paletteNameInput.value = '';
      if (this._els.colorsTextarea) this._els.colorsTextarea.value = '';
      if (this._els.palettePreview) this._els.palettePreview.innerHTML = '';
      this._renderList();
    }
  }

  addEvent(actions) {
    this.actions = actions;
  }
}
