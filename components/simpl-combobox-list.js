import { FormElement } from '../core/form-element.js';
import { LanguageService } from '../services/language-service.js';
import { TextService } from '../services/text-service.js';

/**
 * SimplComboboxList is the dropdown list component used by SimplCombobox.
 * It renders filtered items and notifies subscribers on selection.
 */
export class SimplComboboxList extends FormElement {
  #subscribers = new Set();
  filterText = '';
  open = false;
  items = [];

  /**
   * Sets the selection value and refreshes the list.
   * @param {string} value - The text to filter by
   */
  set selection(value) {
    this.filterText = value;
    this.refresh();
  }

  /**
   * Generates the HTML template for the dropdown list of filtered items.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    return !this.open ? '' : `
      <ul class="list-group">
        ${this.items.map(item => item.id.toLowerCase().includes(this.filterText.toLowerCase()) || item.text.toLowerCase().includes(this.filterText.toLowerCase()) ? `
          <li class="list-group-item" id="${TextService.htmlEscape(item.id)}" (click)="selectItem">
            ${TextService.htmlEscape(LanguageService.i18n(item.text))}
          </li>
        ` : '').join('')}
      </ul>
    `;
  }

  /**
   * Validates the current filter text against items.
   * If exactly one item matches, notifies subscribers with the selected item.
   */
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

  /**
   * Subscribes to selection events.
   * @param {Function} callback - Called when an item is selected, receives (action, data)
   * @returns {Function} A function to unsubscribe the callback
   */
  subscribe(callback) {
    this.#subscribers.add(callback);
    return () => this.#subscribers.delete(callback);
  }
  
  /**
   * Handles click on a list item, notifying subscribers with the selected item.
   * @param {Event} item - The click event
   */
  selectItem(item) {
    this.#notify('select', {
      id: item.srcElement.id,
      text: item.srcElement.innerText,
    });
  }

  /**
   * Notifies all subscribers of an action.
   * @private
   * @param {string} action - The action performed
   * @param {object} data - The data associated with the action
   */
  #notify(action, data) {
    for (const callback of this.#subscribers) {
      callback(action, data);
    }
  }
}
customElements.define('simpl-combobox-list', SimplComboboxList);
