import { StaticElement } from '../../../../framework/core/static-element.js';
import { LanguageService } from '../../../../framework/services/language-service.js';

export class MyTodo extends StaticElement {

  constructor() {
    super();
    this.search = '';
    this.context = 'todo';
  }

  template(state) {
    return `
    <div class="row">
      <div class="col-12">
        <div class="input-group mt-4">
          <input type="text" id="search" (input)="filter" name="filter" autofocus="true" class="form-control" value="${this.search || ''}" placeholder="${LanguageService.i18n('filter-text')}" aria-label="${LanguageService.i18n('filter-text')}" aria-describedby="button-clear">
          <button class="btn btn-outline-secondary" (click)="clear" type="button" id="button-clear">${LanguageService.i18n('clear')}</button>
        </div>
      </div>
    </div>
    <my-todo-panels context="${this.context}"></my-todo-panels>`;
  }

  onReady() {
    setTimeout(() => {
      this.get('search')?.focus();
    }, 300);
  }

  filter(event) {
    this.search = event.target.value;
  }

  clear() {
    this.search = '';
    setTimeout(() => {this.get('search')?.focus();}, 300);
    this.refresh();
  }
}
customElements.define('my-todo', MyTodo);
