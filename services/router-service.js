/**
 * RouterService provides hash-based routing functionality.
 * It allows subscribing to route changes and notifies subscribers when the route changes.
 */
export class RouterService {
  /**
   * A set of subscriber callback functions to be notified on route changes.
   * @private
   * @type {Set<Function>}
   */
  static #subscribers = new Set();

  /**
   * The current view (hash) of the application.
   * @type {string}
   */
  static view = '';

  static {
    window.addEventListener('hashchange', () => {
      const newHash = (location.hash || '').slice(1);
      if (newHash) {
        RouterService.view = newHash;
        RouterService.#notify();
      }
    });
  }

  /**
   * Navigates to a view by setting the URL hash.
   * @param {string} view - The view identifier to navigate to
   */
  static setView(view) {
    if (RouterService.view === view) {
      return;
    }
    window.location.hash = view;
  }

  /**
   * Subscribes to route changes.
   * The provided callback will be called whenever the route changes.
   * 
   * @param {Function} callback - The function to call when the route changes. Receives the current view as an argument.
   * @returns {Function} A function to unsubscribe the callback.
   */
  static subscribe(callback) {
    RouterService.#subscribers.add(callback);
    callback(RouterService.view);
    return () => RouterService.#subscribers.delete(callback);
  }

  /**
   * Notifies all subscribers of the current route.
   * @private
   */
  static #notify() {
    for (const callback of RouterService.#subscribers) {
      callback(RouterService.view);
    }
  }
}
