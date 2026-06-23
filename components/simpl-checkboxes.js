import { FormElement } from '../core/form-element.js';

/**
 * SimplCheckboxes renders a group of toggle buttons as checkboxes.
 * It allows selecting multiple values from a list.
 */
export class SimplCheckboxes extends FormElement {
  checkboxes = this.getAttribute('values')?.split(',').map((value, index) => ({ value: value.trim(), id: `checkbox_${index}` })) || [];

  /**
   * Generates the HTML template delegating to generateCheckboxes.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    return this.generateCheckboxes(state);
  }

  /**
   * Renders the checkbox toggle button group.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  generateCheckboxes(state) {
    let checkboxHtml = '';
    const values = state[this.name || this.id] || [];
    this.checkboxes.forEach((checkbox) => {
      const isChecked = values.includes(checkbox.value);
      checkboxHtml += `
        <input type="checkbox" class="btn-check" id="${checkbox.id}" name="${checkbox.value}" autocomplete="off" ${isChecked ? 'checked' : ''} (change)="toggleCheckbox">
        <label class="btn btn-outline-primary" for="${checkbox.id}">${checkbox.value}</label>
      `;
    });
    return `
<div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
  ${checkboxHtml}
</div>
    `;
  }

  /**
   * Toggles a checkbox value in the model array.
   * @param {Event} event - The change event from the checkbox input
   */
  toggleCheckbox(event) {
    const value = event?.target?.name;
    const checked = event?.target?.checked;
    const field = this.name || this.id;
    if (value && field) {
      const values = this.getField(field) || [];
      this.setField(field, checked ? [...values, value] : values.filter((v) => v !== value));
    }
  }
}
customElements.define('simpl-checkboxes', SimplCheckboxes);
