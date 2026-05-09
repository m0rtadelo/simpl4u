import { Element } from './element.js';
import { SimplModel } from '../models/simpl-model.js';
import { StorageService } from '../services/storage-service.js';

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

  connectedCallback() {
    this.loadViewState();
  }

  disconnectedCallback() {
    StorageService.saveUser(this.context, this.model);
    this.subscription?.();
  }

  setState(newState) {
    SimplModel.model[this.context] = newState;
    this.update();
  }

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

  #upgradeCustomElements(root) {
    for (const el of root.querySelectorAll('*')) {
      const tag = el.tagName.toLowerCase();
      if (tag.includes('-') && customElements.get(tag)) {
        customElements.upgrade(el);
      }
    }
  }
}
