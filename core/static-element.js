import { Element } from './element.js';
import { SimplModel } from '../models/simpl-model.js';

/**
 * StaticElement is the base class for components that use static templates.
 * It subscribes to model changes and calls onUpdateState on changes.
 */
export class StaticElement extends Element {
  subscription;
  constructor() {
    super();
    this.subscription?.();
    this.subscription = SimplModel.subscribe((model, property) => {
      this.onUpdateState(property);
    });    
  }

  /**
   * Called when the element is added to the DOM. Loads view state.
   */
  connectedCallback() {
    this.loadViewState();
  }

  /**
   * Called when the element is removed from the DOM. Saves view state and unsubscribes.
   */
  disconnectedCallback() {
    this.saveViewState();
    this.subscription?.();
  }

  /**
   * Called when the model state changes. Override to react to state updates.
   */
  onUpdateState() {
  }

}
