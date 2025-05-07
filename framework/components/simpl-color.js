import { FormElement } from '../core/form-element.js';
import { SimplModel } from '../models/simpl-model.js';
import { LanguageService } from '../services/language-service.js';

export class SimplColor extends FormElement {
  template(state) {
    return `
    <div class="mb-3" ${this.hidden ? 'style="display:none"' : ''}>
    ${this.label ? `
      <label for="${this.name || this.id}" class="form-label col-12">${LanguageService.i18n(this.label)}${super.isRequired() ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>`: ''}
      <input id="${this.name || this.id}" (input)="change" ${super.isRequired()} ${this.disabled ? 'disabled' : ''} class="form-control col-12 form-control-color" type="color" value="${state[this.name || this.id] || '#000000'}"></input>
    </div>
    `;
  }

  change(value) {
    SimplModel.set(value.target.value, this.name || this.id, this.context);
  }

  focus() {
    document.querySelector('input#' + this.name).focus();
  }
}
customElements.define('simpl-color', SimplColor);
