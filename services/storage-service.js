import { StorageAdapter } from '../adapters/storage-adapter.js';

/**
 * StorageService provides a high-level storage API for the application.
 * It delegates actual persistence operations to the configured StorageAdapter.
 */
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
   * @param {string} key of the storage namespace
   */
  static set key(key) {
    this.#key = key;
    this.#adapter.key = key;
  }

  /**
   * Method to get the key used to store the data in the storage.
   * @returns {string} current storage namespace key
   */
  static get key() {
    return this.#key;
  }

  /**
   * Method to set the storage adapter used by the service.
   * @param {object} adapter storage adapter implementation
   */
  static setAdapter(adapter) {
    this.#adapter = adapter;
    this.#time = 0;
  }

  /**
   * Method to save application-level data.
   * @param {string} key of the data to be saved
   * @param {any} value to save
   * @returns {Promise<any>} resolved value from the adapter
   */
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

  /**
   * Method to load application-level data.
   * @param {string} data key of the data to be loaded
   * @returns {Promise<any>} loaded data from the adapter
   */
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

  /**
   * Method to load user-specific data.
   * @param {string} data key of the data to be loaded
   * @returns {Promise<any>} loaded data from the adapter
   */
  static async loadUser(data) {
    return new Promise((resolve) => {
      this.#adapter.loadUser(data).then((model) => {
        resolve(model);
      });
    });
  }

  /**
   * Method to load system-level data.
   * @param {string} data key of the data to be loaded
   * @returns {Promise<any>} loaded data from the adapter
   */
  static loadSystem(data) {
    return new Promise((resolve) => {
      this.#adapter.loadSystem(data).then((model) => {
        resolve(model);
      });
    });
  }

  /**
   * Method to load the raw app model from storage.
   * @returns {Promise<any>} app model data from the adapter
   */
  static loadAppModel() {
    return new Promise((resolve) => {
      this.#adapter.loadAppModel().then((model) => {
        resolve(model);
      });
    });
  }

  /**
   * Method to save the raw app model to storage.
   * @param {any} model to save
   * @returns {Promise<any>} result from the adapter
   */
  static saveAppModel(model) {
    return new Promise((resolve) => {
      this.#adapter.saveAppModel(model).then((model) => {
        resolve(model);
      });
    });
  }

  /**
   * Method to save the raw user model to storage.
   * @param {any} model to save
   * @returns {Promise<any>} result from the adapter
   */
  static saveUserModel(model) {
    return new Promise((resolve) => {
      this.#adapter.saveUserModel(model).then((model) => {
        resolve(model);
      });
    });
  }  

  /**
   * Method to clear all data stored under the current key from both
   * localStorage and sessionStorage.
   * @returns {Promise<boolean>} true on success
   */
  static async clear() {
    return new Promise((resolve) => {
      this.#adapter.clear().then((result) => {
        resolve(result);
      });
    });
  }

  /**
   * Method to save user-specific data.
   * @param {string} key of the data to be saved
   * @param {any} value to save
   * @returns {Promise<any>} result from the adapter
   */
  static saveUser(key, value) {
    return new Promise((resolve) => {
      this.#adapter.saveUser(key, value).then((model) => {
        resolve(model);
      });
    });
  }       

  /**
   * Method to save system-level data.
   * @param {string} key of the data to be saved
   * @param {any} value to save
   * @returns {Promise<any>} result from the adapter
   */
  static saveSystem(key, value) {
    return new Promise((resolve) => {
      this.#adapter.saveSystem(key, value).then((model) => {
        resolve(model);
      });
    });
  }  
}

