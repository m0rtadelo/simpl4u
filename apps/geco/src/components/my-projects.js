import { StaticElement } from '../../../../framework/core/static-element.js';
import { LanguageService } from '../../../../framework/services/language-service.js';

export class MyProjects extends StaticElement {

  constructor() {
    super();
    this.context = 'projects';
  }

  template() {
    return `
    <div class="input-group mt-4">
      <input type="text" id="search" (input)="setFilter" name="filter" autofocus="true" class="form-control" value="${this.model['filter'] || ''}" placeholder="${LanguageService.i18n('filter-text')}" aria-label="${LanguageService.i18n('filter-text')}" aria-describedby="button-clear">
      <button class="btn btn-outline-secondary" type="button" (click)="clearFilter">${LanguageService.i18n('clear')}</button>
    </div>
    <simpl-crud id="prj_crud" context="${this.context}"></simpl-crud>
    `;
  }

  onReady() {
    setTimeout(() => {this.get('search').focus();}, 300);
    this.get('prj_crud')?.setHeaders(['name', 'portal', 'url', 'url_alt', 'int_url']);
    this.get('prj_crud')?.setForm([
      { name: 'id', disabled: true, hidden: true, unique: true, index: true },
      { name: 'name', required: true, class: 'col-6', unique: true },
      { name: 'portal', class: 'col-6' },
      { name: 'url', class: 'col-12' },
      { name: 'url_alt', class: 'col-12' },
      { name: 'observations', class: 'col-12', type: 'textarea', rows: 6 },
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
customElements.define('my-projects', MyProjects);
