"use strict";

const electronApp = require("electron").app;
const BrowserWindow = require("electron").BrowserWindow;
const electronIpcMain = require("electron").ipcMain;

const nodePath = require("path");
const { exec } = require("child_process");
let window;
let secondWindow;
function createWindow() {
  window = new BrowserWindow({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: nodePath.join(__dirname, "preload.js"),
      devTools: true,
    },
  });

  window.loadFile("index.html").then(() => {
    window.show();
  });

  return window;
}

function createSecondWindow() {
  secondWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: nodePath.join(__dirname, "preloadSecond.js"),
      devTools: true,
    },
  });

  secondWindow.loadFile("second.html").then(() => {
    secondWindow.show();
  });
}

electronApp.whenReady().then(() => {
  createWindow();
  createSecondWindow();
});

electronApp.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electronApp.quit();
  }
});

/** shell script compiler */
// electronIpcMain.on("runScript", () => {
//   // Windows
//   let script = nodeChildProcess.spawn("cmd.exe", [
//     "/c",
//     "c:\\Users\\user\\Projects\\electron-fs\\dosyaTransfer.bat",
//     "arg1",
//     "arg2",
//   ]);

//   // MacOS & Linux
//   // let script = nodeChildProcess.spawn('bash', ['test.sh', 'arg1', 'arg2']);

//   console.log("PID: " + script.pid);

//   script.stdout.on("data", (data) => {
//     console.log("stdout: " + data);
//   });

//   script.stderr.on("data", (err) => {
//     console.log("stderr: " + err);
//   });

//   script.on("exit", (code) => {
//     console.log("Exit Code: " + code);
//   });
// });

// Shell betiğini çalıştır
electronIpcMain.on("runScript", () => {
  exec(
    "sh C:\\Users\\user\\Projects\\electron-fs\\transfer.sh",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Hata oluştu: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Hata çıktısı: ${stderr}`);
        return;
      }
      console.log(`Başarıyla kopyalandı: ${stdout}`);
    }
  );
});

electronIpcMain.on("message-to-main", (event, data) => {
  console.log("Received message in main :", data);
});

electronIpcMain.on("message-to-second", (event, data) => {
  console.log("Received message in second :", data);
});
