import { FormElement } from '../core/form-element.js';

export class SimpleProgress extends FormElement {
  reactive = true;
  template(state) {
    return `
      <div class="progress" ${this.hidden ? 'style="display:none"' : ''}>
        <div class="progress-bar" role="progressbar" style="width: ${state[this.name || this.id] || 0}%" aria-valuenow="${state[this.name || this.id] || 0}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    `;
  }
}
customElements.define('simpl-progress', SimpleProgress);
