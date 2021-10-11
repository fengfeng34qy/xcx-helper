
var RequestHelper = require('../../utils/requestHelper');
var utils = require('../../utils/util.js')

//index.js
const app = getApp()

Page({
  data: {
    article: {},
    swiperList: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    codeTipWidth: '',
    broadcast_arr: {
      speed: 4, //滚动速度，每秒2.8个字
      font_size: "16", //字体大小(px)
      text_color: "#ffffff", //字体颜色
      back_color: "#269e9e", //背景色
    }
  },

  async onLoad(option) {
    this.loadMarddown('README')
    this.login()
  },

  /**
   * 加载md文件
   */
  async loadMarddown(mark) {
    let request = {
      method: 'get',
      timeout: 6000,
      url: 'markdownfiles/' + mark + '.md'
    }
    let result = await RequestHelper.sendAsync(request)
    
    let checkResult = null; // 文本内容检查
    if (result.ReturnCode !== '000000') {
      wx.showToast({title: result.ReturnMessage})
      return;
    } else {
      // checkResult = await utils.checkTextResult(result.data)
    }

    // if (checkResult.CheckCode !== 87017) {
      let data = app.towxml(result.data,'markdown',{
				// theme:'dark',  // 主题
				events:{
					tap:e => {
						console.log('tap',e);
					},
					change:e => {
						console.log('todo',e);
					}
				}
			});
      wx.showLoading({title: '正在渲染...'})
      this.setData({
        article: data
      }, function() {
        wx.hideLoading()
      })
    // } else {
    //   wx.showToast( {title: checkResult.message} )
    // }
  },

  /**
   * 加载外设调用
   */
  async loadDeviceAsync() {
    let request = {
      timeout: 6000,
      url: 'wxapi',
      headers: { // 请求头设置，（微信云开发数据APi采用application/json格式入参，否则导致47001错误）
          "Content-Type":"application/json; charset=utf-8"
      },
      data: {
        service_code: '1002',
      },
      success(res) {
        console.log(res)
      },
      fail(error) {
        console.log(error)
      }
    }
    let result = await RequestHelper.sendNonMaskAsync(request)
    
    let checkResult = null;
    if (result.ReturnCode !== '000000') {
      wx.showToast({title: result.ReturnMessage})
      return;
    } else {
      checkResult = await utils.checkTextResult(result.data)
    }

    if (checkResult.CheckCode !== 87017) {

      // 设置外设调用列表
      app.globalData.deviceData = result.data.body.deviceData

      // 设置首页滚动提示语
      this.setData({
        swiperList: result.data.body.codeTips
      })
    } else {
      wx.showToast( {title: checkResult.message} )
    }
  },

  /* login */
  login() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: (res) => {
        console.log(res)
        app.globalData.openid = res.result.openid
        this.setData({
          swiperList: res.result.tips
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '登录失败'
        })
      }
    })
  },

  /**
   * 跳转语音合成页面
   */
  async goSpeechMakePage() {
    wx.navigateTo({
      url: '/packageA/pages/speech-make/speech-make'
    })
  },

  /**
   * 跳转es6入门页面
   */
  async goEs6Page() {
    wx.navigateTo({
      url: '/packageA/pages/es6/es6'
    })
  },

  /**
   * 扫一扫
   */
  handlerScanQRCode() {
    wx.scanCode({
      success: (res) => {
        const { result } = res;
        console.log(res);
        // let category = JSON.stringify(result)
        let category = encodeURIComponent(result)
        wx.navigateTo({
          url: `/packageA/pages/scan/scan?result=${category}`
        })
      },
    })
  },

  jumpAppletHandler(e) {
    wx.navigateToMiniProgram({
      appId: 'wx582c4dd6b2518a27',
      path: '',
      shortLink: '#小程序://世纪有缘/首页/XWOiryEYXywaHFy',
      envVersion: 'release',  // develop-开发版 trial-体验版 release-正式版
      success: () => {},
      fail: () => {},
      complete: () => {},
    })
  },

  /* 跳转markdown渲染页面 */
  jumpMarkdownHandler(e) {
    console.log(e);
    let value = e.currentTarget.dataset.markdown
    // value = encodeURIComponent(value)
      wx.navigateTo({
        url: `/packageA/pages/md-render/index?markdown=${value}`
      })
  },

  /**
   * 没有开发完成
   */
  NoFinish() {
    wx.showToast( {title: '正在开发中...', icon: 'none'} )
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.onLoad()
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 2000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onShareTimeline() {
    
  },

  /**
   * 屏蔽markdown警告
   */
  __bind_touchstart() {},
  __bind_touchmove() {},
  __bind_touchend() {},
  __bind_tap() {},
})
