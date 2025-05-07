import { SimplModel } from '../models/simpl-model.js';
import { LanguageService } from '../services/language-service.js';
import { RouterService } from '../services/router-service.js';
import { Config } from '../services/config-service.js';
export class Element extends HTMLElement {
  context = this.getAttribute('context') || 'global';
  name = this.getAttribute('name');
  id = this.getAttribute('id');
  label = this.getAttribute('label') || this.name || '';
  required = this.hasAttribute('required');
  hidden = this.hasAttribute('hidden');
  disabled = this.hasAttribute('disabled');
  timerRef = undefined;
  style = '';
  // state;
  _items;

  static #done; 

  constructor() {
    super();
    if (!Element.#done) {
      Element.#done = true;
      LanguageService.subscribe(() => {
        this.refresh();
      });
      RouterService.subscribe(() => {
        this.refresh();
      });
      window.api.getLocale().then(async (result) => {
        const userLang = await Config.storage.loadApp('_lang');
        if (!userLang)
          LanguageService.lang = result || 'en';
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
          if (this[event.value]) {
            try {
              el.removeEventListener(eventName, this[event.value]);
              el.addEventListener(eventName, this[event.value].bind(this));
            } catch (error) {
              console.error('Error adding event listener', eventName, event.value, error);
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
   * Method to force the render template.
   * NOTE: Listeners will be destroyed and should be added again
   */
  render() {
    this.innerHTML = this.getStyle().concat(this.template(this.state));

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
    return cssString.replace(/([^\{\}]+)\s*\{/g, (match, selectors) => {
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

  async loadViewState() {
    const result = await Config.storage.loadUser(this.context);
    if (result) {
      this.state = result;
      this.model = result;
    }
    this.refresh();
  }
}
