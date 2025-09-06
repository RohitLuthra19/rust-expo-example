const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  greet: (name) => ipcRenderer.invoke('greet', name),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  showDialog: (message) => ipcRenderer.invoke('show-dialog', message),
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});