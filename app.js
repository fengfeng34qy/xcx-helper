// const Towxml = require('./towxml/main.js');     //引入towxml库
//app.js
App({
  data: {
    device: null,
    version: "1.2.0",
    user: null,
    readOnly: true
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'demo01env-d0ykf', //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        traceUser: true,
      })
    }
    this.globalData = {}
    this.session = {}
  },
  towxml:require('/towxml/index'),
  // towxml:new Towxml(),
  showLoading(title='正在加载中...', mask=true) {
    wx.showLoading({
      title: title,
      mask: mask
    })
  },
  hideLoading() {
    wx.hideLoading()
  },
  onLoad() {
    console.log('app.js加载完毕')
  },
  onHide() {},
  onShow() {}
})
