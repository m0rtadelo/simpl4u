import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';

export class SimplComboboxList extends FormElement {
  filterText = '';
  items = [];

  set selection(value) {
    this.filterText = value;
    this.refresh();
  }

  template(state) {
    return `
      <ul class="list-group">
        ${this.items.map(item => item.id.toLowerCase().includes(this.filterText) || item.text.toLowerCase().includes(this.filterText) ? `
          <li class="list-group-item" id="${item.id}" @click="${() => this.selectItem(item)}">
            ${LanguageService.i18n(item.text)}
          </li>
        ` : '').join('')}
      </ul>
    `;
  }
}
customElements.define('simpl-combobox-list', SimplComboboxList);