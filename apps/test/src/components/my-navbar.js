import { StaticElement } from '../../../../simpl4u/core/static-element.js';

export class MyNavBar extends StaticElement {
  
  template() {
    return '<simpl-navbar id="navbar" name="MyApp"></simpl-navbar>';
  }

  onReady() {
    const navbar = this.get('navbar');
    if (!navbar) return;
    navbar.hideLang = false;
    navbar.hideTheme = false;
    navbar.items = [
      { id: 'crud', name: 'contacts' },
      { id: 'todo', name: 'todo' },
      { id: 'form1', name: 'form1' },
      { id: 'form2', name: 'form2' },
      { id: 'services', name: 'services' }
    ];
  }
}
customElements.define('my-navbar', MyNavBar);
