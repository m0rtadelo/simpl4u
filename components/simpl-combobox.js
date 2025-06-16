import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';

export class SimplCombobox extends FormElement {
  constructor() {
    super();
    this._items = this.getAttribute('items') || [];
    if (typeof this._items === 'string') {
      this._items = JSON.parse(this._items);
    }
    this.style = `
      simpl-combobox-list {
        max-height: 200px;
        overflow-y: auto;
        position: absolute;
        z-index: 1000;
      }`;
  }

  template(state) {
    return `
<div class="mb-3" ${this.hidden ? 'style="display:none"' : ''}>
<label for="${this.name || this.id}" class="form-label col-12">${LanguageService.i18n(this.label)}${this.required ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>
<input (input)="change" id="${this.name || this.id}" ${super.isRequired()} ${this.disabled ? 'disabled' : ''} class="form-control form-select col-12" type="text" value="${state[this.name || this.id] || ''}" list="${this.name || this.id}-list"></input>
<div>
  <simpl-combobox-list id="${this.name || this.id}-list"></simpl-combobox-list>
</div>
</div>
        `;
  }

  change(value) {
    this.get(`${this.name || this.id}-list`).filterText = value.target.value;
    this.get(`${this.name || this.id}-list`).refresh();
  }

  onReady() {
    const list = this.get(`${this.name || this.id}-list`);
    if (list) {
      list.items = this._items;
    }
  }
}
customElements.define('simpl-combobox', SimplCombobox);
