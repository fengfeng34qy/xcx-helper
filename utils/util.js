const app = getApp()

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//数组去重
function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}

// 微信安全检查(文本)
function checkTextResult(text, flag) {
  let checkText = typeof text !== 'string' ? JSON.stringify(text) : text
  if (!flag) {
    app.showLoading('正在安全检查')
  }
  return new Promise((reslove, reject)=> {
    wx.cloud.callFunction({
      name: 'ContentCheck',
      data: {
        msg: checkText,
      },
      success(res) {
        console.log(res.result)
        if (res.result.errCode === 87014) {
          reslove({CheckCode: 87017, message: '内容违规'})
        } else {
          reslove({CheckCode: 0, message: '成功'})
        }
      },
      fail(error) {
        reslove({CheckCode: 87017, message: '通讯失败'})
      },
      complete() {
        if (!flag) {
          app.hideLoading()
        }
      }
    })
  })
}

function uploadFile(file) {
  return new Promise((reslove, reject) => {
    wx.uploadFile({
      filePath: file.filePath,
      name: file.name,
      url: file.url,
      success(res) {
        reslove(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

module.exports = {
  contains,
  checkTextResult,
  uploadFile
}

module.exports.printDateTime = function(val, seconds = false, simple = false) {
  var first, second;

  if (simple)
    first = "Y-M-D";
  else
    first = "Y年M月D日";

  if (seconds)
    second = "h:m:s";
  else
    second = "h:m";

  return formatTime(val, `${first} ${second}`);
}

module.exports.printDate = function(val, simple = false) {
  if (simple)
    return formatTime(val, "Y/M/D");
  else
    return formatTime(val, "Y年M月D日");
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * val: Date可解析的时间
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
function formatTime(val, format) {
  function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(val);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

module.exports.initToWxml = function(page) {
  page["event_bind_tap"] = function(evt) {
    let elem = evt.target.dataset._el;
    if (elem.tag == "navigator") {
      let url = elem.attr.href;
      if (url) {
        wx.setClipboardData({
          data: url,
          success(res) {
            wx.showToast({
              title: "链接已复制到剪贴板，请在浏览器中打开",
              icon: "none"
            });
          }
        });
      }
    }
  };
}

module.exports.seelp = function(ms) {
  return new Promise(function(reslove, reject) {
    setTimeout(function() {
      reslove(1)
    }, ms)
  })
}

module.exports.getTucaoData = function() {
  let data = null;
  try {
    const res = wx.getSystemInfoSync();
    const version = getApp().data.version;
    data = {
      "os": `${res.brand} ${res.model} ${res.system}`,
      "clientVersion": `${res.version} ${res.SDKVersion} ${version}`,
      "clientInfo": JSON.stringify(res)
    };

  } catch (e) {
    console.error(e);
  }

  return {
    appId: "wx8abaf00ee8c3202e",
    extraData: {
      id: 53232,
      customData: data
    }
  }
}