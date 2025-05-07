import { StorageService } from './storage-service.js';

export class Config {
  static storage = {
    saveApp: (key, value) => {
      return new Promise((resolve) => {
        const timer = setInterval(() => {
          if (!Config.storage.undefined) {
            clearInterval(timer);
            Config.storage.saveApp(key, value).then((model) => {
              resolve(model);
            });
          }
        }, 50);
      });
    },
    loadApp: (data) => {
      return new Promise((resolve) => {
        const timer = setInterval(() => {
          if (!Config.storage.undefined) {
            clearInterval(timer);
            Config.storage.loadApp(data).then((model) => {
              resolve(model);
            });
          }
        }, 50);
      });
    },
    undefined: true,
  };
}
