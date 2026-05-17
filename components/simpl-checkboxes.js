import { FormElement } from '../core/form-element.js';
import { ModalService } from '../services/modal-service.js';

export class SimplCheckboxes extends FormElement {
  checkboxes = this.getAttribute('values')?.split(',').map((value, index) => ({ value: value.trim(), id: `checkbox_${index}` })) || [];

  template(state) {
    return this.generateCheckboxes(state);
  }

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

  toggleCheckbox(event) {
    const lang = event?.target?.name;
    const checked = event?.target?.checked;
    if (lang) {
      if (checked) {
        this.model.lang.push(lang);
      } else {
        this.model.lang = this.model.lang.filter(l => l !== lang);
      }
      // TODO: Move this busdsines to the panel logic not in the simpl library
      if (this.model.lang.length === 0) {
        ModalService.message('At least one language should be selected', 'Warning');
        this.model.lang.push(lang);
        this.refresh();
        return;
      }
    }
  }
}
customElements.define('simpl-checkboxes', SimplCheckboxes);
