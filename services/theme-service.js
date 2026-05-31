import { StorageService } from './storage-service.js';

/**
 * Manages the theme of the application.
 */
export class ThemeService {
  /**
   * @type {string}
   * @private
   */
  static #_theme = '';

  /**
   * Initializes the theme service by loading the saved theme or setting the preferred system theme.
   */
  static {
    ThemeService.load();
    
    // Add event listener for changes in system color preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const systemTheme = e.matches ? 'dark' : 'light';
      ThemeService.theme = systemTheme;
    });
  }

  /**
   * Loads the saved theme from storage and sets it if available, otherwise sets the preferred system theme.
   */
  static load() {
    StorageService.loadApp('_theme').then((theme) => {
      this.theme = theme || this.#getPreferredTheme();
    });
  }

  /**
   * Sets the application's theme to dark or light.
   *
   * @param {string} mode - The new theme mode ('dark' or 'light').
   */
  static set theme(mode) {
    document.documentElement.setAttribute('data-bs-theme', mode);
    StorageService.saveApp('_theme', mode);
    ThemeService.#_theme = mode;
  }

  /**
   * Gets the current application theme.
   *
   * @returns {string} The current theme ('dark' or 'light').
   */
  static get theme() {
    return ThemeService.#_theme;
  }

  /**
   * Retrieves the preferred system theme based on media query.
   *
   * @private
   * @returns {string} The preferred system theme ('dark' or 'light').
   */
  static #getPreferredTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Toggles the application theme between dark and light.
   */
  static switchTheme() {
    ThemeService.theme = (ThemeService.theme === 'dark' ? 'light' : 'dark');
  }
}
