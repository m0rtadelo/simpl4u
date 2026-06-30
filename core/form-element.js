import { StaticElement } from './static-element.js';

/**
 * FormElement is the base class for form input components.
 * It provides required/hidden/disabled state management and reactive updates.
 */
export class FormElement extends StaticElement {
  type = this.getAttribute('type');
  placeholder = this.getAttribute('placeholder');
  useViewState = false;
  #_items = [];

  /**
   * Whether the field is required. Reflects the 'required' attribute live so
   * it stays in sync when the attribute is updated after a re-render.
   */
  get required() {
    return this.hasAttribute('required');
  }

  set required(value) {
    this.#toggleAttribute('required', value);
  }

  /**
   * Whether the field is hidden. Reflects the 'hidden' attribute live.
   */
  get hidden() {
    return this.hasAttribute('hidden');
  }

  set hidden(value) {
    this.#toggleAttribute('hidden', value);
  }

  /**
   * Whether the field is disabled. Reflects the 'disabled' attribute live.
   */
  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    this.#toggleAttribute('disabled', value);
  }

  /**
   * Adds or removes a boolean attribute on the element.
   * @param {string} name - The attribute name
   * @param {boolean} value - Whether the attribute should be present
   */
  #toggleAttribute(name, value) {
    if (value) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
  }

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
    this.refresh(true);
  }

  onUpdateState(property) {
    this.refresh();
  }
}
