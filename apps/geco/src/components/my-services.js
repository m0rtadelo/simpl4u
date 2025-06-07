import { StaticElement } from '../../../../simpl4u/core/static-element.js';
import { ReactiveElement } from '../../../../simpl4u/core/reactive-element.js';
import { ModalService } from '../../../../simpl4u/services/modal-service.js';
import { ToastService } from '../../../../simpl4u/services/toast-service.js';
import { FileService } from '../../../../simpl4u/services/file-service.js';
import { SimplModel } from '../../../../simpl4u/models/simpl-model.js';
import { Config } from '../../../../simpl4u/services/config-service.js';
import { SpinnerService } from '../../../../simpl4u/services/spinner-service.js';

class MyButton extends ReactiveElement {
  template(state) {
    return `<button class="btn btn-primary">${state.inProgress ? 'Stop' : 'Start' }</button>`;
  }
}
customElements.define('my-button', MyButton);

export class MyServices extends StaticElement {
  files;

  template(state) {
    return `
      <div class="row">
        <div class="col-12 p-3">
          <simpl-button (click)="testModalService" class="d-grid">Test modal service</simpl-button>
        </div>    
        <div class="col-3 p-3">
          <simpl-button (click)="toastInfo" class="d-grid">Test toast info</simpl-button>
        </div>
        <div class="col-3 p-3">
          <simpl-button (click)="toastSuccess" class="d-grid">Test toast success</simpl-button>
        </div>    
        <div class="col-3 p-3">
          <simpl-button (click)="toastWarning" class="d-grid">Test toast warning</simpl-button>
        </div>    
        <div class="col-3 p-3">
          <simpl-button (click)="toastError" class="d-grid">Test toast error</simpl-button>
        </div>
        <div class="mt-3 col-5">
          <div class="card">
            <div class="card-header">
              Export data to file
            </div>
            <div class="card-body mt-3">
              <simpl-button (click)="export" class="d-grid">Export data</simpl-button>
            </div>
          </div>
        </div>
        <div class="col-7">
          <div class="card">
            <div class="card-header">
              Restore data from backup file
            </div>
            <div class="card-body mt-3">
              <div class="row">
                <div class="col-9">
                  <simpl-file (change)="change" id="file"></simpl-file>
                </div>
                <div class="col-3">
                  <simpl-button (click)="import" class="d-grid">Restore data</simpl-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 mt-3">
          <div class="card">
            <div class="card-header">
              Progress bar
            </div>
            <div class="card-body mt-3">
              <div class="row">
                <div class="col-10">
                  <simpl-progress name="progress"></simple-progress>
                </div>
                <div class="col-2">
                  <my-button (click)="progress" reactive class="d-grid">${state.inProgress ? 'Stop' : 'Start' }</my-button>
                </div>
              </div>
            </div>
        </div>
        <div class="col-12 mt-3">
          <simpl-button (click)="testSpinner" class="d-grid">Test spinner</simpl-button>
        </div>
      </div>
    `;
  }

  testSpinner() {
    SpinnerService.show();
    setTimeout(() => {
      SpinnerService.hide();
    }, 3000);
  }

  progress() {
    clearInterval(this.model.interval);
    if (this.model.inProgress) {
      this.model.inProgress = false;
      ToastService.warning('Progress stopped');
      return;
    }
    this.model.progress = 0;
    this.model.inProgress = true;
    ToastService.info('Progress started');
    this.model.interval = setInterval(() => {
      this.model.progress = (this.model.progress) + 2;
      if (this.model.progress >= 100) {
        this.model.progress = 100;
        clearInterval(this.model.interval);
        ToastService.success('Progress completed');
        this.model.inProgress = false;
      }
    }, 250);
  }

  async testModalService() {
    const response = await ModalService.confirm('modal.confirm');
    if (response) {
      const prompt = await ModalService.prompt('modal.prompt');
      if (prompt !== undefined)
        await ModalService.message(prompt);
    }
  }

  toastSuccess() {
    ToastService.success('This is a success toast!');
  }

  toastError() {
    ToastService.error('This is an error toast!');
  }

  toastWarning() {
    ToastService.warning('This is an warning toast!');
  }

  toastInfo() {
    ToastService.info('This is an info toast!');
  }

  change(event) {
    this.files = event.target.files;
  }

  async import() {
    const file = this.files?.item?.(0);
    if (!file) {
      ToastService.error('No file selected');
      return;
    }

    try {
      const content = await file.text();
      const json = JSON.parse(content);
      await Config.storage.saveAppModel(json);
      Config.storage.saveUserModel(content);
      SimplModel.model = json;
      window.location.reload();
    } catch (error) {
      console.error(error);
      ToastService.error('Error importing data');
    }
  }

  async export() {
    const data = await Config.storage.loadAppModel();
    const filename = 'export.json';
    FileService.download(filename, data);
  }
}
customElements.define('my-services', MyServices);
