'use strict'

import { app, ipcMain, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let popWindow
global.winHwnd = {
  main: 0,
  pop: 0
}
console.log(`111:${process.env.NODE_ENV}`)
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
console.log(`222:${winURL}`)

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 710,
    useContentSize: true,
    width: 1400,
    titleBarStyle: false,
    frame: false,
    transparent: true,
    hasShadow: true,
    show: false,
    maximizable: false,
    title: 'Electron framework',
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      devTools: true,
      webSecurity: false
    }
  })

  global.winHwnd.main = mainWindow.id
  mainWindow.loadURL(winURL)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  popWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    width: 580,
    height: 360,
    resizable: false,
    frame: false,
    transparent: true,
    maximizable: false,
    hasShadow: true,
    closable: true,
    center: true,
    webPreferences: {
      devTools: false,
      webSecurity: false
    }
  })

  global.winHwnd.pop = popWindow.id
  popWindow.loadURL(winURL + '#/popWindow')
  popWindow.on('closed', () => {
    popWindow = null
  })
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
ipcMain.on('min', () => mainWindow.minimize())
ipcMain.on('close', () => app.exit(0))
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

console.log('node:', process.versions.node)
console.log('electron:', process.versions.electron)
console.log('modules:', process.versions.modules)
