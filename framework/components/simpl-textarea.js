import { FormElement } from '../core/form-element.js';
import { SimplModel } from '../models/simpl-model.js';
import { LanguageService } from '../services/language-service.js';

export class SimplTextarea extends FormElement {
  rows = this.getAttribute('rows') || 3;
  template(state) {
    return `
    <div class="mb-3" ${this.hidden ? 'style="display:none"' : ''}>
      <label for="${this.name || this.id}" class="form-label col-12">${LanguageService.i18n(this.label)}${super.isRequired() ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>
      <textarea autofocus="true" (input)="change" ${super.isRequired()} ${this.disabled ? 'disabled' : ''} class="form-control col-12" type="text" rows="${this.rows}">${state[this.name || this.id] || ''}</textarea>
    </div>
    `;
  }

  change(value) {
    SimplModel.set(value.target.value, this.name || this.id, this.context);
  }

  focus() {
    document.querySelector('textarea#' + this.name || this.id).focus();
  }
}
customElements.define('simpl-textarea', SimplTextarea);
