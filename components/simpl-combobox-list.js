import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';

export class SimplComboboxList extends FormElement {
  #subscribers = new Set();
  filterText = '';
  open = false;
  items = [];

  set selection(value) {
    this.filterText = value;
    this.refresh();
  }

  template(state) {
    return !this.open ? '' : `
      <ul class="list-group">
        ${this.items.map(item => item.id.toLowerCase().includes(this.filterText.toLowerCase()) || item.text.toLowerCase().includes(this.filterText.toLowerCase()) ? `
          <li class="list-group-item" id="${item.id}" (click)="selectItem">
            ${LanguageService.i18n(item.text)}
          </li>
        ` : '').join('')}
      </ul>
    `;
  }

  validate() {
    const selected = [];
    this.items.forEach((item) => {
      if (item.id.toLowerCase().includes(this.filterText.toLocaleLowerCase()) || item.text.toLocaleLowerCase().includes(this.filterText.toLowerCase())) {
        selected.push(item);       
      }
    });
    if (selected.length === 1) {
      this.#notify('select', selected[0]);
    }
  }

  subscribe(callback) {
    this.#subscribers.add(callback);
    return () => this.#subscribers.delete(callback);
  }
  
  selectItem(item) {
    //this.setField(this.name || this.id, item.srcElement.id);
    this.#notify('select', {
      id: item.srcElement.id,
      text: item.srcElement.innerText,
    });
    //console.log(item.srcElement);
    //console.log(`${item.srcElement.id}-${item.srcElement.innerText}`);
  }

    #notify(action, data) {
    for (const callback of this.#subscribers) {
      callback(action, data);
    }
  }
}
customElements.define('simpl-combobox-list', SimplComboboxList);