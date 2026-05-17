import { Element } from './element.js';
import { SimplModel } from '../models/simpl-model.js';

export class StaticElement extends Element {
  subscription;
  constructor() {
    super();
    this.subscription?.();
    this.subscription = SimplModel.subscribe((model, property) => {
      this.onUpdateState(property);
    });    
  }

  connectedCallback() {
    this.loadViewState();
  }

  disconnectedCallback() {
    this.saveViewState();
    this.subscription?.();
  }

  onUpdateState() {
  }

}
