import { FormElement } from '../core/form-element.js';
import { SimplModel } from '../models/simpl-model.js';
import { LanguageService } from '../services/language-service.js';

export class SimplFile extends FormElement {
  multiple = this.hasAttribute('multiple');

  template(state) {
    return `
    <div class="mb-3" ${this.hidden ? 'style="display:none"' : ''}>
      ${ this.label ? `<label for="${this.name || this.id}" class="form-label col-12">${LanguageService.i18n(this.label)}${super.isRequired() ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>` : ''}
      <input (input)="change" id="${this.name || this.id}" ${super.isRequired()} ${this.disabled ? 'disabled' : ''} class="form-control col-12" type="file" value="${state[this.name || this.id] || ''}"></input>
    </div>
    `;
  }

    change(value) {
      SimplModel.set(value.target.value, this.name || this.id, this.context);
    }
  
    focus() {
      document.querySelector('input#' + this.name || this.id).focus();
    } 
}
customElements.define('simpl-file', SimplFile);
