import { StaticElement } from '../../../../framework/core/static-element.js';

export class MyNavBar extends StaticElement {
  
  template() {
    return '<simpl-navbar id="navbar" name="GECO+"></simpl-navbar>';
  }

  onReady() {
    const navbar = this.get('navbar');
    if (!navbar) return;
    navbar.hideLang = false;
    navbar.hideTheme = false;
    navbar.items = [
      { id: 'projects', name: 'projects' },
      { id: 'status', name: 'status' },
      { id: 'options', name: 'options' }
    ];
  }
}
customElements.define('my-navbar', MyNavBar);
