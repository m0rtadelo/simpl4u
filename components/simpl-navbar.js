import { ReactiveElement } from '../core/reactive-element.js';
import { RouterService } from '../services/router-service.js';
import { LanguageService } from '../services/language-service.js';
import { ThemeService } from '../services/theme-service.js';

/**
 * @typedef {object} NavbarDefinition
 * @property {string} id - The unique identifier of the navbar item.
 * @property {string} name - The name of the field (translated).
 * @property {boolean} emmit - Indicates if the item should emit an event when clicked (instead of navigating).
 */
export class SimplNavBar extends ReactiveElement {
  #subscribers = new Set();
  _hideLang = false;
  _hideTheme = false;
  _items = [];
  languages = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español' },
    { id: 'ca', name: 'Català' },
    { id: 'de', name: 'Deutsch' },
    { id: 'ja', name: '日本語' }
  ];

  /** @returns {NavbarDefinition[]} */
  get items() {
    return this._items;
  }
  /**
   * Sets the navbar items for the component.
   * 
   * @param {NavbarDefinition[]} navbarItems - An array of navbar item definitions.
   */
  set items(navbarItems) {
    this._items = navbarItems;
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

  /**
   * Subscribes to table events (e.g., create, update, delete, detail).
   * 
   * @param {Function} callback - The callback function to execute when an event occurs.
   * @returns {Function} A function to unsubscribe the callback.
   */
  subscribe(callback) {
    this.#subscribers.add(callback);
    return () => this.#subscribers.delete(callback);
  }

  /**
   * Notifies all subscribers of an action.
   * 
   * @private
   * @param {string} action - The action performed (e.g., 'create', 'update', 'delete', 'detail').
   * @param {object} data - The data associated with the action.
   */
  #notify(action, data) {
    for (const callback of this.#subscribers) {
      callback(action, data);
    }
  }
  
  switchTheme() {
    ThemeService.switchTheme();
  }

  changeLang(event) {
    LanguageService.lang = event.target.id;
  }

  renderItems() {
    return this.items?.map(item => {
      return item.emmit 
        ? `<li class="nav-link ${RouterService.view === item.id ? 'active' : ''}"><a class="dropdown-item" id="${item.id}" (click)="emmit" href="#">${LanguageService.i18n(item.name)}</a></li>`
        : `<li class="nav-link ${RouterService.view === item.id ? 'active' : ''}"><a class="dropdown-item" id="${item.id}" href="#${item.id}">${LanguageService.i18n(item.name)}</a></li>`;
    }).join('');
  }

  renderLanguages() {
    return this.languages?.map(lang => {
      return `<li>
                <a id="${lang.id}" (click)="changeLang" class="dropdown-item ${LanguageService.lang === lang.id ? 'active" aria-current="page"' : '"'}"" href="#">${LanguageService.i18n(lang.name)}</a>
              </li>`;
    }).join('');
  }
  emmit(event) {
    this.#notify('click', event.target.id);
  }
}
customElements.define('simpl-navbar', SimplNavBar);
