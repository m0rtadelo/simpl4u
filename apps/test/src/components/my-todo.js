import { StaticElement } from '../../../../simpl4u/core/static-element.js';
import { LanguageService } from '../../../../simpl4u/services/language-service.js';
import { TextService } from '../../../../simpl4u/services/text-service.js';

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
    <simpl-todo context="${this.context}" id="simpl-todo" form="my-todo-form"></simpl-todo>
    `;
  }

  onReady() {
    setTimeout(() => {
      this.get('search')?.focus();
    }, 300);
    this.get('simpl-todo')?.onRenderItems(this.renderItems.bind(this));
  }

  renderItems(state, type) {
    let result = '';
    state[type]?.sort((a, b) => {
      if (a?.date && b?.date) {
        return new Date(a.date) - new Date(b.date);
      } else if (a?.date) {
        return -1;
      } else if (b?.date) {
        return 1;
      }
      return 0;
    })
      .forEach((item, index) => {
        item = item || {};
        item.id = item?.id || `${type}_${index}`;
        result += `
    <div class="card mb-2" draggable="true" ${item['custom-color'] ? `style="background-color: ${item.color}"` : ''} id="${item.id}" (dragstart)="drag">
    ${this.renderDate(item)}
      <div class="card-body">
        <div id="${item.id}_title" class="text-break fw-semibold pointer" (click)="editToDo">${item.title}</div>
        <small class="text-break fw-light">${item.description || ''}</small>
      </div>
    </div>
      `;
      });
    return result;
  }

  renderDate(item) {
    const todayString = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate()}`;
    const today = new Date(todayString);
    const itemDate = new Date(item.date);
    if (item.date) {
      if (itemDate < today) {
        return `<small class="fw-light badge text-bg-danger date">${TextService.localDate(item.date)}</small>`;
      }
      if (itemDate.getTime() === today.getTime()) {
        return `<small class="fw-light badge text-bg-warning date">${TextService.localDate(item.date)}</small>`;
      }
      return `<small class="fw-light date">${TextService.localDate(item.date)}</small>`;
    }
    return '';
  }

  filter(event) {
    this.search = event.target.value;
  }

  clear() {
    this.search = '';
    setTimeout(() => { this.get('search')?.focus(); }, 300);
    this.refresh();
  }
}
customElements.define('my-todo', MyTodo);
