import { StaticElement } from './static-element.js';

/**
 * FormElement is the base class for form input components.
 * It provides required/hidden/disabled state management and reactive updates.
 */
export class FormElement extends StaticElement {
  required = this.hasAttribute('required');
  hidden = this.hasAttribute('hidden');
  disabled = this.hasAttribute('disabled');
  reactive = this.hasAttribute('reactive');
  type = this.getAttribute('type');
  placeholder = this.getAttribute('placeholder');

  /**
   * Returns the 'required' HTML attribute string when the field is required and not disabled or hidden.
   * @returns {string} 'required' or empty string
   */
  isRequired() {
    return this.required && !(this.disabled || this.hidden) ? 'required' : '';
  }

  /**
   * Called when the model state changes. Refreshes if reactive is enabled.
   */
  onUpdateState() {
    if (this.reactive) {
      this.refresh();
    }
  }
}
