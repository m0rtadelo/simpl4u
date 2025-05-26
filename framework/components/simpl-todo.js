import { ReactiveElement } from '../core/reactive-element.js';
import { ModalService } from '../services/modal-service.js';
import { TextService } from '../services/text-service.js';
import { SimplModel } from '../models/simpl-model.js';
import { Config } from '../services/config-service.js';

export class SimplTodo extends ReactiveElement {
  form = this.getAttribute('form');

  constructor() {
    super();
    this.loadData().then((model) => {
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
      .version {
        position: absolute;
        bottom: 5px;
        right: 45px;
        font-size: x-small;
      }
      .target {
        position: absolute;
        bottom: 5px;
        right: 5px;
        font-size: x-small;
      }
      .item {
        padding: 0px 8px 8px 0px;
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
  }

  template(state) {
    return `
    <div class="row" ctx="${this.context}">
      ${this.renderPanels(state)}
      <div class="col-1">
        <div class="row">
          <div class="col dotted text-center">
            <h1 class="bi bi-plus-square mt-2 pointer" (click)="onAddPanel"></h1>
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

  onAddPanel() {
    ModalService.prompt('add-panel').then((result) => {
      this.addPanel(this.model, result);
    });
  }

  onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const destiny = event.target.closest('.col');
    if (id.startsWith('_panel_')) {
      this.model = this.movePanel(id, destiny, this.model);
    } else if (destiny.id) {
      this.model = this.moveCard(id, destiny, this.model);
    }
  }

  async onDropDelete(event) {
    event.preventDefault();
    let id = event.dataTransfer.getData('text/plain');
    await this.deleteItem(id, this.model);
  }

  onDragOver(event) {
    event.preventDefault();
  }

  drag(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
  }

  async onAddToDo(event) {
    const destiny = event.target.closest('.col');
    const key = destiny.getAttribute('name');
    await this.addToDo(key, this.model);
  }

  async editToDo(event) {
    const id = event.target.closest('.card').id;
    await this.editTodo(id, this.model);
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
            <h5 class="bi clickable bi-plus-square mt-2 panel-icon" (click)="onAddToDo"></h5>
          </div>
        </div>
        ${this.renderItems(state, key)}
      </div>    
      `;
    });
    return result;
  }

  setPanelName(event) {
    const name = event.target.closest('.col').getAttribute('name');
    ModalService.prompt('set-panel-name', undefined, name).then((result) => {
      if (result && result !== name) {
        const entries = Object.entries(this.model);
        const indexOri = entries.findIndex((item) => item[0] === name);
        this.model[result] = this.model[name];
        delete this.model[name];
        this.model = this.reorderMap(this.model, Object.keys(this.model).length - 1, indexOri);
        this.renameIds();
        this.saveData();
      }
    });
  }

  onRenderItems(fn) {
    this.renderItemsFn = fn;
  }

  renderItems(state, type) {
    state[type].forEach((item, index) => {
      item = item || {};
      item.id = `${type}_${index}`;
    });
    this.model[type] = state[type];
    return this.renderItemsFn?.(JSON.parse(JSON.stringify(state)), type);
    // let result = '';
    // state[type]?.sort((a, b) => {
    //   if (a?.date && b?.date) {
    //     return new Date(a.date) - new Date(b.date);
    //   } else if (a?.date) {
    //     return -1;
    //   } else if (b?.date) {
    //     return 1;
    //   }
    //   return 0;
    // })
    //   .forEach((item, index) => {
    //     item = item || {};
    //     item.id = item?.id || `${type}_${index}`;
    //     result += `<${this.item}></${this.item}>`;
    //   });
    // return result;
  }

  resetModel(model = this.model) {
    model = {
      ToDo: [],
      Doing: [],
      Done: [],
    };
  }

  addPanel(model, name) {
    if (name) {
      model[name] = [];
      this.saveData(model);
    }
  }

  async saveData(model = this.model) {
    this.renameIds(model);
    await Config.storage.saveApp(this.context, model || this.model);
  }

  renameIds(model = this.model) {
    Object.keys(model).forEach((key) => {
      model[key].forEach((item, index) => {
        item.id = `${key}_${index}`;
      });
    });
  }

  async loadData() {
    return await Config.storage.loadApp(this.context) || {};
  }

  movePanel(id, destiny, model = this.model) {
    const ori = id.substring(7);
    const des = destiny.getAttribute('name');
    const entries = Object.entries(model);
    const indexOri = entries.findIndex((item) => item[0] === ori);
    const indexDes = entries.findIndex((item) => item[0] === des);
    model = this.reorderMap(model, indexOri, indexDes);
    this.saveData(model);
    return model;
  }

  moveCard(id, destiny, model = this.model) {
    destiny.appendChild(document.getElementById(id));
    const dest = destiny.id.substring(7);
    const collection = id.split('_')[0];
    const item = model[collection].find((item) => item.id === id);
    model[collection] = model[collection].filter((item) => item.id !== id);
    model[dest] = model[dest] || [];
    model[dest].push(item);
    this.saveData(model);
    return model;
  }

  reorderMap(map, indexOri, indexDes) {
    const entries = Object.entries(map);
    const [removed] = entries.splice(indexOri, 1);
    entries.splice(indexDes, 0, removed);
    const newMap = {};
    for (const [key, value] of entries) {
      newMap[key] = value;
    }

    return newMap;
  }

  async deleteItem(id, model = this.model) {
    const result = await ModalService.confirm('delete-card');
    if (result) {
      if (id.startsWith('_panel_')) {
        id = id.substring(7);
        Object.keys(model).forEach((key) => {
          if (key === id) {
            delete model[key];
          }
        });
      } else {
        id = id.split('_');
        Object.keys(model).forEach((key) => {
          if (key === id[0]) {
            model[key] = model[key].filter((item) => item.id !== id.join('_'));
          }
        });
      }
      this.saveData(model);
    }
  }

  async addToDo(key, model = this.model) {
    SimplModel.set({}, undefined, ['__modal_todo']);
    if (await ModalService.open(`<${this.form} context="__modal_todo"></${this.form}>`, 'add-todo')) {
      model[key] = model[key] || [];
      model[key].push(SimplModel.model['__modal_todo']);
      this.saveData();
    }
  }

  async editTodo(id, model = this.model) {
    (Object.keys(model) || []).forEach(async (type) => {
      const index = model[type].findIndex((item) => item.id === id);
      if (index !== -1) {
        SimplModel.model['__modal_todo'] = JSON.parse(JSON.stringify(model[type][index]));
        if (await ModalService.open(`<${this.form} context="__modal_todo"></${this.form}>`, 'edit-todo')) {
          const updated = SimplModel.model['__modal_todo'];
          model[type][index] = updated;
          this.saveData();
        }
      }
    });
  }

}
customElements.define('simpl-todo', SimplTodo);
