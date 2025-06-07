import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';

export class SimplDate extends FormElement {
  template(state) {
    return `
<div ${this.hidden ? 'style="display:none"' : ''}>
<label for="${this.name || this.id}" class="form-label col-12">${LanguageService.i18n(this.label)}${this.required ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>
<input type="date" (change)="change" ${super.isRequired()} name="${this.name || this.id}" ${this.disabled ? 'disabled' : ''} class="form-control" value="${state[this.name || this.id] || ''}" aria-label="${this.label || ''}">
</div>        
`;
  }

  change(value) {
    this.setField(this.name || this.id, value.target.value);
  }

}
customElements.define('simpl-date', SimplDate);
