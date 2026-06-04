/**
 * ToastService provides methods to display toast notifications using the Notyf library.
 * It supports different types of notifications such as success, error, warning, and info.
 */
export class ToastService {
  static #duration = 5000;
  static #dismissible = true;
  static #position = { x: 'right', y: 'top' };

  static {
    this.init();
  }

  /**
   * Gets the notification display duration in milliseconds.
   * @returns {number} The duration in milliseconds.
   */
  static get duration() {
    return this.#duration;
  }

  /**
   * Sets the notification display duration and reinitializes the service.
   * @param {number} value - Duration in milliseconds.
   */
  static set duration(value) {
    this.#duration = value;
    this.init();
  }

  /**
   * Gets whether notifications can be dismissed by the user.
   * @returns {boolean} Whether notifications are dismissible.
   */
  static get dismissible() {
    return this.#dismissible;
  }

  /**
   * Sets whether notifications are dismissible and reinitializes the service.
   * @param {boolean} value - Whether notifications should be dismissible.
   */
  static set dismissible(value) {
    this.#dismissible = value;
    this.init();
  }

  /**
   * Gets the notification position on screen.
   * @returns {{ x: string, y: string }} The position object with `x` ('left'|'right') and `y` ('top'|'bottom').
   */
  static get position() {
    return this.#position;
  }

  /**
   * Sets the notification position on screen and reinitializes the service.
   * @param {{ x: string, y: string }} value - Position object with `x` ('left'|'right') and `y` ('top'|'bottom').
   */
  static set position(value) {
    this.#position = value;
    this.init();
  }

  static init() {
    /**
     * Initializes the Notyf instance with custom notification types.
     * @private
     */
    // eslint-disable-next-line no-undef
    this.notyf = new Notyf({
      duration: this.duration,
      dismissible: this.dismissible,
      position: this.position,
      types: [
        {
          type: 'info',
          background: '#0d6efd',
          icon: '<span class="bi bi-info-circle-fill"></span>'
        },
        {
          type: 'warning',
          background: 'orange',
          icon: '<span class="bi bi-exclamation-triangle-fill"></span>'
        },
      ]
    });    
  }

  /**
   * Displays an error notification.
   * @param {string} message - The message to display in the error notification.
   */
  static error(message) {
    this.notyf.error(message);
  }

  /**
   * Displays a success notification.
   * @param {string} message - The message to display in the success notification.
   */
  static success(message) {
    this.notyf.success(message);
  }

  /**
   * Displays a warning notification.
   * @param {string} message - The message to display in the warning notification.
   */
  static warning(message) {
    this.notyf.open({
      type: 'warning',
      message: message,
    });
  }

  /**
   * Displays an info notification.
   * @param {string} message - The message to display in the info notification.
   */
  static info(message) {
    this.notyf.open({
      type: 'info',
      message: message,
    });
  }
}
