import { SimplModel } from '../models/simpl-model.js';
import { LanguageService } from '../services/language-service.js';
import { RouterService } from '../services/router-service.js';
import { StorageService } from '../services/storage-service.js';
import morphdom from '../lib/morphdom.js';
/**
 * Element is the base class for all simpl4u web components.
 * It provides model binding, i18n, routing, storage, and rendering utilities.
 */
export class Element extends HTMLElement {
  static loaded = false;
  static useMorhdom = false;
  context = this.getAttribute('context') || 'global';
  name = this.getAttribute('name');
  id = this.getAttribute('id');
  label = this.getAttribute('label') || this.name || '';
  required = this.hasAttribute('required');
  hidden = this.hasAttribute('hidden');
  disabled = this.hasAttribute('disabled');
  timerRef = undefined;
  loadViewStateTimer = undefined;
  style = '';
  _items;

  constructor() {
    super();
    if (!Element.loaded) {
      Element.loaded = true;
      RouterService.subscribe(() => {
        this.refresh();
      });
      LanguageService.subscribe(() => {
        this.refresh();
      });
      if (typeof window.api !== 'undefined') {
        window.api.getLocale().then(async (result) => {
          const userLang = await StorageService.loadApp('_lang');
          if (!userLang)
            LanguageService.lang = result || 'en';
        }).catch(() => {});
      }
      Promise.resolve().then(async () => {
        const raw = await StorageService.loadAppModel();
        if (raw) {
          try {
            const data = JSON.parse(raw);
            for (const [context, value] of Object.entries(data)) {
              SimplModel.model[context] = value;
            }
          } catch (e) {
            console.error('Failed to load model from storage', e);
          }
        }
      });
    }
  }

  get items() {
    return this._items;
  }

  set items(value) {
    this._items = value;
    this.refresh();
  }

  /**
   * Method to render the template and execute the onReady and addListenersFromTemplate methods
   * It will be called when the element is created and when the state or languages changes
   */
  refresh() {
    this.render();
    this.onReady();
    this.addListenersFromTemplate();
    this.setValueWhenAllItemsAreSet();
  }

  /**
   * Method to add listeners from the template
   * It will look for all the elements with an attribute that starts with '(' and ends with ')'
   * and will add the event listener to the element
   * NOTE: the method declared in the template should be defined in the class as a public method
   */
  addListenersFromTemplate() {
    clearTimeout(this.timerRef);
    this.timerRef = setTimeout(() => {
      for (const el of this.querySelectorAll('*')) {
        const events = Object.values(el.attributes).filter((key) => key.name.startsWith('(') && key.name.endsWith(')')) || [];
        events.forEach((event) => {
          const eventName = event.name.substring(1, event.name.length - 1);
          const methodName = event.value;
          if (methodName === '__proto__' || methodName === 'constructor' || methodName === 'prototype') return;
          if (typeof this[methodName] === 'function') {
            try {
              el.removeEventListener(eventName, this[methodName]);
              el.addEventListener(eventName, this[methodName].bind(this));
            } catch (error) {
              console.error('Error adding event listener', eventName, methodName, error);
            }
          }
        });
      }
    }, 100);
  }

  /**
   * Helper to add listeners to html elements
   * @param {string} id of the html element
   * @param {string} event type ('click', 'input'...)
   * @param {Function} callback function to execute in event (avoid arrow functions)
   */
  setEventListener(id, event, callback) {
    const element = this.querySelector('#' + id);
    if (element) {
      element.removeEventListener(event, this.buttonBound);
      this.buttonBound = callback.bind(this);
      element.addEventListener(event, this.buttonBound);
    }
  }

  /**
   * Callback to update the template when state or languages changes
   * @param {object} state of the model in context
   * @returns the updated template
   */
  template(state) {
    return '';
  }

  /**
   * Callback to add listeners when the template is ready.
   * Use setEventListener to add listeners
   */
  onReady() { }

  /**
   * Callback to set default value for some fields
   */
  setValueWhenAllItemsAreSet() { }

  /**
   * Method to force the render template.
   * NOTE: Listeners will be destroyed and should be added again
   */
  render() {
    if (Element.useMorhdom) {
      const content = this.getStyle().concat(this.template(this.model));
      const toNode = `<${this.tagName.toLowerCase()}>${content}</${this.tagName.toLowerCase()}>`;
      morphdom(this, toNode, {
        // Keep each custom element responsible for rendering its own internal DOM.
        onBeforeElChildrenUpdated: (fromEl) => {
          if (fromEl === this) return true;
          return !fromEl.tagName?.includes('-');
        },
      });
    } else {
      this.innerHTML = this.getStyle().concat(this.template(this.model));
    }

    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (() => {
      'use strict';

      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.querySelectorAll('.needs-validation');

      // Loop over them and prevent submission
      Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add('was-validated');
        }, false);
      });
    })();    
  }

  getStyle() {
    return this.style ? `<style>${this.prependTagNameToCSS(this.style, this.tagName)}</style>` : '';
  }

  /**
  * Adds a tag name at the beginning of each CSS declaration.
  * 
  * @param {string} css - The CSS string to process.
  * @param {string} tagName - The tag name to prepend to each CSS declaration.
  * @returns {string} The modified CSS string with the tag name prepended.
  */
  prependTagNameToCSS(cssString, tagName) {
    return cssString.replace(/([^{}]+)\s*\{/g, (match, selectors) => {
      // Clean up selectors and add the tag
      const updatedSelectors = selectors
        .split(',')
        .map(selector => `${tagName} ${selector.trim()}`)
        .join(', ');
      return `${updatedSelectors} {`;
    });
  }
  
  /**
   * 
   * @param {string} id 
   * @returns { Element }
   */
  get(id) {
    return document.getElementById(id);
  }

  /**
   * Getter to return the current model (enclosed in the current context)
   */
  get model() {
    return SimplModel.get(undefined, this.context);
  }

  /**
   * Setter to set the new model (enclosed in the current context)
   */
  set model(value) {
    SimplModel.set(value, undefined, this.context);
  }

  /**
   * Setter to set an item value in the model 
   * @param {string} id of the item (enclosed in the current context)
   * @param {any} value to set in the selected item
   */
  setField(id, value) {
    SimplModel.set(value, id, this.context);
  }

  /**
   * Returns the name or id of the element.
   * @returns {string} The element identifier
   */
  getName() {
    return this.name || this.id;
  }

  /**
   * Loads the view state from session storage.
   */
  async loadViewState() {
    clearTimeout(this.loadViewStateTimer);
    this.loadViewStateTimer = setTimeout(async () => {
      const result = await StorageService.loadUser(this.context);
      if (result) {
        this.model = result;
      }
      this.refresh();
    }, 10);
  }

  /**
   * Saves the current view state to session storage.
   */
  async saveViewState() {
    StorageService.saveUser(this.context, this.model);
  }
}
