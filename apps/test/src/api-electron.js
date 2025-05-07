/* eslint-disable no-undef */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getLocale: () => ipcRenderer.invoke('get-locale'),
  saveSystem: (key, data) => ipcRenderer.invoke('saveSystem', key, data),
  loadSystem: (key) => ipcRenderer.invoke('loadSystem', key),
});
