/**
 * SimplModel is an application-wide reactive state container.
 * It stores data by context and notifies subscribers whenever the model changes.
 */
export class SimplModel {
  static #proxyCache = new WeakMap();
  static #proxies = new WeakSet();
  static #rawCache = new WeakMap();
  static #model = SimplModel.#createReactiveModel({});
  static #subscribers = new Set();
  static #lastNotifiedModel = '';
  static notifyTimeout;

  /**
   * Replace the whole reactive model.
   * @param {object} value new model object
   */
  static set model(value) {
    this.#model = this.#createReactiveModel(value);
  }

  /**
   * Get the current reactive model.
   * @returns {object} reactive model proxy
   */
  static get model() {
    return this.#model;
  }

  /**
   * Get a value from the model.
   * @param {string} [id] property key to retrieve
   * @param {string} [context='global'] model context namespace
   * @returns {any} stored value or context object
   */
  static get(id, context = 'global') {
    this.#initContext(context);
    if (id && !SimplModel.model[context][id]) {
      SimplModel.model[context][id] = '';
    }
    const value = id ? SimplModel.model[context][id] : SimplModel.model[context];
    return value;
  }

  /**
   * Set a value in the model.
   * @param {any} value value to store
   * @param {string} [id] property key to set
   * @param {string} [context='global'] model context namespace
   */
  static set(value, id, context = 'global') {
    this.#initContext(context);
    if (id) {
      SimplModel.model[context][id] = value;
    } else {
      SimplModel.model[context] = value;
    }
  }

  /**
   * Subscribe to model updates.
   * @param {function(object): void} callback called with the current model
   * @returns {function(): void} unsubscribe function
   */
  static subscribe(callback) {
    SimplModel.#subscribers.add(callback);
    callback(SimplModel.#model);
    return () => SimplModel.#subscribers.delete(callback);
  }

  static #notify(property) {
    clearTimeout(SimplModel.notifyTimeout);
    SimplModel.notifyTimeout = setTimeout(() => {
      const actualModel = JSON.stringify(SimplModel.#model);
      if (actualModel === SimplModel.#lastNotifiedModel) return;
      SimplModel.#lastNotifiedModel = actualModel;
      for (const callback of SimplModel.#subscribers) {
        callback(SimplModel.#model, property);
      }
    }, 50);
  }

  /**
   * Initializes the model context if it does not exist.
   * @param {string} context - The model context namespace.
   */
  static #initContext(context) {
    if (context && !SimplModel.#model[context]) {
      SimplModel.#model[context] = {};
    }
  }

  /**
   * Creates a reactive model using a Proxy object.
   * @param {object} obj - The initial model object.
   * @returns {Proxy<object>} - A reactive model proxy.
   */
  static #createReactiveModel(obj) {
    if (this.#proxies.has(obj)) {
      return obj;
    }
    if (this.#proxyCache.has(obj)) {
      return this.#proxyCache.get(obj);
    }

    const handler = {
      set: (target, property, value) => {
        target[property] = SimplModel.#rawCache.get(value) ?? value;
        SimplModel.#notify(property);
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

    const proxy = new Proxy(obj, handler);
    this.#proxyCache.set(obj, proxy);
    this.#proxies.add(proxy);
    this.#rawCache.set(proxy, obj);
    return proxy;
  }
}

