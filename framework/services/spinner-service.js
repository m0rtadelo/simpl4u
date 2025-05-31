export class SpinnerService {
  static debounceTime = 200;
  static minDisplayTime = 300;
  static ref;
  static shownAt = null;
  static hideTimeout = null;

  static show() {
    clearTimeout(SpinnerService.ref);
    clearTimeout(SpinnerService.hideTimeout);
    SpinnerService.ref = setTimeout(() => {
      SpinnerService.#toggle('flex');
      SpinnerService.shownAt = Date.now();
    }, SpinnerService.debounceTime);
  }

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

  static #toggle(value) {
    const spinner = document.getElementById('simpl4u_spinner_backdrop');
    if (spinner) {
      spinner.style.display = value;
    }
  }
}
