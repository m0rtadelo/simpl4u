import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';
import { TextService } from '../services/text-service.js';

/**
 * SimplDate renders a date input with label and validation.
 */
export class SimplDate extends FormElement {
  /**
   * Generates the HTML template for the date input.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    return `
<div ${this.hidden ? 'style="display:none"' : ''}>
<label for="${this.getName()}" class="form-label col-12">${LanguageService.i18n(this.label)}${this.required ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>
<input type="date" (change)="change" ${super.isRequired()} name="${this.getName()}" ${this.disabled ? 'disabled' : ''} class="form-control" value="${TextService.htmlEscape(state[this.getName()] || '')}" aria-label="${this.label ? LanguageService.i18n(this.label) : ''}">
</div>        
`;
  }

  /**
   * Sets the date value in the model.
   * @param {Event} value - The change event
   */
  change(value) {
    this.setField(this.getName(), value.target.value);
  }

}
customElements.define('simpl-date', SimplDate);
