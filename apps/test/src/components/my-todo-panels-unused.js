import { ModalService } from '../../../../simpl4u/services/modal-service.js';
import { ReactiveElement } from '../../../../simpl4u/core/reactive-element.js';
import { TextService } from '../../../../simpl4u/services/text-service.js';
import { MyTodoService } from '../services/my-todo.service.js';

export class MyTodoPanels extends ReactiveElement {

  constructor() {
    super();
    this.service = new MyTodoService(this);
    this.search = '';
    this.context = 'todo';
    MyTodoService.loadData().then((model) => {
      this.model = model || {};
    });
    this.style = `
      .dotted {
        border: dashed 1px var(--bs-border-color);
        margin: 10px;
        border-radius: 3px;
        position: relative;
      }
      .pointer {
        cursor: pointer;
      }
      .pointer:hover {
        text-decoration: underline;  
      }
      .date {
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: x-small;
      }
      .clickable {
        cursor: pointer;
      }
      .panel-icon {
        visibility: hidden;
        transition: visibility 0s ease-in-out;
      }
      .dotted:hover .panel-icon {
        visibility: visible;
      }
    `;
    clearTimeout(this.timerRef);
    this.timerRef = setTimeout(() => {
      if (!this.model || Object.keys(this.model).length === 0) {
        ModalService.confirm('no-todo-items').then((result) => {
          if (result) {
            MyTodoService.resetModel();
          }
        });
      }
    }, 100);
  }

  template(state) {
    return `
    <div class="row">
      ${this.renderPanels(state)}
      <div class="col-1">
        <div class="row">
          <div class="col dotted text-center">
            <h1 class="bi bi-plus-square mt-2 pointer" (click)="addPanel"></h1>
          </div>
        </div>
        <div class="row">
          <div class="col dotted text-center" (drop)="onDropDelete" (dragover)="onDragOver">
            <h1 class="bi bi-trash mt-2"></h1>
          </div>
        </div>
      </div>
    </div>`;
  }

  addPanel() {
    ModalService.prompt('add-panel').then((result) => {
      MyTodoService.addPanel(this.model, result);
    });
  }

  onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const destiny =  event.target.closest('.col');
    if (id.startsWith('_panel_')) { 
      this.model = MyTodoService.movePanel(id, destiny, this.model);
    } else if (destiny.id){
      this.model = MyTodoService.moveCard(id, destiny, this.model);
    }
  }

  async onDropDelete(event) {
    event.preventDefault();
    let id = event.dataTransfer.getData('text/plain');
    await MyTodoService.deleteItem(id, this.model);
  }

  onDragOver(event) {
    event.preventDefault();
  }

  drag(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
  }

  async addToDo(event) {
    const destiny =  event.target.closest('.col');
    const key = destiny.getAttribute('name');
    await MyTodoService.addToDo(key, this.model);
  }

  async editToDo(event) {
    const id = event.target.closest('.card').id;
    await MyTodoService.editTodo(id, this.model);
  }

  renderPanels(state) {
    let result = '';
    Object.keys(state)?.forEach(key => {
      result += `
    <div class="col dotted" draggable="true" id="_panel_${key}" (drop)="onDrop" (dragover)="onDragOver" (dragstart)="drag">
      <div class="row">
        <div class="col pointer" name="${key}">
          <h3 (click)="setPanelName">${key}</h3>
        </div>
        <div class="col text-end" name="${key}">
          <h5 class="bi clickable bi-plus-square mt-2 panel-icon" (click)="addToDo"></h5>
        </div>
      </div>
      ${this.renderItems(JSON.parse(JSON.stringify(state)), key)}
    </div>    
    `;
    });
    return result;  
  }

  setPanelName(event) {
    const name = event.target.closest('.col').getAttribute('name');
    MyTodoService.setPanelName(name, this.model);
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
}
customElements.define('my-todo-panels', MyTodoPanels);
