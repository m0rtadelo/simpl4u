import { StaticElement } from '../../../../simpl4u/core/static-element.js';
import { Config } from '../../../../simpl4u/services/config-service.js';
import { LanguageService } from '../../../../simpl4u/services/language-service.js';
import { ThemeService } from '../../../../simpl4u/services/theme-service.js';
import { ToastService } from '../../../../simpl4u/services/toast-service.js';
import { MyRemoteService } from '../services/my-remote.service.js';

export class MyLogin extends StaticElement {
  template() {
    return `
        <div class="container min-vh-100 d-flex justify-content-center align-items-center">
            <div class="row w-100 justify-content-center">
                <div class="col-12 col-md-6 col-lg-5">
                    <div class="card shadow">
                        <div class="card-body">
                            <h1 class="text-center mb-4">${LanguageService.i18n('login.title')}</h1>
                            <form id="loginForm" class="needs-validation" (submit)="onSubmit" novalidate>
                                <simpl-input
                                    id="username"
                                    label="${LanguageService.i18n('login.username')}"
                                    type="text"
                                    required></simpl-input>
                                <simpl-input
                                    id="password"
                                    label="${LanguageService.i18n('login.password')}"
                                    type="password"
                                    required></simpl-input>
                                <button type="submit" class="btn btn-primary w-100 mt-3">${LanguageService.i18n('login.submit')}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  onReady() {
    setTimeout(() => {
      this.get('username')?.focus();
    }, 300);
  }

  onSubmit(event) {
    event.preventDefault();
    if(!this.get('loginForm').checkValidity())
      return;

    MyRemoteService.login({
      username: this.model['username'],
      password: this.model['password']
    }).then(response => {
      if (response) {
        ThemeService.load();
        LanguageService.load();
        Config.loaded = false;
        window.location.href = '#projects'; // Example redirect
      } else {
        this.model = {};
        this.refresh();
        ToastService.error(LanguageService.i18n('login.error'));
      }
    }).catch(error => {
      this.model = {};
      this.refresh();
      ToastService.error(LanguageService.i18n('login.error'));
    });
  }
}
customElements.define('my-login', MyLogin);
