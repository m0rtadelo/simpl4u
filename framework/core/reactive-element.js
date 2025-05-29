import { Element } from './element.js';
import { SimplModel } from '../models/simpl-model.js';
import { Config } from '../services/config-service.js';
export class ReactiveElement extends Element {
  subscription;
  constructor() { 
    super();
    this.state = SimplModel.get(undefined, this.context);
    this.subscription?.();
    this.subscription = SimplModel.subscribe(model => {
      this.setState(model[this.context]);
    });

  }

  connectedCallback() {
    this.loadViewState();
  }

  disconnectedCallback() {
    Config.storage.saveUser(this.context, this.model);
    this.subscription?.();
  }

  setState(newState) {
    this.state = newState;
    this.update();
  }

  update() {
    const templateHtml = this.template(this.state);
    const container = document.createElement('div');
    container.innerHTML = this.getStyle().concat(templateHtml);
    this.replaceChildren(...container.childNodes);
    this.#upgradeCustomElements(this);
    this.onReady();
    this.addListenersFromTemplate();
  }

  #upgradeCustomElements(root) {
    for (const el of root.querySelectorAll('*')) {
      const tag = el.tagName.toLowerCase();
      if (tag.includes('-') && customElements.get(tag)) {
        customElements.upgrade(el);
      }
    }
  }
}
