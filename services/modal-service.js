import { LanguageService } from './language-service.js';
import { TextService } from './text-service.js';

export class ModalService {
  /**
   * Static ID for the default Bootstrap modal.
   * @type {string}
   */
  static modalId = 'myBootstrapModal';

  /**
   * Static ID for an alternative Bootstrap modal.
   * @type {string}
   */
  static modalId2 = 'myBootstrapModal2';

  /**
   * Shows a message modal with the specified text and title (default is 'message').
   * Translates text and title using LanguageService.i18n if available.
   *
   * @param {string} text - The content of the modal body.
   * @param {string} [title='message'] - Title of the modal header.
   * @return {Promise<undefined>} A promise that resolves once the modal is closed.
   */
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
                <button type="button" class="btn btn-primary" id="${this.modalId}_click_yes">${LanguageService.i18n('close')}</button>
              </div>
            </div>
          </div>
        </div>        
            `);
  }

  /**
   * Shows a confirmation modal with the specified text and title (default is 'confirm').
   * Translates text and title using LanguageService.i18n if available.
   *
   * @param {string} text - The content of the modal body.
   * @param {string} [title='confirm'] - Title of the modal header.
   * @return {Promise<boolean>} A promise that resolves to true if 'Yes' is clicked, or false otherwise.
   */
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
                <button type="button" class="btn btn-primary" id="${this.modalId}_click_yes">${LanguageService.i18n('yes')}</button>
              </div>
            </div>
          </div>
        </div>        
            `);
  }

  /**
   * Shows a prompt modal with the specified text, title (default is 'prompt'), and initial value.
   * Translates text and title using LanguageService.i18n if available.
   *
   * @param {string} text - The label for the input field in the modal body.
   * @param {string} [title='prompt'] - Title of the modal header.
   * @param {string} [value=''] - Initial value for the input field.
   * @return {Promise<string|undefined>} A promise that resolves to the entered value if 'Accept' is clicked, or undefined otherwise.
   */
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
                <input type="text" class="form-control" autofocus="true" id="formInput" value="${TextService.htmlEscape(value)}">
              </div>              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${LanguageService.i18n('cancel')}</button>
              <button type="button" class="btn btn-primary" id="${this.modalId}_click_yes">${LanguageService.i18n('accept')}</button>
            </div>
          </div>
        </div>
      </div>        
          `);
  }

  /**
   * Opens a custom modal with the specified body, title (default is ''), and optional hideCancel flag.
   * Translates title using LanguageService.i18n if available.
   *
   * @param {string} body - The HTML content of the modal body.
   * @param {string} [title=''] - Title of the modal header.
   * @param {boolean} [hideCancel=false] - If true, hides the 'Cancel' button.
   * @return {Promise<boolean>} A promise that resolves to true if 'Accept' is clicked, or false otherwise.
   */
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
              <button type="submit" class="btn btn-primary" id="${this.modalId2}_click_yes">${LanguageService.i18n('accept')}</button>
            </div>
          </div>
        </div>
        </form>        
      </div>
          `);

  }

  /**
   * Handles opening a modal and resolving when it is closed.
   *
   * @param {string} modal - HTML content of the modal to open.
   * @return {Promise<boolean>} A promise that resolves to true if 'Accept' is clicked, or false otherwise.
   */
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

  /**
   * Handles opening a modal with input and resolves when it is closed.
   *
   * @param {string} modal - HTML content of the modal to open, expected to include an input field with id 'formInput'.
   * @return {Promise<string|undefined>} A promise that resolves to the value in the input field if 'Accept' is clicked, or undefined otherwise.
   */
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

  /**
   * Deletes a modal from the DOM.
   *
   * @param {string} [id] - ID of the modal to delete. Uses static modalId if not provided.
   */
  static #deleteModal(id) {
    const modalElement = document.getElementById(id || this.modalId);
    modalElement?.remove();
  }
}
