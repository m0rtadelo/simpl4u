export class FileService {
  /**
   * Uses browser integrated method to download the generated file
   * @param {string} filename The filename
   * @param {any} data The data to be in the file
   * @returns void
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
    } catch (error) {}
  }
}
