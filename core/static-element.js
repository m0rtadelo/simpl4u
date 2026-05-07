import { Element } from './element.js';
import { SimplModel } from '../models/simpl-model.js';
import { Config } from '../services/config-service.js';
export class StaticElement extends Element {
  subscription;
  constructor() {
    super();
    this.subscription?.();
    this.subscription = SimplModel.subscribe(model => {
      this.onUpdateState();
    });    
  }

  connectedCallback() {
    this.loadViewState();
  }

  disconnectedCallback() {
    Config.storage.saveUser(this.context, this.model);
    this.subscription?.();
  }

  onUpdateState() {
  }

}
