/**
 * MessageService provides a lightweight publish/subscribe message bus.
 *
 * It lets decoupled components (e.g. siblings without a parent/child relationship)
 * communicate through named topics without holding references to each other.
 * Use it for transient signals (e.g. "refresh requested"); for shared state prefer
 * the reactive model.
 */
export class MessageService {
  /**
   * Map of topic name to the set of subscriber callbacks registered for it.
   * @private
   * @type {Map<string, Set<Function>>}
   */
  static #topics = new Map();

  /**
   * Subscribes a handler to a topic.
   * @param {string} topic - The topic name to listen to (convention: `domain:action`).
   * @param {Function} handler - The callback invoked with the published payload.
   * @returns {Function} A function to unsubscribe the handler.
   */
  static subscribe(topic, handler) {
    const handlers = MessageService.#topics.get(topic) || new Set();
    handlers.add(handler);
    MessageService.#topics.set(topic, handlers);
    return () => MessageService.unsubscribe(topic, handler);
  }

  /**
   * Unsubscribes a previously registered handler from a topic.
   * @param {string} topic - The topic name.
   * @param {Function} handler - The handler to remove.
   */
  static unsubscribe(topic, handler) {
    const handlers = MessageService.#topics.get(topic);
    if (!handlers) {
      return;
    }
    handlers.delete(handler);
    if (handlers.size === 0) {
      MessageService.#topics.delete(topic);
    }
  }

  /**
   * Publishes a payload to all handlers subscribed to a topic.
   * @param {string} topic - The topic name to publish to.
   * @param {*} [payload] - Optional data passed to each handler.
   */
  static emit(topic, payload) {
    const handlers = MessageService.#topics.get(topic);
    if (!handlers) {
      return;
    }
    for (const handler of handlers) {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Error in MessageService handler for topic "${topic}":`, error);
      }
    }
  }
}
