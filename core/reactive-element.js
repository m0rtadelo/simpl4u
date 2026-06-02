import { Element } from './element.js';
import { SimplModel } from '../models/simpl-model.js';

/**
 * ReactiveElement is the base class for components that re-render on every model change.
 * It subscribes to model changes and calls setState to update the template.
 */
export class ReactiveElement extends Element {
  subscription;
  lastHtml = undefined;
  constructor() { 
    super();
    this.subscription?.();
    this.subscription = SimplModel.subscribe(model => {
      this.setState(model[this.context]);
    });

  }

  /**
   * Called when the element is added to the DOM. Loads view state.
   */
  connectedCallback() {
    this.loadViewState();
  }

  /**
   * Called when the element is removed from the DOM. Saves view state and unsubscribes.
   */
  disconnectedCallback() {
    this.saveViewState();
    this.subscription?.();
  }

  /**
   * Sets the new model state for the context and triggers a re-render.
   * @param {object} newState - The new state object
   */
  setState(newState) {
    SimplModel.model[this.context] = newState;
    this.update();
  }

  /**
   * Re-renders the component with the current model state.
   */
  update() {
    const templateHtml = this.template(this.model);
    const html = this.getStyle().concat(templateHtml);
    if (html === this.lastHtml) return;
    const container = document.createElement('div');
    container.innerHTML = html;
    this.lastHtml = html;
    this.replaceChildren(...container.childNodes);
    this.#upgradeCustomElements(this);
    this.onReady();
    this.addListenersFromTemplate();
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
