import { ReactiveElement } from '../../../../simpl4u/core/reactive-element.js';
import { LanguageService } from '../../../../simpl4u/services/language-service.js';
import { TextService } from '../../../../simpl4u/services/text-service.js';

export class MyPanelInfo extends ReactiveElement {
  template(state) {
    return `
    <div class="card mt-4">
      <div class="card-body">
        <div><small><b>${LanguageService.i18n('name')}</b>: ${TextService.sanitize(state.name || '')}</small></div>
        <div><small><b>${LanguageService.i18n('surname')}</b>: ${TextService.sanitize(state.surname || '')}</small></div>
        <div><small><b>${LanguageService.i18n('birthday')}</b>: ${TextService.sanitize(state.birthday || '')}</small></div>
        <div><small><b>${LanguageService.i18n('nickname')}</b>: ${TextService.sanitize(state.nickname || '')}</small></div>
        <div><small><b>${LanguageService.i18n('company')}</b>: ${TextService.sanitize(state.company || '')}</small></div>
        <div><small><b>${LanguageService.i18n('sex')}</b>: ${LanguageService.i18n(state.sex || '')}</small></div>
        <div><small><b>${LanguageService.i18n('alive')}</b>: ${LanguageService.i18n(state.alive || 'false')}</small></div>
      </div>
    </div>
        `;
  }
}
customElements.define('my-panel-info', MyPanelInfo);
