import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';

export class SimplSelect extends FormElement {
  constructor() {
    super();
    this._items = this.getAttribute('items') || [];
    if (typeof this._items === 'string') {
      this._items = JSON.parse(this._items);
    }
  }

  template(state) {
    return `
<div class="mb-3" ${this.hidden ? 'style="display:none"' : ''}>
<label for="${this.name || this.id}" class="form-label col-12">${LanguageService.i18n(this.label)}${this.required ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>
<select class="form-select" ${super.isRequired()} (change)="change" aria-label="${this.label}">
${ this.items.map(item => `
  <option value="${item.id}" ${state[this.name || this.id] === item.id ? 'selected' : ''}>${LanguageService.i18n(item.text)}</option>
`) }
</select>
</div>
    `;
  }

  change(value) {
    this.setField(this.name || this.id, value.target.value);
  }
}
customElements.define('simpl-select', SimplSelect);
