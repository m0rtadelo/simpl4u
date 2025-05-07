import { StaticElement } from './static-element.js';

export class FormElement extends StaticElement {
  required = this.hasAttribute('required');
  hidden = this.hasAttribute('hidden');
  disabled = this.hasAttribute('disabled');
  reactive = this.hasAttribute('reactive');

  isRequired() {
    return this.required && !(this.disabled || this.hidden) ? 'required' : '';
  }

  onUpdateState() {
    if (this.reactive) {
      this.refresh();
    }
  }
}
