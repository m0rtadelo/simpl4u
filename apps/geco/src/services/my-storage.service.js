import { StorageService } from '../../../../simpl4u/services/storage-service.js';
import { MyRemoteService } from './my-remote.service.js';

export class MyStorageService {
  static type = 'remote';

  static get key() {
    return StorageService.key;
  }
  
  static set key(value) {
    StorageService.key = value;
  }

  static async saveAppModel(data) {
    const map = {
      application: async () => await StorageService.saveAppModel(data),
      remote: async () => await MyRemoteService.saveModel(data),
    };
    return await map?.[MyStorageService.type]();
  }

  static async loadAppModel() {
    const map = {
      application: async () => await StorageService.loadAppModel(),
      remote: async () => await MyRemoteService.loadModel(),
    };
    return await map?.[MyStorageService.type]();
  }

  static async loadApp(key) {
    const map = {
      application: async () => await StorageService.loadApp(key),
      remote: async () => await MyRemoteService.loadApp(key),
    };
    return await map?.[MyStorageService.type]();
  }

  static async loadUser(key) {
    return await StorageService.loadUser(key);
  }

  static async loadSystem(key) {
    return await StorageService.loadSystem(key);
  }

  static async saveApp(key, value) {
    const map = {
      application: async () => await StorageService.saveApp(key, value),
      remote: async () => await MyRemoteService.saveApp(key, value),
    };
    return await map?.[MyStorageService.type]();
  }

  static async saveUserModel(model) {
    return await StorageService.saveUserModel(model);
  }

  static async saveUser(key, value) {
    return await StorageService.saveUser(key, value);
  }

  static async saveSystem(key, value) {
    return await StorageService.saveSystem(key, value);
  }
}
