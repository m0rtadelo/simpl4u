import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';
import { TextService } from '../services/text-service.js';

/**
 * SimplColor renders a color picker input with optional label.
 */
export class SimplColor extends FormElement {
  /**
   * Generates the HTML template for the color picker.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    return `
    <div class="mb-3" ${this.hidden ? 'style="display:none"' : ''}>
    ${this.label ? `
      <label for="${this.getName()}" class="form-label col-12">${LanguageService.i18n(this.label)}${super.isRequired() ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>`: ''}
      <input id="${this.getName()}" (input)="change" ${super.isRequired()} ${this.disabled ? 'disabled' : ''} class="form-control col-12 form-control-color" type="color" value="${TextService.htmlEscape(state?.[this.getName()] || '#000000')}"></input>
    </div>
    `;
  }

  /**
   * Sets the color value in the model.
   * @param {Event} value - The input event
   */
  change(value) {
    this.setField(this.getName(), value.target.value);
  }

  /**
   * Focuses the color input element.
   */
  focus() {
    document.querySelector('input#' + this.name).focus();
  }
}
customElements.define('simpl-color', SimplColor);
