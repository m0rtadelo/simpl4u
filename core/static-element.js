import { Element } from './element.js';

/**
 * StaticElement is the base class for components that use static templates.
 * It subscribes to model changes and calls onUpdateState on changes.
 */
export class StaticElement extends Element {
  isReactive = false;
}
