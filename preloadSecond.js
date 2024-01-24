// Import the necessary Electron components.
const contextBridge = require("electron").contextBridge;
const ipcRenderer = require("electron").ipcRenderer;

contextBridge.exposeInMainWorld("secondWindowApi", {
  sendToMainWindow: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receiveFromMainWindow: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
