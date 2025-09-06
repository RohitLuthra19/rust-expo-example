const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const express = require('express');

let mainWindow;
let server;

function startLocalServer() {
  return new Promise((resolve, reject) => {
    const expressApp = express();
    const port = 3001;
    
    // Check which build directory exists
    const fs = require('fs');
    const expoDistPath = path.join(__dirname, '../expo-app/dist');
    const expoWebBuildPath = path.join(__dirname, '../expo-app/web-build');
    
    let staticPath;
    if (fs.existsSync(expoDistPath)) {
      staticPath = expoDistPath;
    } else if (fs.existsSync(expoWebBuildPath)) {
      staticPath = expoWebBuildPath;
    } else {
      reject(new Error('No Expo build found. Run: cd expo-app && npm run build:web'));
      return;
    }
    
    console.log('Serving Expo app from:', staticPath);
    
    // Serve static files
    expressApp.use(express.static(staticPath));
    
    // Handle SPA routing - serve index.html for all routes
    expressApp.get('*', (req, res) => {
      res.sendFile(path.join(staticPath, 'index.html'));
    });
    
    server = expressApp.listen(port, 'localhost', () => {
      console.log(`Local server running at http://localhost:${port}`);
      resolve(`http://localhost:${port}`);
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}`);
        server = expressApp.listen(port + 1, 'localhost', () => {
          resolve(`http://localhost:${port + 1}`);
        });
      } else {
        reject(err);
      }
    });
  });
}

async function createWindow() {
  try {
    const serverUrl = await startLocalServer();
    
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    mainWindow.loadURL(serverUrl);
    
    // Open DevTools for debugging
    mainWindow.webContents.openDevTools();
    
    mainWindow.on('closed', () => {
      mainWindow = null;
      if (server) {
        server.close();
      }
    });
    
  } catch (error) {
    console.error('Failed to start:', error.message);
    app.quit();
  }
}

// IPC handlers
ipcMain.handle('greet', (event, name) => {
  return `Hello ${name} from Electron!`;
});

ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
});

ipcMain.handle('show-dialog', async (event, message) => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Message from Expo',
    message: message,
    buttons: ['OK', 'Cancel']
  });
  return result;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});