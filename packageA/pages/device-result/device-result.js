var RequestHelper = require('../../../utils/requestHelper')
var utils = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    DeviceMd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    let deviceId = options.deviceId;
    console.log(deviceId)
    let request = {
      method: 'get',
      timeout: 6000,
      url: 'markdownfiles/device/' + deviceId + '.md'
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
      console.log(result)
      let data = app.towxml(result.data,'markdown',{
				// theme:'dark',
			});
      console.log(data);
      wx.showLoading({title: '正在渲染',mask: true})
      this.setData({
        DeviceMd: data
      }, function() {
        wx.hideLoading()
      })
      
    } else {
      wx.showToast( {title: checkResult.message} )
    }
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

  },

  /**
   * 屏蔽markdown警告
   */
  __bind_touchstart() {},
  __bind_touchmove() {},
  __bind_touchend() {},
  __bind_tap() {},
})