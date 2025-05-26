import { StaticElement } from '../../../../framework/core/static-element.js';
import { SimplModel } from '../../../../framework/models/simpl-model.js';
import { LanguageService } from '../../../../framework/services/language-service.js';
import { ModalService } from '../../../../framework/services/modal-service.js';
import { ToastService } from '../../../../framework/services/toast-service.js';
import { MyStorageService } from '../services/my-storage.service.js';

export class MyTodoForm extends StaticElement {

  template(state) {
    return `
      <div class="row">
      <div class="col-12">
        <simpl-input context="${this.context}" id="name" name="name" label="${LanguageService.i18n('name')}" required="true"></simpl-input>
      </div>
      <div class="col-6">
        <simpl-input context="${this.context}" id="version" name="version" required label="${LanguageService.i18n('version')}"></simpl-input>
      </div>
      <div class="col-6">
        <simpl-select id="target" context="${this.context}" label="${LanguageService.i18n('target')}" required name="target" items='[{"id": "int", "text": "int"},{"id": "pre", "text": "pre"},{"id": "pro", "text": "pro"}]'></simpl-select>
      </div>
      <simpl-textarea context="${this.context}" rows="3" id="notes" name="notes" label="${LanguageService.i18n('notes')}"></simpl-textarea>
      <div class="col-6">
        <simpl-switch context="${this.context}" id="custom-color" (change)="changeSwitch" label="${LanguageService.i18n('custom-color')}" ></simpl-switch>
        <simpl-color context="${this.context}" id="color"></simpl-color>
      </div>
      <div class="col-6">
        <simpl-date context="${this.context}" id="date" name="date" label="${LanguageService.i18n('date')}"></simpl-date>
      </div>
      <div class="col-12">
        <button class="w-100 btn btn-outline-primary" type="button" (click)="copy" id="copy">${LanguageService.i18n('add-new-version')}</button>
      </div>
      </div>
    `;
  }

  onReady() {
    setTimeout(() => {
      document.querySelector('input#name').focus();
      this.model['target'] = this.model['target'] || 'int';
    }, 500);
    this.changeSwitch();
  }

  async copy() {
    const values = JSON.parse(JSON.stringify(this.model));
    const oldId = values['id'];
    const oldParts = oldId.split('_');
    const version = await ModalService.prompt('Enter the new version', 'Version', values['version']);
    if (!version)
      return;
    console.log(oldParts);
    const model = await MyStorageService.loadApp('status');
    const panels = Object.keys(model);
    model[panels[0]].push({...values, version: version, id: Date.now() });
    SimplModel.model['status'] = model;
    await MyStorageService.saveApp('status', model);
    ToastService.success(`Version ${version} added`);
  }

  changeSwitch() {
    this.get('color').hidden = !this.model['custom-color'];
    this.get('color').refresh();
  }
}
customElements.define('my-todo-form', MyTodoForm);
