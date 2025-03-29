const { app, BrowserWindow, screen, globalShortcut } = require('electron');
 const path = require('path');
 const url = require('url');
 
 let mainWindow;
 let originalSize;
 
 function createWindow() {
   mainWindow = new BrowserWindow({
     width: 1600,
     height: 900,
     frame: false, // 이 부분이 리본바와 상단바를 없애는 옵션입니다.
     webPreferences: {
       nodeIntegration: true
     }
   });
 
   originalSize = screen.getPrimaryDisplay().workAreaSize;
 
   const gameUrl = 'http://pie-kkutu.kro.kr/?server=0';
 
   mainWindow.loadURL(url.format({
     pathname: path.join(__dirname, 'index.html'),
     protocol: 'file:',
     slashes: true
   }));
 
   mainWindow.webContents.on('did-finish-load', () => {
     mainWindow.webContents.executeJavaScript(`
       var video = document.createElement('video');
       video.src = '${path.join(__dirname, 'assets', 'intro.webm').replace(/\\/g, "/")}';
       video.width = 1600;
       video.height = 900;
       video.autoplay = true;
       video.onended = function() {
         window.location.href = '${gameUrl}';
       };
       
       // 스케일링을 위한 스타일 추가
       video.style.objectFit = 'cover'; // 또는 'contain'을 사용하여 조절
       
       document.body.appendChild(video);
     `);
   });
   
 
   mainWindow.on('closed', function () {
     mainWindow = null;
   });
 
   // Ctrl+F로 전체 화면 토글
   globalShortcut.register('CommandOrControl+F', () => {
     toggleFullScreen();
   });
 }
 
 app.on('ready', createWindow);
 
 app.on('window-all-closed', function () {
   if (process.platform !== 'darwin') app.quit();
 });
 
 app.on('activate', function () {
   if (mainWindow === null) createWindow();
 });
 
 // 전체 화면 토글 함수
 function toggleFullScreen() {
   if (mainWindow.isFullScreen()) {
     mainWindow.setFullScreen(false);
   } else {
     mainWindow.setFullScreen(true);
   }
 }