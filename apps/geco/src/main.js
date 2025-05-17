/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron');
const path = require('path');
const fs = require('fs');
const { create } = require('domain');

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
    width: 1300,
    height: 900,
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

app.whenReady().then(() => {
  const currentMenu = Menu.getApplicationMenu();
  const menuTemplate = currentMenu ? currentMenu.items.map(item => item) : [];

  // Find the App menu (typically the first one on macOS)
  const appMenu = menuTemplate.find(item => item.role === 'filemenu');
  if (appMenu) {
    // Insert the custom item near the top (after About)
    appMenu.submenu.insert(0, new MenuItem({
      label: 'New Window',
      click: createWindow,
      accelerator: 'CmdOrCtrl+N',
    }));
  }

  // Apply the updated menu
  const updatedMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(updatedMenu);  
  createWindow();
}
);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
