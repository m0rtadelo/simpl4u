import { StaticElement } from '../../../../framework/core/static-element.js';
import { LanguageService } from '../../../../framework/services/language-service.js';

export class MyTodoForm extends StaticElement {

  template(state) {
    return `
      <div class="row">
      <simpl-input context="${this.context}" id="title" name="title" label="${LanguageService.i18n('title')}" required="true"></simpl-input>
      <simpl-textarea context="${this.context}" id="description" name="description" label="${LanguageService.i18n('description')}"></simpl-textarea>
      <simpl-textarea context="${this.context}" rows="6" id="notes" name="notes" label="${LanguageService.i18n('notes')}"></simpl-textarea>
      <div class="col-6">
        <simpl-switch context="${this.context}" id="custom-color" (change)="changeSwitch" label="${LanguageService.i18n('custom-color')}" ></simpl-switch>
        <simpl-color context="${this.context}" id="color"></simpl-color>
      </div>
      <div class="col-6">
        <simpl-date context="${this.context}" id="date" name="date" label="${LanguageService.i18n('date')}"></simpl-date>
      </div>
      </div>
    `;
  }

  onReady() {
    setTimeout(() => {
      document.querySelector('input#title').focus();
    }, 500);
    this.changeSwitch();
  }

  changeSwitch() {
    this.get('color').hidden = !this.model['custom-color'];
    this.get('color').refresh();
  }
}
customElements.define('my-todo-form', MyTodoForm);
