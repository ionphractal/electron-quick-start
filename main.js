const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow,
  hiddenWindow,
  brokenHiddenWindow,
  brokenHiddenWindow2,
  brokenHiddenWindow3

function createWindow () {
  console.log('createWindow');
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  hiddenWindow = new BrowserWindow({width: 800, height: 600, show: false})
  hiddenWindow.loadURL(url.format({ pathname: path.join(__dirname, 'index-hidden.html'), protocol: 'file:', slashes: true }))
  hiddenWindow.on('ready-to-show', () => console.log('hiddenWindow on ready-to-show'))
  hiddenWindow.on('show', () => console.log('hiddenWindow on show'))

  // This window shows on MacOS and does not trigger ready-to-show event
  brokenHiddenWindow = new BrowserWindow({width: 800, height: 600, show: false, parent: mainWindow})
  brokenHiddenWindow.loadURL(url.format({ pathname: path.join(__dirname, 'index-broken1.html'), protocol: 'file:', slashes: true }))
  brokenHiddenWindow.on('ready-to-show', () => console.log('brokenHiddenWindow on ready-to-show'))
  brokenHiddenWindow.on('show', () => console.log('brokenHiddenWindow on show'))
  brokenHiddenWindow.on('hide', () => console.log('brokenHiddenWindow on hide'))

  // Setting parent window latent fixes not triggering ready-to-show but makes the window show even though it is set to false
  brokenHiddenWindow2 = new BrowserWindow({width: 800, height: 600, show: false})
  brokenHiddenWindow2.loadURL(url.format({ pathname: path.join(__dirname, 'index-broken2.html'), protocol: 'file:', slashes: true }))
  brokenHiddenWindow2.on('ready-to-show', () => {
    console.log('brokenHiddenWindow2 on ready-to-show')
    brokenHiddenWindow2.setParentWindow(mainWindow)
  })
  brokenHiddenWindow2.on('show', () => console.log('brokenHiddenWindow2 on show'))
  brokenHiddenWindow2.on('hide', () => console.log('brokenHiddenWindow2 on hide'))

  // Setting parent window latent fixes not triggering ready-to-show but makes the window show even though it is set to false
  brokenHiddenWindow3 = new BrowserWindow({width: 800, height: 600, show: false})
  brokenHiddenWindow3.loadURL(url.format({ pathname: path.join(__dirname, 'index-broken3.html'), protocol: 'file:', slashes: true }))
  brokenHiddenWindow3.on('ready-to-show', () => {
    console.log('brokenHiddenWindow3 on ready-to-show')
    brokenHiddenWindow3.setParentWindow(mainWindow)
    // using hide() afterwards makes it hide finally, yet the hide event is not triggered
    console.log('hide brokenHiddenWindow3')
    brokenHiddenWindow3.hide()
  })
  brokenHiddenWindow3.on('show', () => console.log('brokenHiddenWindow3 on show'))
  brokenHiddenWindow3.on('hide', () => console.log('brokenHiddenWindow3 on hide'))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
