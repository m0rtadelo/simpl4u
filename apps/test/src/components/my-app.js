import { StaticElement } from '../../../../simpl4u/core/static-element.js';
import { Config } from '../../../../simpl4u/services/config-service.js';
import { LanguageService } from '../../../../simpl4u/services/language-service.js';
import { RouterService } from '../../../../simpl4u/services/router-service.js';
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
    LanguageService.set({ ca, en, es });
    RouterService.view = 'crud';
    Config.storage.key = 'simpl4u';
    document.title = 'MyApp';

  }

  template() {
    const v = RouterService.view;
    return `
    <my-navbar></my-navbar>
    <div class="container-fluid">
      <div class="row">
        ${ v === 'form1' ? '<my-form context="form1"></my-form>' : '' }
        ${ v === 'form2' ? '<my-form context="form2"></my-form>' : '' }
        ${ v === 'services' ? '<my-services></my-services>' : '' }
        ${ v === 'crud' ? '<my-contacts></my-contacts>' : '' }
        ${ v === 'todo' ? '<my-todo></my-todo>' : '' }
      </div>
    </div>
    <simpl-spinner></simpl-spinner>
        `;
  }
}
customElements.define('my-app', MyApp);
