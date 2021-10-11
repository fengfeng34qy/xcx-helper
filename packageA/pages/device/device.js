
var RequestHelper = require('../../../utils/requestHelper');
var utils = require('../../../utils/util')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   deviceList: app.globalData.deviceData
    // })
    this.loadDeviceAsync()
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
    let result = await RequestHelper.sendAsync(request)
    
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

      this.setData({
        deviceList: app.globalData.deviceData
      })

      // 设置首页滚动提示语
      // this.setData({
      //   swiperList: result.data.body.codeTips
      // })
    } else {
      wx.showToast( {title: checkResult.message} )
    }
  },

  async toDevicePage(e) {
    let deviceId = e.currentTarget.dataset.deviceId
    wx.navigateTo({
      url: `/packageA/pages/device-result/device-result?deviceId=${deviceId}`
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})