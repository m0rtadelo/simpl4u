import { StaticElement } from '../../../../framework/core/static-element.js';
import { Config } from '../../../../framework/services/config-service.js';
import { LanguageService } from '../../../../framework/services/language-service.js';
import { RouterService } from '../../../../framework/services/router-service.js';
import { MyStorageService } from '../services/my-storage.service.js';
import { words as ca } from '../assets/i18n/ca.js';
import { words as en } from '../assets/i18n/en.js';
import { words as es } from '../assets/i18n/es.js';

export class MyApp extends StaticElement {

  static {
    Config.storage = MyStorageService;
  }

  constructor() {
    super();
    this.initApp();
  }

  initApp() {
    Config.storage = MyStorageService;
    Config.loaded = true;
    LanguageService.set({ ca, en, es });
    RouterService.view = 'login';
    Config.storage.key = 'geco';
    document.title = 'GECO+';

  }

  template() {
    const v = RouterService.view;
    return `
    ${ v !== 'login' ? '<my-navbar></my-navbar>' : '' }
    <div class="container-fluid">
      <div class="row">
        ${ v === 'projects' ? '<my-projects></my-projects>' : '' }
        ${ v === 'status' ? '<my-status></my-status>' : '' }
        ${ v === 'options' ? '<my-options></my-options>' : '' }
        ${ v === 'login' ? '<my-login></my-login>' : '' }
      </div>
    </div>
    <simpl-spinner></simpl-spinner>
        `;
  }
}
customElements.define('my-app', MyApp);
