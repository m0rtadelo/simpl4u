import { Config } from './config-service.js';
import { words as ca } from '../assets/i18n/ca.js';
import { words as en } from '../assets/i18n/en.js';
import { words as es } from '../assets/i18n/es.js';

/**
 * LanguageService provides functionality for managing application language settings and translations.
 * It supports subscribing to language changes, setting translations, and retrieving localized strings.
 */
export class LanguageService {
  static #lang = 'en';
  static #subscribers = new Set();
  static #languages = {};

  // constructor() {
  //   Config.storage.loadApp('_lang').then((lang) => {
  //     console.log('LanguageService', lang);
  //     LanguageService.lang = lang || 'en';
  //   });
  // }

  static {
    LanguageService.load();
    LanguageService.#languages = { ca, en, es };
    //document.documentElement.setAttribute('lang', this.#lang);
    //Config.storage.loadApp('_lang')
  }

  static load() {
    Config.storage.loadApp('_lang').then((lang) => {
      LanguageService.lang = lang || 'en';
    });
  }
  /**
   * Subscribes to language changes.
   * 
   * @param {Function} callback - A callback function that will be called whenever the language changes.
   * @returns {Function} A function to unsubscribe the callback.
   */
  static subscribe(callback) {
    LanguageService.#subscribers.add(callback);
    callback(LanguageService.lang);
    return () => LanguageService.#subscribers.delete(callback);
  }

  /**
   * Notifies all subscribers of a language change.
   * 
   * @private
   */
  static #notify() {
    for (const callback of LanguageService.#subscribers) {
      callback(LanguageService.lang);
    }
  }

  /**
   * Gets the current language.
   * 
   * @returns {string} The current language code (e.g., 'en', 'ca', 'es').
   */
  static get lang() {
    return this.#lang;
  }

  /**
   * Sets the current language.
   * 
   * @param {string} value - The new language code (e.g., 'en', 'ca', 'es').
   */
  static set lang(value) {
    const shortLang = value.substring(0, 2);
    if (shortLang !== this.#lang) {
      this.#lang = shortLang;
      LanguageService.#notify();
    }
    Config.storage.saveApp('_lang', this.#lang);
    document.documentElement.setAttribute('lang', shortLang);
  }

  /**
   * Merges additional translations into the existing language definitions.
   * 
   * @param {Object} languages - An object containing language definitions to merge.
   */
  static set(languages) {
    Object.keys(languages).forEach((key) => {
      LanguageService.#languages[key] = { ...LanguageService.#languages[key], ...languages[key] };
    });
  }

  /**
   * Retrieves a localized string for a given key.
   * 
   * @param {string} key - The key for the localized string.
   * @param {Object} [params={}] - An object containing parameters to replace in the localized string.
   * @returns {string} The localized string with parameters replaced, or the key if no translation is found.
   */
  static i18n(key, params = {}) {
    let base = LanguageService.#languages?.[LanguageService.#lang]?.[key] || key;
    if (params) {
      Object.keys(params).forEach((param) => {
        base = base.replace(`{{${param}}}`, params[param]);
      });
    }
    return base;
  }
}
