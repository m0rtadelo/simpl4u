import { StorageAdapter } from '../adapters/storage-adapter.js';

export class StorageService {
  static #adapter = StorageAdapter;
  static #time = 50;
  static #key = 'simpl4u';

  static {
    setTimeout(() => {
      StorageService.#time = 0;
    }, 100);
  }

  /**
   * Method to set the key used to store the data in the storage.
   */
  static set key(key) {
    this.#key = key;
    // const timer = setInterval(() => {
    //   if (!this.#time) {
    //     clearInterval(timer);
        this.#adapter.key = key;
    //   }
    // }, this.#time);
  }

  /**
   * Method to get the key used to store the data in the storage.
   */
  static get key() {
    return this.#key;
  }

  static setAdapter(adapter) {
    this.#adapter = adapter;
    this.#time = 0;
  }

  static async saveApp(key, value) {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        clearInterval(timer);
        this.#adapter.saveApp(key, value).then((model) => {
          resolve(model);
        });
      }, this.#time);
    });
  }

  static async loadApp(data) {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        clearInterval(timer);
        this.#adapter.loadApp(data).then((model) => {
          resolve(model);
        });
      }, this.#time);
    });
  }

  static async loadUser(data) {
    return new Promise((resolve) => {
      this.#adapter.loadUser(data).then((model) => {
        resolve(model);
      });
    });
  }

  static loadSystem(data) {
    return new Promise((resolve) => {
      this.#adapter.loadSystem(data).then((model) => {
        resolve(model);
      });
    });
  }

  static loadAppModel() {
    return new Promise((resolve) => {
      this.#adapter.loadAppModel().then((model) => {
        resolve(model);
      });
    });
  }

  static saveAppModel(model) {
    return new Promise((resolve) => {
      this.#adapter.saveAppModel(model).then((model) => {
        resolve(model);
      });
    });
  }

  static saveUserModel(model) {
    return new Promise((resolve) => {
      this.#adapter.saveUserModel(model).then((model) => {
        resolve(model);
      });
    });
  }  

  static saveUser(key, value) {
    return new Promise((resolve) => {
      this.#adapter.saveUser(key, value).then((model) => {
        resolve(model);
      });
    });
  }       

  static saveSystem(key, value) {
    return new Promise((resolve) => {
      this.#adapter.saveSystem(key, value).then((model) => {
        resolve(model);
      });
    });
  }  
}

