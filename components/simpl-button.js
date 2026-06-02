import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';

/**
 * SimplButton renders a Bootstrap button with i18n support.
 */
export class SimplButton extends FormElement  {
  text = this.innerText;
  type = this.getAttribute('type') || 'primary';
  /**
   * Generates the HTML template for the button.
   * @returns {string} The HTML template string
   */
  template() {
    return `<button class="btn btn-${this.type}">${LanguageService.i18n(this.text || this.getAttribute('title')) || 'Click'}</button>`;
  }
}
customElements.define('simpl-button', SimplButton);
