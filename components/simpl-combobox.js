import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';
import { TextService } from '../services/text-service.js';

/**
 * SimplCombobox is a form input with autocomplete dropdown.
 * It provides a text input that filters a list of items and auto-selects on match.
 */
export class SimplCombobox extends FormElement {
  subscription;
  constructor() {
    super();
    this._items = this.getAttribute('items') || [];
    if (typeof this._items === 'string') {
      try { this._items = JSON.parse(this._items); } catch { this._items = []; }
    }
    this.style = `
      simpl-combobox-list {
        max-height: 200px;
        overflow-y: auto;
        position: absolute;
        z-index: 1000;
        width: 100%;
      }`;
    this.text = this.model[this.name || this.id];
    const match = this._items.find(item => item.id === this.text);
    if (match) this.text = match.text;
  }

  /**
   * Generates the HTML template for the combobox input and dropdown list.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    return `
<div class="mb-3" ${this.hidden ? 'style="display:none"' : ''}>
<label for="${this.name || this.id}" class="form-label col-12">${LanguageService.i18n(this.label)}${this.required ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>
<div style="position: relative">
  <input (input)="change" (keydown)="onKeyDown" (blur)="blur" (focus)="focus" id="${this.name || this.id}" ${super.isRequired()} ${this.disabled ? 'disabled' : ''} class="form-control form-select col-12" type="text" value="${TextService.htmlEscape(this.text || '')}" list="${this.name || this.id}-list" style="cursor: pointer"></input>
  <button (click)="clear" type="button" class="btn p-0" title="${LanguageService.i18n('clear')}" style="position: absolute; right: 40px; top: 25%; border: none; background: none; z-index: 5; line-height: 1; ${this.text ? '' : 'display: none'}">&times;</button>
</div>
<div style="position: relative">
  <simpl-combobox-list id="${this.name || this.id}-list"></simpl-combobox-list>
</div>
</div>
        `;
  }

  /**
   * Handles input changes, filtering the dropdown list by the typed text.
   * @param {Event} value - The input event
   */
  change(value) {
    const text = value?.target?.value || '';
    this.get(`${this.name || this.id}-list`).filterText = text;
    this.get(`${this.name || this.id}-list`).refresh();
  }

  /**
   * Clears the selected value and closes the dropdown.
   */
  clear() {
    this.setField(this.name || this.id, '');
    this.text = '';
    this.get(`${this.name || this.id}-list`).open = false;
    this.get(`${this.name || this.id}-list`).filterText = '';
    this.get(`${this.name || this.id}-list`).refresh();
    this.refresh();
  }

  /**
   * Handles keydown events. On Enter, validates and auto-selects if one match.
   * @param {KeyboardEvent} event - The keyboard event
   */
  onKeyDown(event) {
    if (event.key === 'Enter') {
      const list = this.get(`${this.name || this.id}-list`);
      list.validate();
      list.open = false;
      list.filterText = this.text || '';
      list.refresh();
      this.refresh();
    }
  }

  /**
   * Handles blur by validating and auto-selecting the matched item.
   */
  blur() {
    const list = this.get(`${this.name || this.id}-list`);
    list.validate();
    setTimeout(() => {
      list.open = false;
      list.filterText = this.text || '';
      list.refresh();
      this.refresh();
    }, 100);
  }

  /**
   * Handles focus by opening the dropdown and showing matching items.
   */
  focus() {
    this.get(`${this.name || this.id}-list`).open = true;
    this.change({ target: { value: this.text }});
  }

  /**
   * Sets up the dropdown list with items and subscribes to selection events.
   */
  onReady() {
    const list = this.get(`${this.name || this.id}-list`);
    if (list) {
      list.items = this._items;
      this.subscription?.();
      this.subscription = list.subscribe((action, data) => {
        this.setField(this.name || this.id, data.id);
        this.text = data.text;
        this.refresh();
        setTimeout(() => {
          list.filterText = data.text;
          list.refresh();
        }, 100);
      });
    }
  }
}
customElements.define('simpl-combobox', SimplCombobox);
