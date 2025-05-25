export class SpinnerService {
  static debounceTime = 200;
  static ref;

  static show() {
    clearTimeout(SpinnerService.ref);
    SpinnerService.ref = setTimeout(() => {
      SpinnerService.#toggle('flex');
    }, SpinnerService.debounceTime);
  }

  static hide() {
    clearTimeout(SpinnerService.ref);
    SpinnerService.#toggle('none');
  }

  static #toggle(value) {
    const spinner = document.getElementById('simpl4u_spinner_backdrop');
    if (spinner) {
      spinner.style.display = value;
    }
  }
}
