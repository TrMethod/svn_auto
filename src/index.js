const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
let exec = require("child_process").exec;

console.log(__dirname);
let dataBuf = fs.readFileSync(__dirname + "/config/config.json")
let fileStr = dataBuf.toString();
let fileObj = JSON.parse(fileStr)
console.log(fileObj);


ipcMain.on("r-hello", function (event, data) {

  console.log("ipcMain.on" + data)
  event.reply('m-hello', 'pong')
})

if (require('electron-squirrel-startup')) { 
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
    icon: __dirname + "/image/icon.ico"
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 更新跟踪文件
  ipcMain.on("updateFile", function (event, data) {
    fileObj.file = data;
    fs.writeFileSync(__dirname + "/config/config.json", JSON.stringify(fileObj))
    console.log("updateFile 更新成功！");
    event.reply("updateFile-r", "更新成功！");
    if(data != ""){
      setTimeout(function () {
        exec("svn update " + fileObj.file,{
          maxBuffer: 1024 * 2000
        }, function(err, stdout, stderr) {
            if (err) {
                console.log(err);
                mainWindow.webContents.send('update-info', err.toString())
            } else if (stderr.lenght > 0) {
                
            } else {
                console.log(stdout);
                mainWindow.webContents.send('update-info', stdout.toString())
                setTimeout(function () {
                  fs.writeFileSync(fileObj.file, "\n", {flag:"a"})
                  setTimeout(function () {
                    exec("svn commit -m \"commit\" " + fileObj.file,{
                      maxBuffer: 1024 * 2000
                    }, function(err, stdout, stderr) {
                        if (err) {
                            console.log(err);
                            mainWindow.webContents.send('commit-info', err.toString())
                        } else if (stderr.lenght > 0) {
                            console.log(stderr);
                        } else {
                          console.log(stdout);
                          mainWindow.webContents.send('commit-info', stdout.toString())
                          let date = new Date();
                          fs.writeFileSync(__dirname + "/config/date.txt", date.getMonth()+"-" + date.getDate())
                        }
                    });
                  }, 2000)
                }, 2000)
            }
        });
      }, 2000)
    }
  })

  // 更新跟踪目录
  ipcMain.on("updateDir", function (event, data) {
    fileObj.dir = data;
    fs.writeFileSync(__dirname + "/config/config.json", JSON.stringify(fileObj))
    console.log("updateFile 更新成功！");
    event.reply("updateDir-reply", "更新成功！");
    if(data != ""){
      setTimeout(function () {
        exec("svn update " + fileObj.dir,{
          maxBuffer: 1024 * 2000
        }, function(err, stdout, stderr) {
            if (err) {
                console.log(err);
                mainWindow.webContents.send('update-info', err.toString())
            } else if (stderr.lenght > 0) {
                
            } else {
                console.log(stdout);
                mainWindow.webContents.send('update-info', stdout.toString())
                // commit
              setTimeout(function () {
                exec("svn commit -m \"commit\" " + fileObj.dir,{maxBuffer: 1024 * 2000}, function(err, stdout, stderr) {
                    if (err) {
                        console.log(err);
                        mainWindow.webContents.send('commit-info', err.toString())
                    } else if (stderr.lenght > 0) {
                        console.log(stderr);
                    } else {
                      console.log(stdout);
                      mainWindow.webContents.send('commit-info', stdout.toString())
                      let date = new Date();
                      fs.writeFileSync(__dirname + "/config/date.txt", date.getMonth()+"-" + date.getDate())
                    }
                });
              }, 2000)
            }
        });
      }, 2000)
    }
  })

  // file-info
  setTimeout(function(){
    mainWindow.webContents.send('file-info', fileObj)
  },2000)

  let dateBuf = fs.readFileSync(__dirname + "/config/date.txt")

  let dateStr = dateBuf.toString()

  let currentDate = new Date();

  let dateArr = dateStr.split('-')

  console.log(dateArr);
  if(dateArr.length == 2){
    if(dateArr[0] == currentDate.getMonth() && dateArr[1] == currentDate.getDate()){
      console.log("return");
      setTimeout(function(){
        mainWindow.webContents.send('commit-info', "今日已提交")
      }, 2000)
      return
    }
  }

  if(fileObj.file !== undefined && fileObj.file != "") {
    setTimeout(function () {
      exec("svn update " + fileObj.file,{
        maxBuffer: 1024 * 2000
      }, function(err, stdout, stderr) {
          if (err) {
              console.log(err);
              mainWindow.webContents.send('update-info', err.toString())
          } else if (stderr.lenght > 0) {
              
          } else {
              console.log(stdout);
              mainWindow.webContents.send('update-info', stdout.toString())
              setTimeout(function () {
                fs.writeFileSync(fileObj.file, " ", {flag:"a"})
                setTimeout(function () {
                  exec("svn commit -m \"commit\" " + fileObj.file,{
                    maxBuffer: 1024 * 2000
                  }, function(err, stdout, stderr) {
                      if (err) {
                          console.log(err);
                          mainWindow.webContents.send('commit-info', err.toString())
                      } else if (stderr.lenght > 0) {
                          console.log(stderr);
                      } else {
                        console.log(stdout);
                        mainWindow.webContents.send('commit-info', stdout.toString())
          
                        let date = new Date();
                        fs.writeFileSync(__dirname + "/config/date.txt", date.getMonth()+"-" + date.getDate())
                      }
                  });
                }, 2000)
              }, 5000)
          }
      });
    }, 10000)
  }

  if(fileObj.dir !== undefined && fileObj.dir != "") {
    setTimeout(function () {
      exec("svn update " + fileObj.dir,{
        maxBuffer: 1024 * 2000
      }, function(err, stdout, stderr) {
          if (err) {
              console.log(err);
              mainWindow.webContents.send('update-info', err.toString())
          } else if (stderr.lenght > 0) {
              
          } else {
              console.log(stdout);
              mainWindow.webContents.send('update-info', stdout.toString())
              // commit
              setTimeout(function () {
                exec("svn commit -m \"commit\" " + fileObj.dir,{maxBuffer: 1024 * 2000}, function(err, stdout, stderr) {
                    if (err) {
                        console.log(err);
                        mainWindow.webContents.send('commit-info', err.toString())
                    } else if (stderr.lenght > 0) {
                        console.log(stderr);
                    } else {
                      console.log(stdout);
                      mainWindow.webContents.send('commit-info', stdout.toString())
                      let date = new Date();
                      fs.writeFileSync(__dirname + "/config/date.txt", date.getMonth()+"-" + date.getDate())
                    }
                });
              }, 2000)
          }
      });
    }, 3000)
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});






