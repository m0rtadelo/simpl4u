import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';

export class SimplSwitsh extends FormElement {
  //reactive = true;
  template(state) {
    return `
<div class="form-check form-switch" ${this.hidden ? 'style="display:none"' : ''}>
  <input class="form-check-input" ${super.isRequired()} type="checkbox" ${this.disabled ? 'disabled' : ''} role="switch" ${state[this.name || this.id] ? 'checked' : ''} (change)="change" name="${this.name || this.id}" id="${this.name || this.id}">
  <label class="form-check-label" (click)="click" for="${this.name || this.id}">${LanguageService.i18n(this.label)}${super.isRequired() ? ' <span style="color: var(--bs-form-invalid-color)">*</span>' : ''}</label>
</div>        
        `;
  }

  change(value) {
    this.setField(this.name || this.id, value.target.checked);
  }

  click() {
    this.setField(this.name || this.id, !this.model[this.name || this.id]);
    this.refresh();
  }
}
customElements.define('simpl-switch', SimplSwitsh);
