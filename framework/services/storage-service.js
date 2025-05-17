export class StorageService {
  static #key = 'simpl4u';

  /**
   * Method to set the key used to store the data in the storage.
   */
  static set key(key) {
    this.#key = key;
  }

  /**
   * Method to get the key used to store the data in the storage.
   */
  static get key() {
    return this.#key;
  }

  /**
   * Method to retrieve the data stored in the app local storage. The data is persistent across sessions.
   * @param {string} key of the data to be loaded
   * @returns the json object stored in the app local storage
   * @description This method loads the data from the app local storage. The data is stored in a json string.
   */
  static async loadApp(key) {
    const map = this.#getAppMap();
    return Promise.resolve(map[key]);
  }

  /**
   * Method to retrieve the data stored in the user session storage. The data is not persistent across sessions.
   * @param {string} key of the data to be loaded
   * @description This method loads the data from the user session storage. The data is stored in a json string.
   * @returns the json object stored in the user session storage
   */
  static async loadUser(key) {
    const map = this.#getUserMap();
    return Promise.resolve(map[key]);
  }

  /**
   * Method to retrieve the data stored in the system storage. The data is persistent across sessions and installations.
   * @param {string} key of the data to be loaded
   * @returns the json object stored in the system storage
   * @description This method loads the data from the file system storage. The data is stored in a json string.
   */
  static async loadSystem(key) {
    return Promise.resolve(JSON.parse(await window.api.loadSystem(key)));
  }

  /**
   * Method to save the data in the app local storage. The data is persistent across sessions.
   * @param {string} key of the data to be saved
   * @param {JSON} value of the data to be saved
   * @description This method saves the data in the app local storage. The data is stored in a json string.
   */
  static async saveApp(key, value) {
    const map = this.#getAppMap();
    map[key] = value;
    localStorage.setItem(this.#key, JSON.stringify(map));
    return Promise.resolve(true);
  }

  /**
   * Method to retrieve the data stored in the app local storage. The data is persistent across sessions.
   * @returns the json string stored in the app local storage
   * @description This method loads the data from the app local storage. The data is stored in a json string.
   */
  static async loadAppModel() {
    return Promise.resolve(localStorage.getItem(this.#key));
  }
  /**
   * This method saves the data in the app local storage. The data is stored in a json string.
   * @param {string} model tobe saved
   * @description This method saves the data in the app local storage. The data is stored in a json string.
   */
  static async saveAppModel(model) {
    localStorage.setItem(this.#key, model);
    return Promise.resolve(true);
  }

  /**
   * This method saves the data in the app session storage. The data is stored in a json string.
   * @param {string} model tobe saved
   * @description This method saves the data in the app session storage. The data is stored in a json string.
   */
  static async saveUserModel(model) {
    sessionStorage.setItem(this.#key, model);
    return Promise.resolve(true);
  }
  
  /**
   * Method to save the data in the user session storage. The data is not persistent across sessions.
   * @param {string} key of the data to be saved
   * @param {JSON} value of the data to be saved
   * @description This method saves the data in the user session storage. The data is stored in a json string.
   */
  static async saveUser(key, value) {
    const map = this.#getUserMap();
    map[key] = value;
    sessionStorage.setItem(this.#key, JSON.stringify(map));
    return Promise.resolve(true);
  }

  /**
   * Method to save the data in the system storage. The data is persistent across sessions and installations.
   * @param {string} key of the data to be saved
   * @param {JSON} value of the data to be saved
   * @description This method saves the data in the file system storage. The data is stored in a json string.
   */
  static async saveSystem(key, value) {
    window.api.saveSystem(key, JSON.stringify(value));
    return Promise.resolve(true);
  }

  /**
   * Method to retrieve all the data stored in the app local storage. The data is persistent across sessions.
   * @returns {JSON} the json object stored in the app local storage
   */
  static #getAppMap() {
    let result;
    try {
      result = JSON.parse(localStorage.getItem(this.#key));
    } catch (error) {
      result = {};
    }
    return result;
  }

  /**
   * Method to retrieve all the data stored in the user session storage. The data is not persistent across sessions.
   * @returns {JSON} the json object stored in the user session storage
   */
  static #getUserMap() {
    return JSON.parse(sessionStorage.getItem(this.#key) || '{}');
  }

}
