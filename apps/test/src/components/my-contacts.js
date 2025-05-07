import { StaticElement } from '../../../../framework/core/static-element.js';
import { LanguageService } from '../../../../framework/services/language-service.js';

export class MyContacts extends StaticElement {

  constructor() {
    super();
    this.context = 'contacts';
  }

  template() {
    return `
    <div class="input-group mt-4">
      <input type="text" id="search" (input)="setFilter" name="filter" autofocus="true" class="form-control" value="${this.model['filter'] || ''}" placeholder="${LanguageService.i18n('filter-text')}" aria-label="${LanguageService.i18n('filter-text')}" aria-describedby="button-clear">
      <button class="btn btn-outline-secondary" type="button" (click)="clearFilter">${LanguageService.i18n('clear')}</button>
    </div>
    <simpl-crud id="contacts" context="${this.context}"></simpl-crud>
    `;
  }

  onReady() {
    setTimeout(() => {this.get('search').focus();}, 300);
    this.get('contacts').setHeaders(['name', 'phone', 'email', 'twitter', 'instagram']);
    this.get('contacts').setForm([
      { name: 'id', disabled: true, hidden: true, unique: true, index: true },
      { name: 'name', required: true, class: 'col-12', unique: true },
      { name: 'address' },
      { name: 'phone', unique: true, class: 'col-6' },
      { name: 'phone2', unique: true, class: 'col-6' },
      { name: 'birthday', class: 'col-6', type: 'date' },
      { name: 'email', unique: true, class: 'col-6' },
      { name: 'twitter', unique: true, class: 'col-6'},
      { name: 'instagram', unique: true, class: 'col-6'}
    ]);
  }

  setFilter(event) {
    this.setField('filter', event.target.value);
  }

  clearFilter() {
    this.setField('filter', '');
    this.get('search').value = '';
    setTimeout(() => {this.get('search').focus();}, 300);
  }
}
customElements.define('my-contacts', MyContacts);
