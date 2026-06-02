import { FormElement } from '../core/form-element.js';
import { SimplModel } from '../models/simpl-model.js';
import { LanguageService } from '../services/language-service.js';
import { TextService } from '../services/text-service.js';

/**
 * SimplTextarea renders a multi-line text input with label and validation.
 */
export class SimplTextarea extends FormElement {
  reactive = true;
  rows = this.getAttribute('rows') || 3;
  /**
   * Generates the HTML template for the textarea.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    return `
    <div class="mb-3" ${this.hidden ? 'style="display:none"' : ''}>
      <label for="${this.name || this.id}" class="form-label col-12">${LanguageService.i18n(this.label)}${super.isRequired() ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>
      <textarea autofocus="true" (input)="change" ${super.isRequired()}  class="form-control col-12" type="text" rows="${this.rows}">${TextService.htmlEscape(state[this.name || this.id] || '')}</textarea>
    </div>
    `;
  }

  /**
   * Sets the textarea value in the model on input.
   * @param {Event} value - The input event
   */
  change(value) {
    SimplModel.set(value.target.value, this.name || this.id, this.context);
  }

  /**
   * Focuses the textarea element.
   */
  focus() {
    document.querySelector('textarea#' + this.name || this.id).focus();
  }
}
customElements.define('simpl-textarea', SimplTextarea);
