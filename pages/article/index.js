const UTIL = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let _this = this;
    setTimeout(function() {
      wx.showLoading({title: '正在加载...'})
      wx.cloud.callFunction({
        name: 'getArticleList',
        data: {},
        success(res) {
          console.log('success')
          _this.setData({
            articleList: res.result.result.data.map(function(item, index) {
              item.date = UTIL.printDate(item.date, true);
              return item;
            })
          })
        },
        fail(error) {
          console.log(error)
          wx.showToast({
            title: JSON.stringify(error),
          })
        },
        complete() {
          console.log('complete')
          wx.hideLoading()
        }
      })
    }, 20);
  },

  jumpMarkdownHandler(e) {
    console.log(e);
    let value = e.currentTarget.dataset.page
    wx.navigateTo({
      url: `/packageA/pages/md-render/index?markdown=${value}`
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