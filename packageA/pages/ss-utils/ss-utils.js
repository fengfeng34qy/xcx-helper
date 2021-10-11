let BASECONF = require('../../../utils/baseConfig')
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: {
      swiperItems: [
        {
          src: './images/png/SQLite.png',
          link: './images/png/SQLite.png',
          desc: "SQLiteExpertPersSetup"
        },
        {
          src: './images/png/ILSpy.png',
          link: './images/png/ILSpy.png',
          desc: "ilspy_cn"
        },
        {
          src: './images/png/GZH.png',
          link: './images/png/GZH.png',
          desc: "人民银行14号文件解析工具v2.4"
        },
      ],
      previousMargin: "20px",
      nextMargin: "20px",
      circular: true,
      indicatorDots: true,
      vertical: false,
      autoplay: false,
      interval: 3600,
      duration: 500,
    },
    downloadTask: null,
    progress: 0,
    downloading: false,
    files: [
      {
        path: 'agree/SQLite/',
        fileName: 'SQLiteExpertPersSetup32.zip'
      },
      {
        path: 'agree/SQLite/',
        fileName: 'SQLiteExpertPersSetup64.zip'
      },
      {
        path: 'agree/fsn/',
        fileName: '人民银行14号文件解析工具v2.4.zip'
      },
      {
        path: 'agree/mp3ToOgg/',
        fileName: 'mp3ToOgg.zip'
      },
      {
        path: 'agree/ilspy_cn/',
        fileName: 'ilspy_cn.zip'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  async downloadFile(e) {
    let index = e.currentTarget.dataset.index
    let path = this.data.files[index].path
    let fileName = this.data.files[index].fileName
    app.showLoading('正在下载文件')
    let _this = this

    let rootPath = wx.env.USER_DATA_PATH
    var cachePath = rootPath + "/cache"
    this.setData({
      downloading: true
    })
    // 创建目录
    this.mkdir().then(function(res) {
      // 下载文件
      this.downloadTask = wx.downloadFile({
        url: BASECONF.baseUrl + path + fileName,
        filePath: cachePath + '/' + fileName,
        timeout: 120000,
        success(res) {
          var filePath = res.tempFilePath;
          console.log(res)
          console.log(wx.env.USER_DATA_PATH)
          wx.showToast( {title: '下载完成', mask: true} )
          // wx.openDocument({
          //   filePath: cachePath + '/' + fileName,
          //   success(res) {
          //     console.log(res)
          //     console.log('打开文件成功')
          //   },
          //   fail(err) {
          //     console.log(err)
          //   }
          // })
        },
        fail(error) {
          console.log(error)
        },
        complete() {
          _this.setData({
            downloading: false
          })
        }
      })
      
      // 监听下载进度
      this.downloadTask.onProgressUpdate((res) => {
        console.log('下载进度', res.progress)
        console.log('已经下载的数据长度', res.totalBytesWritten)
        console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        _this.setData({
          progress: res.progress
        })
      })
    })

    
  },

  mkdir(){
    return new Promise(function(resolve, reject) {
      let fm = wx.getFileSystemManager();
      fm.mkdir({
        dirPath: wx.env.USER_DATA_PATH + '/cache',
        recursive: true,
        success: function(res) {
          resolve(res);
        },
        fail: function(err) {
          resolve(err);
        }
      });
    });
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
    console.log('取消下载')
    this.downloadTask && this.downloadTask.abort()
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