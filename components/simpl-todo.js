import { ReactiveElement } from '../core/reactive-element.js';
import { ModalService } from '../services/modal-service.js';
import { SimplModel } from '../models/simpl-model.js';
import { StorageService } from '../services/storage-service.js';
import { TextService } from '../services/text-service.js';

/**
 * SimplTodo is a Kanban-style todo board with drag-and-drop support.
 * It manages panels and cards that can be moved, added, edited, and deleted.
 */
export class SimplTodo extends ReactiveElement {
  form = this.getAttribute('form');
  disableAddPanel = this.hasAttribute('disableAddPanel');
  disableEditPanel = this.hasAttribute('disableEditPanel');
  disableCardMovement = this.hasAttribute('disableCardMovement');

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

  /**
   * Generates the HTML template for the todo board.
   * @param {object} state - The current model state
   * @returns {string} The HTML template string
   */
  template(state) {
    return `
    <div class="row" ctx="${this.context}">
      ${this.renderPanels(state)}
      <div class="col-1">
        <div class="row" ${this.disableAddPanel ? 'style="display:none"' : ''}>
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

  /**
   * Prompts for a new panel name and adds it.
   */
  onAddPanel() {
    ModalService.prompt('add-panel').then((result) => {
      this.addPanel(this.model, result);
    });
  }

  /**
   * Handles drop events for reordering panels and cards.
   * @param {DragEvent} event - The drop event
   */
  onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const destiny = event.target.closest('.col');
    if (!/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(id) && !/^_panel_[_a-zA-Z][_a-zA-Z0-9]*$/.test(id)) {
      return;
    }
    if (id.startsWith('_panel_')) {
      this.model = this.movePanel(id, destiny, this.model);
    } else if (destiny.id) {
      this.model = this.moveCard(id, destiny, this.model);
    }
  }

  /**
   * Handles dropping items on the delete area.
   * @param {DragEvent} event - The drop event
   */
  async onDropDelete(event) {
    event.preventDefault();
    let id = event.dataTransfer.getData('text/plain');
    if (!/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(id) && !/^_panel_[_a-zA-Z][_a-zA-Z0-9]*$/.test(id)) {
      return;
    }
    await this.deleteItem(id, this.model);
  }

  /**
   * Prevents default to allow dropping.
   * @param {DragEvent} event - The dragover event
   */
  onDragOver(event) {
    event.preventDefault();
  }

  /**
   * Sets drag data with the element id.
   * @param {DragEvent} event - The dragstart event
   */
  drag(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
  }

  /**
   * Opens a modal to add a new todo to the panel.
   * @param {Event} event - The click event
   */
  async onAddToDo(event) {
    const destiny = event.target.closest('.col');
    const key = destiny.getAttribute('name');
    await this.addToDo(key, this.model);
  }

  /**
   * Opens a modal to edit the clicked todo card.
   * @param {Event} event - The click event
   */
  async editToDo(event) {
    const id = event.target.closest('.card').id;
    await this.editTodo(id, this.model);
  }

  /**
   * Renders all panel columns for the todo board.
   * @param {object} state - The current model state
   * @returns {string} The HTML for all panel columns
   */
  renderPanels(state) {
    let result = '';
    Object.keys(state)?.forEach(key => {
      const safeKey = TextService.htmlEscape(key);
      result += `
      <div class="col dotted" draggable="${!this.disableCardMovement}" id="_panel_${safeKey}" (drop)="onDrop" (dragover)="onDragOver" (dragstart)="drag">
        <div class="row">
${this.disableEditPanel ? `
  <div class="col" name="${safeKey}">
    <h3>${safeKey}</h3>
  </div>
  ` : `
  <div class="col pointer" name="${safeKey}">
    <h3 (click)="setPanelName">${safeKey}</h3>
  </div>
  `}

          <div class="col text-end" name="${safeKey}">
            <h5 class="bi clickable bi-plus-square mt-2 panel-icon" (click)="onAddToDo"></h5>
          </div>
        </div>
        ${this.renderItems(state, key)}
      </div>    
      `;
    });
    return result;
  }

  /**
   * Prompts to rename a panel.
   * @param {Event} event - The click event on the panel name
   */
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

  /**
   * Registers the render function for items within panels.
   * @param {Function} fn - The function to call for rendering items
   */
  onRenderItems(fn) {
    this.renderItemsFn = fn;
  }

  /**
   * Renders items within a panel using the registered render function.
   * @param {object} state - The current model state
   * @param {string} type - The panel key
   * @returns {string} The rendered items HTML
   */
  renderItems(state, type) {
    state[type].forEach((item, index) => {
      item = item || {};
      item.id = `${type}_${index}`;
    });
    this.model[type] = state[type];
    return this.renderItemsFn?.(JSON.parse(JSON.stringify(state)), type) || '';
  }

  /**
   * Resets the model to the default todo structure.
   * @param {object} [model] - The model to reset (defaults to this.model)
   */
  resetModel(model = this.model) {
    model = {
      ToDo: [],
      Doing: [],
      Done: [],
    };
  }

  /**
   * Adds a new empty panel with the given name.
   * @param {object} model - The model
   * @param {string} name - The panel name
   */
  addPanel(model, name) {
    if (name) {
      model[name] = [];
      this.saveData(model);
    }
  }

  /**
   * Persists the model to storage.
   * @param {object} [model] - The model to save (defaults to this.model)
   */
  async saveData(model = this.model) {
    this.renameIds(model);
    await StorageService.saveApp(this.context, model || this.model);
  }

  /**
   * Renames item ids to match their current position.
   * @param {object} [model] - The model (defaults to this.model)
   */
  renameIds(model = this.model) {
    Object.keys(model).forEach((key) => {
      model[key].forEach((item, index) => {
        item.id = `${key}_${index}`;
      });
    });
  }

  /**
   * Loads the model from storage.
   * @returns {Promise<object>} The loaded model or empty object
   */
  async loadData() {
    return await StorageService.loadApp(this.context) || {};
  }

  /**
   * Moves a panel to a new position.
   * @param {string} id - The panel id (with _panel_ prefix)
   * @param {Element} destiny - The drop target element
   * @param {object} [model] - The model (defaults to this.model)
   * @returns {object} The updated model
   */
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

  /**
   * Moves a card from one panel to another.
   * @param {string} id - The card id
   * @param {Element} destiny - The drop target element
   * @param {object} [model] - The model (defaults to this.model)
   * @returns {object} The updated model
   */
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

  /**
   * Reorders a map by moving an entry from one index to another.
   * @param {object} map - The map to reorder
   * @param {number} indexOri - The source index
   * @param {number} indexDes - The destination index
   * @returns {object} The reordered map
   */
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

  /**
   * Deletes a panel or card after confirmation.
   * @param {string} id - The id of the item to delete
   * @param {object} [model] - The model (defaults to this.model)
   */
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

  /**
   * Opens a modal form to add a new todo card to a panel.
   * @param {string} key - The panel key
   * @param {object} [model] - The model (defaults to this.model)
   */
  async addToDo(key, model = this.model) {
    SimplModel.set({}, undefined, ['__modal_todo']);
    if (await ModalService.open(`<${this.form} context="__modal_todo"></${this.form}>`, 'add-todo')) {
      model[key] = model[key] || [];
      model[key].push(SimplModel.model['__modal_todo']);
      this.saveData();
    }
  }

  /**
   * Opens a modal form to edit an existing todo card.
   * @param {string} id - The card id
   * @param {object} [model] - The model (defaults to this.model)
   */
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
