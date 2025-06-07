import { SpinnerService } from '../../../../simpl4u/services/spinner-service.js';
import { ToastService } from '../../../../simpl4u/services/toast-service.js';
export class MyRemoteService {
  static remote = {
    url: 'http://aurica.dnset.com:3000/simpl4u',
    login: 'http://aurica.dnset.com:3000/login',
    auth: {
      username: '',
      password: ''
    }
  };
  static token;
  static timer;

  static async loadApp(key, login = true) {
    if (!MyRemoteService.remote.auth.username)
      return;
    try {
      SpinnerService.show();
      const response = await fetch(MyRemoteService.remote.url + '?key=' + key, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${MyRemoteService.token}`
        },
      });
      if (!response.ok) {
        console.error('Error loading data:', response.statusText);
        if (login) {
          await MyRemoteService.login();
          return await MyRemoteService.loadApp(key, false);
        }
        SpinnerService.hide();
        return false;
      }
      SpinnerService.hide();
      let result;

      try {
        result = await response.clone().json();
      } catch (error) {
        result = await response.text();
      }
      return result;
    } catch (error) {
      console.error('Error loading data:', error);
      if (login) {
        await MyRemoteService.login();
        return await MyRemoteService.loadApp(key, false);
      }
      //ToastService.error('Error loading data!');
      MyRemoteService.#showError();
      SpinnerService.hide();
      return false;
    }
  }

  static async saveApp(key, value, login = true) {
    if (!MyRemoteService.remote.auth.username)
      return;

    let isJson = false;
    if (typeof value === 'object') {
      isJson = true;
    }
    try {
      SpinnerService.show();
      const response = await fetch(MyRemoteService.remote.url + '?key=' + key, {
        method: 'POST',
        headers: {
          'Content-Type': isJson ? 'application/json' : 'text/plain',
          'Authorization': `${MyRemoteService.token}`
        },
        body: isJson ? JSON.stringify(value) : value
      });
      if (!response.ok) {
        console.error('Error saving data:', response.statusText);
        if (login) {
          await MyRemoteService.login();
          return await MyRemoteService.saveApp(key, value, false);
        }
        SpinnerService.hide();
        return false;
      }
      SpinnerService.hide();
      return response.ok;
    } catch (error) {
      console.error('Error saving data:', error);
      if (login) {
        await MyRemoteService.login();
        return await MyRemoteService.saveApp(key, value, false);
      }
      SpinnerService.hide();
      return false;
    }
  }

  static async saveModel(data, login = true) {
    if (!MyRemoteService.remote.auth.username)
      return;

    try {
      SpinnerService.show();
      const response = await fetch(MyRemoteService.remote.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${MyRemoteService.token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        console.error('Error saving data:', response.statusText);
        if (login) {
          await MyRemoteService.login();
          return await MyRemoteService.saveModel(data, false);
        }
        SpinnerService.hide();
        return false;
      }
      SpinnerService.hide();
      return response.ok;
    } catch (error) {
      console.error('Error saving data:', error);
      if (login) {
        await MyRemoteService.login();
        return await MyRemoteService.saveModel(data, false);
      }
      SpinnerService.hide();
      return false;
    }
  }

  static async loadModel(login = true) {
    try {
      SpinnerService.show();
      const response = await fetch(MyRemoteService.remote.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${MyRemoteService.token}`
        },
      });
      if (!response.ok) {
        console.error('Error loading data:', response.statusText);
        if (login) {
          await MyRemoteService.login();
          return await MyRemoteService.loadModel(false);
        }
        SpinnerService.hide();
        return false;
      }
      SpinnerService.hide();
      return await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
      if (login) {
        await MyRemoteService.login();
        return await MyRemoteService.loadModel(false);
      }
      SpinnerService.hide();
      return false;
    }
  }

  static async login(auth) {
    MyRemoteService.remote.auth = auth || MyRemoteService.remote.auth;
    SpinnerService.show();
    try {
      const response = await fetch(MyRemoteService.remote.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(MyRemoteService.remote.auth)
      });
      SpinnerService.hide();
  
      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      MyRemoteService.token = data.token;
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      SpinnerService.hide();
      return false;
    }
  }

  static #showError() {
    clearTimeout(MyRemoteService.timer);
    MyRemoteService.timer = setTimeout(() => {
      ToastService.error('Error loading data!');
    }, 100);
  }
}
