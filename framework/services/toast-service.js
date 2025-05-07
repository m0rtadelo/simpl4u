/**
 * ToastService provides methods to display toast notifications using the Notyf library.
 * It supports different types of notifications such as success, error, warning, and info.
 */
export class ToastService {

  static {
    /**
     * Initializes the Notyf instance with custom notification types.
     * @private
     */
    // eslint-disable-next-line no-undef
    this.notyf = new Notyf({
      duration: 5000,
      dismissible: true,
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
