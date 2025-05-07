import { ReactiveElement } from '../core/reactive-element.js';
import { LanguageService } from '../services/language-service.js';
import { TextService } from '../services/text-service.js';

/**
 * SimplTable is a custom web component that renders a dynamic table with support for actions like create, update, delete, and detail.
 * It also supports sorting, filtering, and subscribing to events.
 */
export class SimplTable extends ReactiveElement {
  headers = [];
  actions = this.getAttribute('actions') || '';
  #subscribers = new Set();
  counter = 0;
  filteredOrderedItems = [];

  constructor() {
    super();
    if (!this.model[this.name]) {
      this.setField(this.name, []);
    }
  }

  /**
   * Generates the HTML template for the table.
   * 
   * @param {object} state - The current state of the component.
   * @returns {string} The HTML template string.
   */
  template(state) {
    return `
    <div class="card mt-4">
<table class="table table-striped table-hover">
  <thead>
    <tr>
      ${this.renderHeaders()}
      ${this.actions ? this.addHeaderButtons() : ''}
    </tr>
  </thead>
  <tbody>
    ${this.renderTable()}
  </tbody>
</table>
<!--<div class="text-center"><small>Items: ${this.counter} / ${this.model[this.name]?.length}</small></div>-->
</div>
        `;
  }

  /**
   * Subscribes to table events (e.g., create, update, delete, detail).
   * 
   * @param {Function} callback - The callback function to execute when an event occurs.
   * @returns {Function} A function to unsubscribe the callback.
   */
  subscribe(callback) {
    this.#subscribers.add(callback);
    return () => this.#subscribers.delete(callback);
  }

  /**
   * Notifies all subscribers of an action.
   * 
   * @private
   * @param {string} action - The action performed (e.g., 'create', 'update', 'delete', 'detail').
   * @param {object} data - The data associated with the action.
   */
  #notify(action, data) {
    for (const callback of this.#subscribers) {
      callback(action, data);
    }
  }

  /**
   * Called when the component is ready. Sets up event listeners for actions and headers.
   */
  onReady() {
    // this.setEventListener('create', 'click', () => this.create());
    (this.filteredOrderedItems || []).forEach((item, index) => {
      this.setEventListener('edit_' + index, 'click', () => this.edit(item));
      this.setEventListener('detail_' + index, 'click', () => this.detail(item));
      this.setEventListener('delete_' + index, 'click', () => this.delete(item));
    });
    (this.getHeaders() || []).forEach((header) => {
      this.setEventListener(header, 'click', () => {
        this.model['order_direction'] = this.model['order_direction'] === 'asc' ? 'desc' : 'asc';
        this.setField('order', header);
      });
    });
  }

  /**
   * Triggers the 'export' action.
   */
  export() {
    this.#notify('export', this.filteredOrderedItems);
    toExcel.exportXLS(
      this.getHeaders().map((header) => ({field: header, label: header })),
      this.filteredOrderedItems,
      this.name,
    );
  }

  /**
    * Triggers the 'create' action.
   */
  create() {
    this.#notify('create');
  }

  /**
   * Triggers the 'update' action for a specific item.
   * 
   * @param {object} item - The item to update.
   */
  edit(item) {
    this.#notify('update', item);
  }

  /**
   * Triggers the 'detail' action for a specific item.
   * 
   * @param {object} item - The item to view details for.
   */
  detail(item) {
    this.#notify('detail', item);
  }

  /**
   * Triggers the 'delete' action for a specific item.
   * 
   * @param {object} item - The item to delete.
   */
  delete(item) {
    this.#notify('delete', item);
  }

  /**
   * Adds action buttons to the table header.
   * 
   * @returns {string} The HTML string for the action buttons.
   */
  addHeaderButtons() {
    let result = this.actions ? '<th class="text-end" style="width: 100px">' : '';
    result += this.actions.includes('e') ? `<a href="#" (click)="export"><span class="bi bi-floppy me-2" title="${LanguageService.i18n('export')}"></span></a>` : '';
    result += this.actions.includes('c') ? `<a href="#" (click)="create"><span class="bi bi-plus-square me-2" title="${LanguageService.i18n('create')}"></span></a>` : '';
    result += this.actions ? '</th>' : '';
    return result;
  }

  /**
   * Sets the headers of the table.
   * 
   * @param {string[]} headers - An array of header names.
   */
  setHeaders(headers) {
    this.headers = headers;
    this.refresh();
  }

  /**
   * Retrieves the headers of the table.
   * 
   * @returns {string[]} An array of header names.
   */
  getHeaders() {
    let headers = [];
    if (this.model[this.name]?.length) {
      const item = this.model[this.name][0];
      headers = Object.keys(item);
    }
    return this.headers?.length ? this.headers : headers;
  }

  /**
   * Renders the table headers.
   * 
   * @returns {string} The HTML string for the table headers.
   */
  renderHeaders() {
    const headers = this.getHeaders();
    return headers.map((header) => `<th id="${header}" style="cursor: pointer">
    ${this.model['order'] === header && this.model['order_direction'] == 'asc' ? '<span class="bi bi-arrow-up"></span>' : ''}
    ${this.model['order'] === header && this.model['order_direction'] == 'desc' ? '<span class="bi bi-arrow-down"></span>' : ''}
    ${LanguageService.i18n(header)}
    </th>`).join('\n');
  }

  /**
   * Renders the table rows.
   * 
   * @returns {string} The HTML string for the table rows.
   */
  renderTable() {
    const headers = this.getHeaders();
    let output = '';
    this.counter = 0;
    this.filteredOrderedItems = this.order(this.filteredItems(headers));
    this.filteredOrderedItems?.forEach((item, index) => {
      output += '<tr>';
      output += headers.map((header) => `<td>${TextService.sanitize(item[header])}</td>`).join('\n');
      output += this.actions ? '<td class="text-end" style="width: 100px">' : '';
      output += this.actions && this.actions.includes('r') ? `<a href="#" id="detail_${index}"><span  class="bi bi-eye me-2" title="${LanguageService.i18n('detail')}"></span></a>` : '';
      output += this.actions && this.actions.includes('u') ? `<a href="#" id="edit_${index}"><span  class="bi bi-pencil me-2" title="${LanguageService.i18n('edit')}"></span></a>` : '';
      output += this.actions && this.actions.includes('d') ? `<a href="#" id="delete_${index}"><span  class="bi bi-trash me-2" title="${LanguageService.i18n('delete')}"></span></a>` : '';
      output += this.actions ? '</td>' : '';
      output += '</tr>';
      this.counter++;
    });
    return output || `<tr><td colspan="100%" class="text-center">${LanguageService.i18n('no-data')}</td></tr>`;
  }

  /**
   * Filters the table items based on the current filter value.
   * 
   * @param {string[]} headers - The headers to filter by.
   * @returns {object[]} The filtered items.
   */
  filteredItems(headers) {
    return this.model[this.name]?.filter((item) => {
      const searchable = TextService.unaccent(headers.map((header) => `${item[header]}`).join('\t'));
      return TextService.unaccent(searchable).includes((TextService.unaccent(this.model['filter'] || '')));
    });
  }

  /**
   * Orders the table items based on the current order and direction.
   * 
   * @param {object[]} items - The items to order.
   * @returns {object[]} The ordered items.
   */
  order(items) {
    const order = this.model['order'];
    if (!order) {
      return items;
    }
    const orderDirection = this.model['order_direction'] || 'asc';
    return items.sort((a, b) => {
      if ((a[order] || '') < (b[order] || '')) {
        return orderDirection === 'asc' ? -1 : 1;
      }
      if ((a[order] || '') > (b[order] || '')) {
        return orderDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}

customElements.define('simpl-table', SimplTable);
