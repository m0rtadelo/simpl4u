import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';

/**
 * SimplSwitch renders a Bootstrap switch toggle bound to a boolean model value.
 */
export class SimplSwitch extends FormElement {
  /**
   * Generates the HTML template for the switch toggle.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    return `
<div class="form-check form-switch" ${this.hidden ? 'style="display:none"' : ''}>
  <input class="form-check-input" ${super.isRequired()} type="checkbox" ${this.disabled ? 'disabled' : ''} role="switch" ${state[this.getName()] ? 'checked' : ''} (change)="change" name="${this.getName()}" id="${this.getName()}">
  <label class="form-check-label" (click)="click" for="${this.getName()}">${LanguageService.i18n(this.label)}${super.isRequired() ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>
</div>        
        `;
  }

  /**
   * Sets the switch value from the change event.
   * @param {Event} value - The change event
   */
  change(value) {
    this.setField(this.getName(), value.target.checked);
  }

  /**
   * Toggles the switch value on label click.
   */
  click() {
    this.setField(this.getName(), !this.model[this.getName()]);
    this.refresh();
  }
}
customElements.define('simpl-switch', SimplSwitch);
