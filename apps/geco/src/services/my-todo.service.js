import { ModalService } from '../../../../framework/services/modal-service.js';
import { SimplModel } from '../../../../framework/models/simpl-model.js';
import { Config } from '../../../../framework/services/config-service.js';

export class MyTodoService {
  static context = '';

  constructor(ctx) {
    MyTodoService.context = ctx;
  }

  static resetModel(model = MyTodoService.context.model) {
    model = {
      ToDo: [],
      Doing: [],
      Done: [],
    };
  }

  static addPanel(model, name) {
    if (name) {
      model[name] = [];
      MyTodoService.saveData(model);
    }
  }

  static async saveData(model = MyTodoService.context.model) {
    MyTodoService.renameIds(model);
    await Config.storage.saveApp(MyTodoService.context.context, model || MyTodoService.context.model);
  }

  static renameIds(model = MyTodoService.context.model) {
    Object.keys(model).forEach((key) => {
      model[key].forEach((item, index) => {
        item.id = `${key}_${index}`;
      });
    });
  }

  static async loadData() {
    return await Config.storage.loadApp(MyTodoService.context.context) || {};
  }

  static movePanel(id, destiny, model = MyTodoService.context.model) {
    const ori = id.substring(7);
    const des = destiny.getAttribute('name');
    const entries = Object.entries(model);
    const indexOri = entries.findIndex((item) => item[0] === ori);
    const indexDes = entries.findIndex((item) => item[0] === des);
    model = MyTodoService.reorderMap(model, indexOri, indexDes);
    MyTodoService.saveData(model);
    return model;
  }

  static moveCard(id, destiny, model = MyTodoService.context.model) {
    destiny.appendChild(document.getElementById(id));
    const dest = destiny.id.substring(7);
    const collection = id.split('_')[0];
    const item = model[collection].find((item) => item.id === id);
    model[collection] = model[collection].filter((item) => item.id !== id);
    model[dest] = model[dest] || [];
    model[dest].push(item);
    MyTodoService.saveData(model);
    return model;
  }

  static reorderMap(map, indexOri, indexDes) {
    const entries = Object.entries(map);
    const [removed] = entries.splice(indexOri, 1);
    entries.splice(indexDes, 0, removed);
    const newMap = {};
    for (const [key, value] of entries) {
      newMap[key] = value;
    }
  
    return newMap;
  }

  static async deleteItem(id, model = MyTodoService.context.model) {
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
      MyTodoService.saveData(model);
    }
  }

  static async addToDo(key, model = MyTodoService.context.model) {
    SimplModel.set({}, undefined, ['__modal_todo']);
    if (await ModalService.open('<my-todo-form context="__modal_todo"></my-todo-form>', 'add-todo')) {
      model[key] = model[key] || [];
      model[key].push(SimplModel.model['__modal_todo']);
      MyTodoService.saveData();
    }
  }

  static async editTodo(id, model = MyTodoService.context.model) {
    (Object.keys(model) || []).forEach(async (type) => {
      const index = model[type].findIndex((item) => item.id === id);
      if (index !== -1) {
        SimplModel.model['__modal_todo'] = JSON.parse(JSON.stringify(model[type][index]));
        if (await ModalService.open('<my-todo-form context="__modal_todo"></my-todo-form>', 'edit-todo')) {
          const updated = SimplModel.model['__modal_todo'];
          model[type][index] = updated;
          MyTodoService.saveData();
        }
      }    
    });
  }

  static async setPanelName(name, model = MyTodoService.context.model) {
    ModalService.prompt('set-panel-name', undefined, name).then((result) => {
      if (result && result !== name) {
        const entries = Object.entries(model);
        const indexOri = entries.findIndex((item) => item[0] === name);
        model[result] = model[name];
        delete model[name];
        model = this.reorderMap(model, Object.keys(model).length - 1, indexOri);
        this.renameIds();
        MyTodoService.saveData();
      }
    });
  }
    
}
