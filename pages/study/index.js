const UTIL = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    setTimeout(function() {
      wx.showLoading({title: '正在加载...'})
      wx.cloud.callFunction({
        name: 'study',
        data: {},
        success(res) {
          console.log('success')
          _this.setData({
            bookList: res.result.bookList.data.map(function(item, index) {
              item.createTime = UTIL.printDateTime(item.createTime);
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
    // 注释： onLoad方法真机模式调用云函数报错(MiniProgramError)，暂未找到解决方法
    
  },

  // 跳转书籍
  jumpBookHandler(e) {
    console.log(e);
    if (e.currentTarget.dataset.state === false) {
      wx.showToast({
        title: '不可用！',
        icon: 'none'
      })
      return;
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },

  onBindLongPress: function(evt) {
    let url = evt.currentTarget.dataset.url;
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
  },

  onTypeChanged: function(evt) {},

  onRatingChanged: function(evt) {},


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.onLoad()
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 2000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: "豆瓣"
    };
  }
})