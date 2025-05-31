/**
 * Service to control the display of a spinner overlay with debounce and minimum display time.
 *
 * @example
 * // Show the spinner
 * SpinnerService.show();
 *
 * // Hide the spinner after some async operation
 * someAsyncOperation().finally(() => {
 *   SpinnerService.hide();
 * });
 */
export class SpinnerService {
  /**
   * Time in milliseconds to debounce the spinner display.
   * @type {number}
   */
  static debounceTime = 200;

  /**
   * Minimum time in milliseconds the spinner should remain visible.
   * @type {number}
   */
  static minDisplayTime = 300;

  /**
   * Reference to the debounce timeout.
   * @type {number|undefined}
   */
  static ref;

  /**
   * Timestamp when the spinner was shown.
   * @type {number|null}
   */
  static shownAt = null;

  /**
   * Reference to the minimum display timeout.
   * @type {number|undefined}
   */
  static hideTimeout = null;

  /**
   * Shows the spinner after a debounce period.
   * Ensures any pending hide timeout is cleared.
   */
  static show() {
    clearTimeout(SpinnerService.ref);
    clearTimeout(SpinnerService.hideTimeout);
    SpinnerService.ref = setTimeout(() => {
      SpinnerService.#toggle('flex');
      SpinnerService.shownAt = Date.now();
    }, SpinnerService.debounceTime);
  }

  /**
   * Hides the spinner, ensuring it stays visible for at least the minimum display time.
   */
  static hide() {
    clearTimeout(SpinnerService.ref);
    if (SpinnerService.shownAt) {
      const elapsed = Date.now() - SpinnerService.shownAt;
      if (elapsed < SpinnerService.minDisplayTime) {
        SpinnerService.hideTimeout = setTimeout(() => {
          SpinnerService.#toggle('none');
          SpinnerService.shownAt = null;
        }, SpinnerService.minDisplayTime - elapsed);
        return;
      }
    }
    SpinnerService.#toggle('none');
    SpinnerService.shownAt = null;
  }

  /**
   * Toggles the spinner's display style.
   * @param {'flex'|'none'} value - The CSS display value to set.
   * @private
   */
  static #toggle(value) {
    const spinner = document.getElementById('simpl4u_spinner_backdrop');
    if (spinner) {
      spinner.style.display = value;
    }
  }
}
