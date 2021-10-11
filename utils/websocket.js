// 聊天室
// var url = 'wss://127.0.0.1:8888';
// var url = 'ws://127.0.0.1';
var url = 'wss://www.sunfengfeng.com:8888';
// var utils = require('./util.js');

function connect(user,func1, func2) {

  wx.connectSocket({
    url: url,
    header:{'content-type': 'application/json'},
    success: function () {
      console.log('连接成功~')
    },
    fail: function () {
      console.log('连接失败~')
    } 
  })

  wx.onSocketOpen(function (res) {
    wx.showToast({
      title: '连接成功~',
      icon: "success",
      duration: 2000
    })

    //监听服务器消息返回
    wx.onSocketMessage(func2);//func回调可以拿到服务器返回的数据

    func1()
     
  });

  wx.onSocketError(function (res) {
    wx.showToast({
      title: '信道连接失败，请检查！',
      icon: "none",
      duration: 2000
    })
  });

  wx.onSocketClose(function(res) {
    console.log('连接断开');
  })
}
//发送消息
function sendSocketMessage(msg) {
  wx.sendSocketMessage({ 
    data: msg 
  });
}
module.exports = {
  connect: connect,
  sendSocketMessage: sendSocketMessage
}