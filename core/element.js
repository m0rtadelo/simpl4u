import { SimplModel } from '../models/simpl-model.js';
import { LanguageService } from '../services/language-service.js';
import { RouterService } from '../services/router-service.js';
import { StorageService } from '../services/storage-service.js';
export class Element extends HTMLElement {
  #refreshTimer = undefined;
  #lastHtml = undefined;
  #timerRef = undefined;
  #modelSubscription = undefined;
  #redraws = 0;
  #domListeners = [];
  static loaded = false;
  isReactive = true;
  context = this.getAttribute('context') || 'global';
  name = this.getAttribute('name');
  id = this.getAttribute('id');
  label = this.getAttribute('label') || this.name || '';
  loadViewStateTimer = undefined;
  style = '';

  constructor() {
    super();
    if (!Element.loaded) {
      Element.loaded = true;
      RouterService.subscribe(() => this.refresh());
      LanguageService.subscribe(() => this.refresh(true));
      if (typeof window.api !== 'undefined') {
        window.api.getLocale().then(async (result) => {
          const userLang = await StorageService.loadApp('_lang');
          if (!userLang)
            LanguageService.lang = result || 'en';
        }).catch(() => {});
      }
      this.#loadModelFromStorage();
    }
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

  #modelChangesSubscription() {
    this.#modelSubscription?.();
    this.#modelSubscription = SimplModel.subscribe((model, property) => {
      this.isReactive && this.onUpdateState(property);
    });        
  }

  onUpdateState() {
    // Override this method in subclasses to react to model state changes
  }

  /**
   * Loads the model from storage and updates the SimplModel with the stored data.
   * This method is called during the first instantiation of the Element class.
   */
  #loadModelFromStorage() {
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

  /**
   * Method to render the template and execute the onReady and addListenersFromTemplate methods
   * It will be called when the element is created and when the state or languages changes
   */
  refresh(force = false) {
    clearTimeout(this.#refreshTimer);
    this.#refreshTimer = setTimeout(() => {
      this.#removeDomListeners();
      this.render(force);
      this.onReady(this.#redraws);
      this.addListenersFromTemplate();
      this.setValueWhenAllItemsAreSet();
      this.#redraws++;
    }, 10);
  }

  render(force = false) {
    const templateHtml = this.template(SimplModel.clone[this.context]);
    if (!force && templateHtml === this.#lastHtml) return;
    this.#lastHtml = templateHtml;
    this.innerHTML = this.getStyle().concat(templateHtml);
    this.#upgradeCustomElements(this);
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

  onReady(redraws) {
    // Override this method in subclasses to perform actions after the component is rendered
  }

  setValueWhenAllItemsAreSet() {
    // Override this method in subclasses to set values when all items are set
  }

  get(id) {
    return this.querySelector(`#${id}`);
  }

  /**
   * Method to add listeners from the template
   * It will look for all the elements with an attribute that starts with '(' and ends with ')'
   * and will add the event listener to the element
   * NOTE: the method declared in the template should be defined in the class as a public method
   */
  addListenersFromTemplate() {
    clearTimeout(this.#timerRef);
    this.#timerRef = setTimeout(() => {
      for (const el of this.querySelectorAll('*')) {
        const events = Object.values(el.attributes).filter((key) => key.name.startsWith('(') && key.name.endsWith(')')) || [];
        events.forEach((event) => {
          const eventName = event.name.substring(1, event.name.length - 1);
          const methodName = event.value;
          if (methodName === '__proto__' || methodName === 'constructor' || methodName === 'prototype') return;
          if (typeof this[methodName] === 'function') {
            try {
              this.#setDomListener(el, eventName, this[methodName].bind(this));
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
    const element = this.get(id);
    this.#setDomListener(element, event, callback);
  }

  #setDomListener(element, event, handler) {
    if (!element) return;

    element.addEventListener(event, handler);
    this.#domListeners.push({ element, event, handler });
  }

  #removeDomListeners() {
    for (const { element, event, handler } of this.#domListeners) {
      element.removeEventListener(event, handler);
    }
    this.#domListeners = [];
  }
  
  setField(field, value) {
    if(SimplModel.get(field, this.context) === value) return;
    SimplModel.set(value, field, this.context);
  }

  /**
   * Called when the element is added to the DOM. Loads view state.
   */
  connectedCallback() {
    this.#redraws = 0;
    this.#modelChangesSubscription();
    this.loadViewState();
  }

  /**
   * Called when the element is removed from the DOM. Saves view state and unsubscribes.
   */
  disconnectedCallback() {
    this.saveViewState(); // TODO
    this.#removeDomListeners();
    this.#modelSubscription?.();
  }

  /**
   * Return the custom element's tag name in lowercase.
   * @returns {string} The tag name of the custom element
   */
  getTagName() {
    return this.tagName.toLowerCase();
  }

  /**
   * Returns the name or id of the element.
   * @returns {string} The element identifier
   */
  getName() {
    return this.name || this.id;
  }  

  async loadDebouncedUserData() {
    return new Promise((resolve) => {
      clearTimeout(this.loadViewStateTimer);
      this.loadViewStateTimer = setTimeout(async () => {
        const result = await StorageService.loadUser(this.context);
          if (result)
            SimplModel.set(result, undefined, this.context);
        resolve(result);
      }, 50);
    });
  }

  /**
   * Loads the view state from session storage.
   */
  async loadViewState() {
    await this.loadDebouncedUserData();
    this.refresh();
  }

  /**
   * Saves the current view state to session storage.
   */
  async saveViewState() {
    StorageService.saveUser(this.context, this.model);
  }
  
  /**
   * Upgrades all custom elements within the given root.
   * @private
   * @param {Element} root - The root element to search
   */
  #upgradeCustomElements(root) {
    for (const el of root.querySelectorAll('*')) {
      const tag = el.tagName.toLowerCase();
      if (tag.includes('-') && customElements.get(tag)) {
        customElements.upgrade(el);
      }
    }
  }
}