import { StaticElement } from "../core/static-element.js";

export class SimplSpinner extends StaticElement {
  constructor() {
    super();
    this.style = `
    #simpl4u_spinner_backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      justify-content: center;
      align-items: center;
      z-index: 1050;
      display: none;
    }
    `;
  }
  template() {
    return `
        <div id="simpl4u_spinner_backdrop">
          <div class="spinner-border text-light" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>    
          `;
  }
}
customElements.define('simpl-spinner', SimplSpinner);