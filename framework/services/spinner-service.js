export class SpinnerService {
  static show() {
    SpinnerService.#toggle('flex');
  }

  static hide() {
    SpinnerService.#toggle('none');
  }

  static #toggle(value) {
    const spinner = document.getElementById('simpl4u_spinner_backdrop');
    if (spinner) {
      spinner.style.display = value;
    }
  }
}