export class SimplModel {
  static #model = SimplModel.#createReactiveModel({});
  static #subscribers = new Set();
  static #lastNotifiedModel = '';

  static set model(value) {
    this.#model = this.#createReactiveModel(value);
  }

  static get model() {
    return this.#model;
  }

  static get(id, context = 'global') {
    this.#initContext(context);
    if (id && !SimplModel.model[context][id]) {
      SimplModel.model[context][id] = '';
    }
    const value = id ? SimplModel.model[context][id] : SimplModel.model[context];
    return value;
  }

  static set(value, id, context = 'global') {
    this.#initContext(context);
    if (id) {
      SimplModel.model[context][id] = value;
    } else {
      SimplModel.model[context] = value;
    }
  }

  static subscribe(callback) {
    SimplModel.#subscribers.add(callback);
    callback(SimplModel.#model);
    return () => SimplModel.#subscribers.delete(callback);
  }

  static #notify() {
    const actualModel = JSON.stringify(SimplModel.#model);
    if (actualModel === SimplModel.#lastNotifiedModel) return;
    SimplModel.#lastNotifiedModel = actualModel;
    for (const callback of SimplModel.#subscribers) {
      callback(SimplModel.#model);
    }
  }

  static #initContext(context) {
    if (context && !SimplModel.#model[context])
      SimplModel.#model[context] = {};
  }

  static #createReactiveModel(obj) {
    const handler = {
      set: (target, property, value) => {
        target[property] = value;
        SimplModel.#notify();
        return true;
      },
      get: (target, property) => {
        const value = target[property];
        if (typeof value === 'object' && value !== null) {
          return SimplModel.#createReactiveModel(value);
        }
        return value;
      },
      deleteProperty: (target, property) => {
        const success = delete target[property];
        if (success) {
          SimplModel.#notify();
        }
        return success;
      }
    };

    return new Proxy(obj, handler);
  }
}
