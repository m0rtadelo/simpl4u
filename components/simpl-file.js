import { FormElement } from '../core/form-element.js';
import { SimplModel } from '../models/simpl-model.js';
import { LanguageService } from '../services/language-service.js';
import { TextService } from '../services/text-service.js';

/**
 * SimplFile renders a file input with optional label and validation.
 */
export class SimplFile extends FormElement {
  multiple = this.hasAttribute('multiple');

  /**
   * Generates the HTML template for the file input.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    return `
    <div class="mb-3" ${this.hidden ? 'style="display:none"' : ''}>
      ${ this.label ? `<label for="${this.name || this.id}" class="form-label col-12">${LanguageService.i18n(this.label)}${super.isRequired() ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>` : ''}
      <input (input)="change" id="${this.name || this.id}" ${super.isRequired()} ${this.disabled ? 'disabled' : ''} class="form-control col-12" type="file" value="${TextService.htmlEscape(state[this.name || this.id] || '')}"></input>
    </div>
    `;
  }

  /**
   * Sets the file input value in the model.
   * @param {Event} value - The input event
   */
  change(value) {
    SimplModel.set(value.target.value, this.name || this.id, this.context);
  }
  
  /**
   * Focuses the file input element.
   */
  focus() {
    document.querySelector('input#' + this.name || this.id).focus();
  } 
}
customElements.define('simpl-file', SimplFile);
