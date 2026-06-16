import { FormElement } from '../core/form-element.js';
import { TextService } from '../services/text-service.js';

/**
 * SimpleProgress renders a Bootstrap progress bar bound to a model value.
 */
export class SimpleProgress extends FormElement {
  isReactive = true;
  /**
   * Generates the HTML template for the progress bar.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    const val = TextService.htmlEscape(state[this.name || this.id] || 0);
    return `
      <div class="progress" ${this.hidden ? 'style="display:none"' : ''}>
        <div class="progress-bar" role="progressbar" style="width: ${val}%" aria-valuenow="${val}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    `;
  }
}
customElements.define('simpl-progress', SimpleProgress);
