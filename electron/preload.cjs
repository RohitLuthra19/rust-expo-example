const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loading...');

contextBridge.exposeInMainWorld('electronAPI', {
  greet: (name) => {
    console.log('electronAPI.greet called with:', name);
    return ipcRenderer.invoke('greet', name);
  },
  openExternal: (url) => {
    console.log('electronAPI.openExternal called with:', url);
    return ipcRenderer.invoke('openExternal', url);
  }
});

console.log('Preload script loaded, electronAPI exposed');