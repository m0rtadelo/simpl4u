import { StaticElement } from './static-element.js';

/**
 * FormElement is the base class for form input components.
 * It provides required/hidden/disabled state management and reactive updates.
 */
export class FormElement extends StaticElement {
  required = this.hasAttribute('required');
  hidden = this.hasAttribute('hidden');
  disabled = this.hasAttribute('disabled');
  type = this.getAttribute('type');
  placeholder = this.getAttribute('placeholder');
  #_items = [];

  /**
   * Returns the 'required' HTML attribute string when the field is required and not disabled or hidden.
   * @returns {string} 'required' or empty string
   */
  isRequired() {
    return this.required && !(this.disabled || this.hidden) ? 'required' : '';
  }

  get items() {
    return this.#_items;
  }

  set items(value) {
    this.#_items = value;
    this.refresh();
  }

  onUpdateState() {
    this.refresh();
  }
}
