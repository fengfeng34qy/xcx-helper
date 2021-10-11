const app = getApp()
var RequestHelper = require('../../../utils/requestHelper.js');
var utils = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    
    this.loadMarkdown('basic') // 初始化加载 README.dm

  },

  async getMarkdown(e) {
    let mark = e.currentTarget.dataset.name
    this.loadMarkdown(mark)
    this.scrollPosition(700)
  },

  /**
   * 加载md文件
   */
  async loadMarkdown(mark) {
    let request = {
      method: 'get',
      url: 'markdownfiles/git/' + mark + '.md'
    }
    let result = await RequestHelper.sendAsync(request)

    // let checkFlag = null;
    // if (typeof result.data === 'string') {
    //   checkFlag = await utils.checkTextResult(result.data)
    // }
    // if (checkFlag.CheckCode !== 87017) {
      
      let data = app.towxml(result.data, 'markdown', {});

      wx.showToast( {title: '正在渲染', icon: 'loading', mask: true} )
      this.setData({
        article: data
      }, function() {
        wx.hideToast()
      })
    // } else {
    //   wx.showToast( {title: checkResult.message} )
    // }
  },

  scrollPosition(pos) {
    wx.pageScrollTo({
      scrollTop: pos  // #the-id节点的下边界坐标  
    })
  },
  backtop() {
    this.scrollPosition(0)
  },

  __bind_touchstart() {},
  __bind_touchmove() {},
  __bind_touchend() {},

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