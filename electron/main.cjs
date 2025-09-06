const { app, BrowserWindow, shell, ipcMain, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: false,
    },
  });

  // Load from dev server in development, static files in production
  if (process.env.NODE_ENV === 'development') {
    const devPort = process.env.EXPO_DEV_PORT || '8081';
    const devUrl = `http://localhost:${devPort}`;
    console.log(`Loading from dev server: ${devUrl}`);
    win.loadURL(devUrl).catch((error) => {
      console.error('Failed to load dev server, falling back to static files:', error);
      win.loadFile(path.join(__dirname, '../expo-app/dist/index.html')).catch(console.error);
    });
  } else {
    win.loadFile(path.join(__dirname, '../expo-app/dist/index.html')).catch(console.error);
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
  
  // Temporarily enable DevTools in production for debugging
  win.webContents.openDevTools();
  
  // Add error handling for React errors
  win.webContents.on('console-message', (event, level, message) => {
    if (message.includes('React error') || message.includes('Uncaught Error')) {
      console.log('React Error detected:', message);
    }
  });
}

// IPC handler for greet
ipcMain.handle('greet', (event, name) => `Hello, ${name}!`);
ipcMain.handle('openExternal', (event, url) => shell.openExternal(url));

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});