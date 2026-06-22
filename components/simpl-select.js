import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';

/**
 * SimplSelect renders a native HTML select dropdown with items.
 * It auto-selects the first item when no value is set.
 */
export class SimplSelect extends FormElement {
  constructor() {
    super();
    this.items = this.getAttribute('items') || [];
    if (typeof this.items === 'string') {
      try { this.items = JSON.parse(this.items); } catch { this.items = []; }
    }
  }

  /**
   * Called when the element is added to the DOM. Sets default value if none is set.
   */
  connectedCallback() {
    super.connectedCallback?.();
    if (!this._defaultSet) {
      this._defaultSet = true;
      this.setValueWhenAllItemsAreSet();
    }
  }

  /**
   * Generates the HTML template for the select dropdown.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    return this.label ? this.#selectWithLabel(state) : this.#selectWithoutLabel(state);
  }

  /**
   * Sets the selected option value in the model.
   * @param {Event} value - The change event from the select element
   */
  change(value) {
    this.setField(this.getName(), value.target.value);
  }

  /**
   * Sets the first item as default when no value is set.
   */
  setValueWhenAllItemsAreSet() {
    if (this.items.length > 0 && !this.getField(this.getName())) {
      this.setField(this.getName(), this.items[0].id);
    }
  }

  #selectWithLabel(state) {
    return `
<div class="mb-3" ${this.hidden ? 'style="display:none"' : ''}>
<label for="${this.getName()}" class="form-label col-12">${LanguageService.i18n(this.label)}${this.required ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>
<select class="form-select" ${super.isRequired()} (change)="change" ${this.disabled ? 'disabled' : ''} aria-label="${LanguageService.i18n(this.label)}">
${ this.items.map(item => `
  <option value="${item.id}" ${state[this.getName()] === item.id ? 'selected' : ''}>${LanguageService.i18n(item.text)}</option>
`) }
</select>
</div>
    `;
  }

  #selectWithoutLabel(state) {
    return `
<div ${this.hidden ? 'style="display:none"' : ''}>
<select class="form-select" ${super.isRequired()} (change)="change" ${this.disabled ? 'disabled' : ''} aria-label="${LanguageService.i18n(this.label)}">
${ this.items.map(item => `
  <option value="${item.id}" ${state[this.getName()] === item.id ? 'selected' : ''}>${LanguageService.i18n(item.text)}</option>
`) }
</select>
</div>
    `;
  }
}
customElements.define('simpl-select', SimplSelect);
