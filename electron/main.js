const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = process.argv.includes('--dev');
const { ipcMain } = require('electron');
const fs = require('fs');
const { spawn } = require('child_process');


if (isDev) {
  try {
    require('electron-reload')(path.join(__dirname, 'dist'), {
      electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
    });
  } catch (error) {
    console.warn('electron-reload 加载失败:', error);
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'pre.js') // 确保路径正确
      
    },
    
  })
  //mainWindow.webContents.openDevTools()
  mainWindow.setMenu(null)
  console.log('isDev:', isDev);
  if (!isDev) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  } else {
    mainWindow.loadURL('http://localhost:5173') // 修正了 URL（移除了 www.）
  }  
}

ipcMain.handle('run-python-code', async (event, code) => {
  return new Promise((resolve, reject) => {
    try {
      const tempDir = require('os').tmpdir();
      const tempFilePath = path.join(tempDir, 'temp_script.py');
      
      
      fs.writeFileSync(tempFilePath, code, 'utf8');
      
      
      const pythonProcess = spawn('python', [tempFilePath]);
      
      let stdout = '';
      let stderr = '';
      
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      pythonProcess.on('close', (exitCode) => {
        
        try {
          fs.unlinkSync(tempFilePath);
        } catch (error) {
          console.warn('无法删除临时文件:', error);
        }
        
        resolve({
          stdout: stdout,
          stderr: stderr,
          exitCode: exitCode,
          success: exitCode === 0
        });
      });
      
      pythonProcess.on('error', (error) => {
        
        try {
          fs.unlinkSync(tempFilePath);
        } catch (error) {
          console.warn('无法删除临时文件:', error);
        }
        
        reject({
          error: error.message,
          success: false
        });
      });
      
    } catch (error) {
      reject({
        error: error.message,
        success: false
      });
    }
  });
});

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
