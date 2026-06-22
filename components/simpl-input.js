import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';
import { TextService } from '../services/text-service.js';

/**
 * SimplInput renders a text input with label, validation, and i18n support.
 */
export class SimplInput extends FormElement {
  /**
   * Generates the HTML template for the text input.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    this.isReactive = this.disabled;
    return `
    <div class="mb-3" ${this.hidden ? 'style="display:none"' : ''}>
      <label for="${this.getName()}" class="form-label col-12">${LanguageService.i18n(this.label)}${super.isRequired() ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>
      <input autofocus="true" (input)="change" placeholder="${TextService.htmlEscape(this.placeholder || '')}" id="${this.getName()}" ${super.isRequired()} ${this.disabled ? 'disabled' : ''} class="form-control col-12" type="${this.type || 'text'}" value="${TextService.htmlEscape(state?.[this.getName()] || '')}"></input>
    </div>
    `;
  }

  /**
   * Sets the input value in the model.
   * @param {Event} value - The input event
   */
  change(value) {
    this.setField(this.getName(), value.target.value);
  }

  /**
   * Focuses the input element.
   */
  focus() {
    const element = this.get(this.getName());
    element?.focus();
  }
}
customElements.define('simpl-input', SimplInput);
