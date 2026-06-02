/**
 * FileService provides methods for file operations, including downloading files in the browser
 * and performing file system operations via Electron's main process.
 * The download method uses standard browser APIs; file system operations rely on IPC handlers.
 */
export class FileService {
  /**
   * Uses browser integrated method to download the generated file
   * @param {string} filename - The filename
   * @param {any} data - The data to be in the file
   * @returns {void}
   */
  static download(filename, data) {
    try {
      const blob = new Blob([data], { type: 'text/csv' });
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    } catch (error) {
      console.warn('FileService.download failed', error);
    }
  }

  /**
   * Write a file via the Electron main process.
   * This calls the `writeFile` IPC handler exposed in the preload script
   * and returns a promise that resolves to `true` on success or `false` on error.
   *
   * @param {string} path - Destination file path
   * @param {string|Uint8Array|Buffer} data - File content
   * @param {object} [options] - Optional write options (encoding, mode, flag). Example: `{ encoding: 'utf8', mode: 0o666, flag: 'w' }`.
   * @returns {Promise<boolean>} Promise resolving to operation success
   */
  static writeFileSync(path, data, options) {
    if (typeof window.api === 'undefined') return Promise.resolve(false);
    return window.api.writeFile(path, data, options);
  }

  /**
   * Create directory
   * @param {string} dirPath - Directory path to create
   * @param {object} options - Optional options such as `{ recursive: true }` to create parent directories as needed.
   * @returns {Promise<boolean>}
   */
  static mkdir(dirPath, options) {
    if (typeof window.api === 'undefined') return Promise.resolve(false);
    return window.api.mkdir(dirPath, options);
  }

  /**
   * Show a folder chooser dialog and return the selected directory path.
   * @param {object} [options] - Optional dialog options such as title.
   * @returns {Promise<string|null>} Selected folder path or null when cancelled.
   */
  static selectDirectory(options) {
    if (typeof window.api === 'undefined') return Promise.resolve(null);
    return window.api.selectDirectory(options);
  }

  /**
   * List directory entries
   * @param {string} dirPath - Directory path to list
   * @returns {Promise<string[]|null>} Array of directory entry names or null if an error occurs
   */
  static ls(dirPath) {
    if (typeof window.api === 'undefined') return Promise.resolve(null);
    return window.api.ls(dirPath);
  }

  /**
   * Copy file or directory
   * @param {string} source - Source file or directory path
   * @param {string} destination - Destination file or directory path
   * @param {object} [options] - Optional options such as `{ recursive: true, force: true }` to copy directories recursively and overwrite.
   * @returns {Promise<boolean>} Promise resolving to `true` on success or `false` on error
   */
  static cp(source, destination, options) {
    if (typeof window.api === 'undefined') return Promise.resolve(false);
    return window.api.cp(source, destination, options);
  }

  /**
   * Remove file or directory (rm)
   * @param {string} targetPath - Path of the file or directory to remove
   * @param {object} [options] - Optional options such as `{ recursive: true, force: true }` to remove directories recursively.
   * @returns {Promise<boolean>} Promise resolving to `true` on success or `false` on error
   */
  static rm(targetPath, options) {
    if (typeof window.api === 'undefined') return Promise.resolve(false);
    return window.api.rm(targetPath, options);
  }

  /**
   * Remove directory (rmdir)
   * @param {string} dirPath - Directory path to remove
   * @param {object} [options] - Optional options such as `{ recursive: true }` to remove non-empty directories when supported.
   * @returns {Promise<boolean>} Promise resolving to `true` on success or `false` on error
   */
  static rmdir(dirPath, options) {
    if (typeof window.api === 'undefined') return Promise.resolve(false);
    return window.api.rmdir(dirPath, options);
  }

  /**
   * Read a file via the Electron main process.
   * Returns the file contents as a string (using provided encoding) or `null` on error.
   * @param {string} path - Path of the file to read
   * @param {string} [encoding='utf8'] - Text encoding to use (e.g., 'utf8', 'base64'). Use `null` to get a Buffer if implemented.
   * @returns {Promise<string|null>} File contents or `null` when an error occurs
   */
  static readFile(path, encoding) {
    if (typeof window.api === 'undefined') return Promise.resolve(null);
    return window.api.readFile(path, encoding);
  }
}

