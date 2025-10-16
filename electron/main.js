const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = process.argv.includes('--dev');
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })
    if (!isDev) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }
    else {
        mainWindow.loadURL('http://www.localhost:5173')
    }  

}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})