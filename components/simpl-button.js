import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';

export class SimplButton extends FormElement  {
  text = this.innerText;
  type = this.getAttribute('type') || 'primary';
  template(state) {
    return `<button class="btn btn-${this.type}">${LanguageService.i18n(this.text || this.getAttribute('title')) || 'Click'}</button>`;
  }
}
customElements.define('simpl-button', SimplButton);
