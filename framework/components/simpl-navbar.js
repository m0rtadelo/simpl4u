import { ReactiveElement } from '../core/reactive-element.js';
import { RouterService } from '../services/router-service.js';
import { LanguageService } from '../services/language-service.js';
import { ThemeService } from '../services/theme-service.js';

export class SimplNavBar extends ReactiveElement {
  _hideLang = false;
  _hideTheme = false;
  _items = [];
  languages = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español' },
    { id: 'ca', name: 'Català' }
  ];

  get items() {
    return this._items;
  }

  set items(value) {
    this._items = value;
    this.refresh();
  }

  get hideLang() {
    return this._hideLang;
  }

  set hideLang(value) {
    this._hideLang = value;
    this.refresh();
  }

  get hideTheme() {
    return this._hideTheme;
  }

  set hideTheme(value) {
    this._hideTheme = value;
    this.refresh();
  }

  template() {
    return `
    <nav class="navbar navbar-expand-md bg-body-tertiary sticky-top">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">${this.name || 'Simple4u'}</span>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            ${this.renderItems()}
          </ul>
          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown">
              ${this.hideLang ? '' : `<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">${LanguageService.lang}</a>`}
              ${this.hideLang ? '' : `<ul class="dropdown-menu">${this.renderLanguages()}</ul>`}
            </li>

          ${this.hideTheme ? '' : '<li class="nav-item"><a class="nav-link" id="switchTheme" (click)="switchTheme" title="Switch" href="#"><span class="bi-highlights"></span></a></li>'}
          </ul>
        </div>
      </div>
    </nav>        
        `;
  }

  switchTheme() {
    ThemeService.switchTheme();
  }

  changeLang(event) {
    LanguageService.lang = event.target.id;
  }

  renderItems() {
    return this.items?.map(item => {
      return `<li class="nav-link ${RouterService.view === item.id ? 'active' : ''}"><a class="dropdown-item" id="${item.id}" href="#${item.id}">${LanguageService.i18n(item.name)}</a></li>`;
    }).join('');
  }

  renderLanguages() {
    return this.languages?.map(lang => {
      return `<li>
                <a id="${lang.id}" (click)="changeLang" class="dropdown-item ${LanguageService.lang === lang.id ? 'active" aria-current="page"' : '"'}"" href="#">${LanguageService.i18n(lang.name)}</a>
              </li>`;
    }).join('');
  }

}
customElements.define('simpl-navbar', SimplNavBar);
