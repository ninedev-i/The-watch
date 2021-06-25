const {app, ipcMain, BrowserWindow, Notification, Tray, Menu} = require('electron');
import is_dev from 'electron-is-dev';
import dotenv from 'dotenv';
import {join} from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

// global.selector = '';
// global.isFirstRender = false;

interface IBrowserWindowOpts {
  width?: number;
  height?: number;
  show?: boolean;
  autoHideMenuBar?: boolean;
  webPreferences: {
    webviewTag?: boolean;
    devTools?: boolean;
    nodeIntegration?: boolean;
    preload?: string;
  },
}

class createWin {
  win: typeof BrowserWindow;
  tray: typeof Tray;
  remoteWin: typeof BrowserWindow;

  constructor() {
    app.whenReady().then(() => {
      this.win = this.createWindow();
    });

    app.whenReady().then(() => {
      this.tray = new Tray('logo.png')
      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'Open app',
          type: 'normal',
          click: () => {
            this.win.open();
          }
        },
        {
          label: 'Close app',
          type: 'normal',
          click: () => app.quit()
        }
      ]);

      this.tray.setToolTip('Web parser');
      this.tray.setContextMenu(contextMenu);

      this.tray.on('click', () => this.tray.popUpContextMenu());
    })

    // FIXME: разобраться почему нельзя не закрывать, а сворачивать
    app.on('before-quit', () => {
      this.tray.destroy();
      if (!this.remoteWin?.destroyed) {
        this.remoteWin.destroy();
      }
      // this.win.hide();
    });

    ipcMain.handle('show-notification', (ev: Event, message: string) => {
      this.showNotification(message);
    });

    // ipcMain.handle('set-selector', (ev: Event, value: string) => {
    //   global.selector = value;
    // });

    ipcMain.handle('set-is-first-render', (ev: Event, value: boolean) => {
      //@ts-ignore
      global.isFirstRender = value;
    });

    ipcMain.handle('create-window', (ev: Event, url: string) => {
      this.remoteWin = this.createWindow(url);
    });

    ipcMain.handle('close-window', () => {
      this.remoteWin.destroy();
    });
  }

  createWindow(openedUrl?: string) {
    let win;
    let url;
    const opts: IBrowserWindowOpts = {
      width: 800,
      height: 600,
      autoHideMenuBar: true,
      // show: false,
      webPreferences: {
        webviewTag: true,
        devTools: true,
        nodeIntegration: true,
      },
    };

    if (openedUrl) {
      url = openedUrl;
      opts.webPreferences.preload = `file://${join(__dirname, './preloadSetter.ts')}`;
    } else {
      url = is_dev
        ? `http://localhost:${process.env.PORT}`
        : `file://${join(__dirname, '../../dist/render/index.html')}`;
    }

    win = new BrowserWindow(opts);

    win.loadURL(url);
    win.openDevTools();

    return win;
  }

  showNotification(message: string) {
    const opts = {
      title: 'The difference is found',
      body: message,
      icon: 'icon.ico',
      // click: () => openSite(),
    }
    new Notification(opts).show();
  }
}

app.whenReady().then(() => new createWin());


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    new createWin();
  }
})
