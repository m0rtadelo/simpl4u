import { LanguageService } from './language-service.js';

export class ModalService {
  static modalId = 'myBootstrapModal';
  static modalId2 = 'myBootstrapModal2';

  static async message(text, title = 'message') {
    text = LanguageService.i18n(text);
    return this.#handleModal(`
        <div class="modal fade" id="${this.modalId}" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">${LanguageService.i18n(title)}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${LanguageService.i18n('close')}"></button>
              </div>
              <div class="modal-body">
                ${text}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="${this.modalId}_click_yes" >${LanguageService.i18n('close')}</button>
              </div>
            </div>
          </div>
        </div>        
            `);
  }

  static async confirm(text, title = 'confirm') {
    text = LanguageService.i18n(text);
    return this.#handleModal(`
        <div class="modal fade" id="${this.modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">${LanguageService.i18n(title)}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${LanguageService.i18n('close')}"></button>
              </div>
              <div class="modal-body">
                ${text}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${LanguageService.i18n('no')}</button>
                <button type="button" class="btn btn-primary" id="${this.modalId}_click_yes" >${LanguageService.i18n('yes')}</button>
              </div>
            </div>
          </div>
        </div>        
            `);
  }

  static async prompt(text, title = 'prompt', value = '') {
    text = LanguageService.i18n(text);
    return this.#handleModal(`
      <div class="modal fade" id="${this.modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">${LanguageService.i18n(title)}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${LanguageService.i18n('close')}"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="formInput" class="form-label">${text}</label>
                <input type="text" class="form-control" autofocus="true" id="formInput" value="${value}">
              </div>              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${LanguageService.i18n('cancel')}</button>
              <button type="button" class="btn btn-primary" id="${this.modalId}_click_yes" >${LanguageService.i18n('accept')}</button>
            </div>
          </div>
        </div>
      </div>        
          `);
  }

  static async open(body, title = '', hideCancel = false) {
    return this.#handleOpenModal(`
      <div class="modal fade" id="${this.modalId2}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <form id="form" class="needs-validation" novalidate>
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">${LanguageService.i18n(title)}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${LanguageService.i18n('close')}"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">${body}
              </div>              
            </div>
            <div class="modal-footer">
            ${body.includes(' required ') ? `<span class="form-text"><span style="color: var(--bs-form-invalid-color)">* </span><span>${LanguageService.i18n('required-fields')}</span></span>` : ''}
            ${hideCancel ? '' : `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${LanguageService.i18n('cancel')}</button>`}
              <button type="submit" class="btn btn-primary" id="${this.modalId2}_click_yes" >${LanguageService.i18n('accept')}</button>
            </div>
          </div>
        </div>
        </form>        
      </div>
          `);

  }

  static async #handleOpenModal(modal) {
    this.#deleteModal(this.modalId2);
    document.body.insertAdjacentHTML('beforeend', modal);
    // eslint-disable-next-line no-undef
    let myModal = new bootstrap.Modal(document.getElementById(this.modalId2), {});
    myModal.show();
    const form = document.getElementById('form');
    let result = false;
    form.addEventListener('submit', (event) => {
      if(!form.checkValidity())
        return;
      event.preventDefault();
      result = true;
      myModal.hide();
    });

    return new Promise((resolve) => {
      document.getElementById(this.modalId2).addEventListener('hidden.bs.modal', () => {
        resolve(result);
      });
    });
  }

  static async #handleModal(modal) {
    this.#deleteModal();
    document.body.insertAdjacentHTML('beforeend', modal);
    // eslint-disable-next-line no-undef
    let myModal = new bootstrap.Modal(document.getElementById(this.modalId), {});
    myModal.show();
    const input = document.getElementById('formInput');
    let result = input ? undefined : false;
    if (input) {
      setTimeout(() => {
        input.focus();
      }, 500);
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          result = input.value;
          myModal.hide();
        }
      });
    }
    return new Promise((resolve) => {
      document.getElementById(this.modalId).addEventListener('hidden.bs.modal', () => {
        resolve(result);
      });
      document.getElementById(this.modalId + '_click_yes').addEventListener('click', () => {
        result = input ? input.value : true;
        myModal.hide();
      });
    });
  }

  static #deleteModal(id) {
    const modalElement = document.getElementById(id || this.modalId);
    modalElement?.remove();
  }
}
