// packageA/pages/jianghu/jianghu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = 'wss://www.sunfengfeng.com:8888';
    wxst = wx.connectSocket({
      url: url,
      method: "GET"
    });
    wxst.onOpen(res => {
      console.info('连接打开成功');
      let data = {
        EVENT: 'LOGIN',
        'userid': new Date().getTime(),
        'username': '',
        'nickName': '上官婉儿',
        'content': '',
        'desc': '上官婉儿进来了，此人面目狰狞，浑身杀气，大家离他远点，小心溅一身血。'
      }
      wx.sendSocketMessage({ data: JSON.stringify(data) })
    });
    wxst.onError(res => {
      console.info('连接识别');
      console.error(res);
    });
    wxst.onMessage(res => {
      var data = res.data;
      console.log(JSON.parse(data));
      JSON.parse(data)
      wx.showToast({
        title: '有人发消息了',
        icon: "none",
        duration: 2000
      })
    });
    wxst.onClose(() => {
      console.info('连接关闭');
    });
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