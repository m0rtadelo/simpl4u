import { StaticElement } from '../../../../simpl4u/core/static-element.js';
import { LanguageService } from '../../../../simpl4u/services/language-service.js';
import { ModalService } from '../../../../simpl4u/services/modal-service.js';
import { Config } from '../../../../simpl4u/services/config-service.js';

export class MyForm extends StaticElement {

  constructor() {
    super();
    this.resetForm();
  }

  template() {
    return `
    <div class="container">
      <div class="col-12 text-center">
        <h1 class="mb-4 text-capitalize">${this.context}</h1>
      </div>
      <form id="form" (submit)="save" class="needs-validation" novalidate>
        <div class="row">
          <div class="col-8">
            <div class="row">
              <simpl-input class="col-12 col-md-6 col-lg-3" required id="name" name="name" context="${this.context}"></simpl-input>
              <simpl-input class="col-12 col-md-6 col-lg-5" required name="surname" context="${this.context}"></simpl-input>
              <simpl-date class="col-12 col-md-6 col-lg-4" name="birthday" context="${this.context}"></simpl-date>
              <simpl-input class="col-12 col-md-6 col-lg-3" name="nickname" context="${this.context}"></simpl-input>
              <simpl-input class="col-12 col-md-12 col-lg-9" name="company" context="${this.context}"></simpl-input>
              <simpl-select id="sex" context="${this.context}" required name="sex" items='[{"id":"", "text":""},{"id": "male", "text": "Male"},{"id": "female", "text": "Female"}]'></simpl-select>
              <simpl-switch context="${this.context}" name="alive" id="alive"></simpl-switch>
            </div>
          </div>
          <div class="col-4">
            <my-panel-info context="${this.context}"></my-panel-info>
          </div>
        </div>
        <div class="row align-items-center mt-md-4">
          <div class="col-12 col-md-6 col-lg-6 text-md-end form-text">
          <span style="color: var(--bs-form-invalid-color)">* </span><span>${LanguageService.i18n('required-fields')}</span>
          </div>
          <div class="col-12 col-md-3 col-lg-3">
            <button class="btn btn-secondary col-12" id="button" type="button" (click)="resetForm">Reset</button>
          </div>
          <div class="col-12 col-md-3 col-lg-3">
            <button class="btn btn-primary col-12" id="button" type="submit">Save model</button>
          </div>
        </form>
      </div>
        `;
  }

  onReady() {
    setTimeout(() => { this.get('name').focus(); }, 300);
  }

  async save(event) {
    event.preventDefault();
    const form = this.get('form');
    if(!form.checkValidity())
      return;
    await Config.storage.saveApp(this.context, this.model);
    ModalService.message('<pre>' + JSON.stringify(this.model, null, 2) + '</pre>', 'saved-data');
  }

  async resetForm() {
    this.model = await Config.storage.loadApp(this.context) || {};
    this.refresh();
  }
}
customElements.define('my-form', MyForm);
