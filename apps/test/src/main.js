/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

ipcMain.handle('get-locale', () => {
  return app.getLocale(); // e.g., "en-US"
});

ipcMain.handle('saveSystem', (event, key, data) => {
  const userProfilePath = app.getPath('userData');
  const filePath = path.join(userProfilePath, key);
  const fileContent = data;

  // Write the file
  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error('Failed to save the file:', err);
    } else {
      console.log('File saved successfully at:', filePath);
    }
  });
});

ipcMain.handle('loadSystem', (event, key) => {
  const userProfilePath = app.getPath('userData');
  const filePath = path.join(userProfilePath, key);
  return fs.readFileSync(filePath, 'utf8');
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'api-electron.js'),
    }
  });

  win.loadFile('index.html');
  win.autoHideMenuBar = true;
  win.setMenuBarVisibility(false);
  console.log(app.getPath('userData'));
  //win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
