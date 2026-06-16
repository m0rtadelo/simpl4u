import { Element } from './element.js';

/**
 * ReactiveElement is the base class for components that re-render on every model change.
 * It subscribes to model changes and calls setState to update the template.
 */
export class ReactiveElement extends Element {

  onUpdateState() {  
    this.refresh();
  }

  /*
  update__() {
    const templateHtml = this.template(this.model);
    const html = this.getStyle().concat(templateHtml);
    //if (html === this.lastHtml) return;
    const container = document.createElement('div');
    container.innerHTML = html;
    this.lastHtml = html;
    this.replaceChildren(...container.childNodes);
    //this.#upgradeCustomElements(this);
    this.onReady();
    this.addListenersFromTemplate();
  }*/
}
