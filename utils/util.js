const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const utilReadFile = (option) => {
    const FileSystemManager = wx.getFileSystemManager();
    return new Promise((resove, reject)=>{
        //根据图片路径转成base64码
        FileSystemManager.readFile({
            success: resove,
            fail: reject,
            ...option
        });
    });
}

module.exports = {
    formatTime: formatTime,
    utilReadFile
}
