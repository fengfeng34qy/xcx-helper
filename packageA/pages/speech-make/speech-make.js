
//index.js
const app = getApp()

Page({
  onReady: function (e) {
  },
  data: {
    access_token: '',
    imgageSrc: '',
    spd: '5',
    textareaValue: '',
    items: [
      {value: '0', name: '女生', checked: 'true'},
      {value: '1', name: '男生'},
      {value: '3', name: '度逍遥'},
      {value: '4', name: '度丫丫'}
    ],
    audioSrc: '',
    audioPlaySrc: '',
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  radioChange(e) {
    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }

    this.setData({
      items
    })
  },

  sliderchange(e) {
    this.setData({
      spd: e.detail.value
    })
  },

  bindTextAreaInput(e) {
    const textareaValue = e.detail.value
    this.setData({
      textareaValue: textareaValue
    })
  },

  /* 在线播放 */
  async onlinePlay() {

    let _this = this;

    if (!this.data.textareaValue) {
      wx.showModal({
        content: '你丫的，没有输入文字！',
        confirmText: '确定',
        showCancel: false
      })
      return
    }

    // 微信云函数检查文字是否安全
    let checkTextResult = await this.checkTextResult(this.data.textareaValue)
    if (!checkTextResult) {
      wx.showToast({
        title: '文字违规',
      })
      return;
    }
    
    const spd = this.data.spd
    const per = this.getPer(this.data.items)
    let obj = { spd, per }
    // 发送通讯
    await this.sendAsync(obj, (result)=> {

      // 安全内容检查
      wx.request({
        method: 'post',
        url: 'https://www.sunfengfeng.com/wxapi',
        timeout: 10000,
        data: {
          service_code: '1001',
          service_name: 'mediaCheck',
          access_token: _this.data.access_token,
          media_url: result.data.onlineLink,
          media_type: 1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          if (res.data.body.errcode !== 0) {
            // 检查未通过 NO
            wx.showToast({
              title: '音频违规',
            })
          } else {
            // 检查通过 OK
            _this.audioCtx.src = result.data.onlineLink
            _this.audioCtx.play();

          }
        },
        fail(error) {
          wx.showToast({
            title: '通讯失败',
          })
        }
      })
    });
  },

  /* 我要合成 */
  async myMake() {
    let _this = this;
    if (!this.data.textareaValue) {
      wx.showModal({
        content: '你丫的，没有输入文字！',
        confirmText: '确定',
        showCancel: false
      })
      return
    }

    let checkTextResult = await this.checkTextResult(this.data.textareaValue)
    if (!checkTextResult) {
      wx.showToast({
        title: '文字违规',
      })
      return;
    }

    const spd = this.data.spd
    const per = this.getPer(this.data.items)
    let obj = { spd, per }

    // 发送通讯主方法
    this.sendAsync(obj, (result)=> {
      this.showLoading();
      // 安全内容检查
      wx.request({
        method: 'post',
        url: 'https://www.sunfengfeng.com/wxapi',
        timeout: 10000,
        data: {
          service_code: '1001',
          service_name: 'mediaCheck',
          access_token: _this.data.access_token,
          media_url: result.data.onlineLink,
          media_type: 1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          if (res.data.body.errcode !== 0) {
            // 检查未通过 NO
            wx.showToast({
              title: '音频违规',
            })
          } else {
            // 检查通过 OK
            _this.setData({audioPlaySrc: result.data.onlineLink})
            wx.setClipboardData({
              data: result.data.onlineLink,
              success (res) {
                wx.getClipboardData({
                  success (res) {
                    console.log(res.data) // data
                  }
                })
              }
            })
          }
        },
        fail(error) {
          wx.showToast({
            title: '通讯失败',
          })
        },
        complete() {
          wx.hideLoading()
        }
      })
    });
  },

  /* 复制地址 */
  copysrcHandler() {
    console.log(this.data.audioPlaySrc)
    wx.setClipboardData({
      data: this.data.audioPlaySrc,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  /* 点击下载 */
  async downloadFile() {
    let _this = this;
    if (!this.data.textareaValue) {
      wx.showModal({
        content: '你丫的，没有输入文字！',
        confirmText: '确定',
        showCancel: false
      })
      return
    }

    let checkTextResult = await this.checkTextResult(this.data.textareaValue)
    if (!checkTextResult) {
      wx.showToast({
        title: '文字违规',
      })
      return;
    }

    const spd = this.data.spd
    const per = this.getPer(this.data.items)
    let obj = { spd, per }

    // 发送通讯主方法
    await this.sendAsync(obj, (result)=> {
      this.showLoading();
      // 安全内容检查
      wx.request({
        method: 'post',
        url: 'https://www.sunfengfeng.com/wxapi',
        timeout: 10000,
        data: {
          service_code: '1001',
          service_name: 'mediaCheck',
          access_token: _this.data.access_token,
          media_url: result.data.onlineLink,
          media_type: 1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          if (res.data.body.errcode !== 0) {
            // 检查未通过 NO
            wx.showToast({
              title: '音频违规',
            })
          } else {
            // 检查通过 OK
            wx.downloadFile({
              url: result.data.onlineLink,
              success (response) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (response.statusCode === 200) {
                  wx.openDocument({
                    filePath: response.tempFilePath,
                    success: function (s) {
                      console.log('打开文档成功')
                    }
                  })
                }
              }
            })
          }
        },
        fail(error) {
          wx.showToast({
            title: '通讯失败',
          })
        },
        complete() {
          wx.hideLoading()
        }
      })
    });
  },

  

  /* 发送通讯 */
  async sendAsync(obj, callback) {
    this.showLoading();
    let self = this;
    return new Promise((reslove, reject) => {
      wx.request({
        method: 'post',
        url: 'https://www.sunfengfeng.com/speech',
        data: {
          text: self.data.textareaValue,
          parame: {
            cuid: String(new Date().getTime()),
            spd: obj.spd,
            pit: '5',
            vol: '5',
            per: obj.per,
          }
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          callback && callback(res);
        },
        complete: ()=> {
          wx.hideLoading()
        }
      })
    })
    
  },

  /* 获取发音人 */
  getPer(items) {
    for(let i = 0; i < items.length; i++) {
      if (items[i].checked === true) {
        return items[i].value
      }
    }
    return '0'
  },

  showLoading(title='正在加载中') {
    wx.showLoading({
      title: title,
      mask: true
    })
  },

  /* 微信云安全检查(文字) */
  async checkTextResult(text) {
    this.showLoading('正在安全检查')
    return new Promise((reslove, reject)=> {
      wx.cloud.callFunction({
        name: 'ContentCheck',
        data: {
          msg: text,
        },
        success(res) {
          console.log(res.result)
          if (res.result.errCode === 87014) {
            reslove(false)
          } else {
            reslove(true)
          }
        },
        fail(error) {
          reslove(false)
        },
        complete() {
          wx.hideLoading()
        }
      })
    })
    
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    this.audioCtx = wx.createInnerAudioContext({});
    let _this = this;
    wx.request({
      url: 'https://www.sunfengfeng.com/getAccessTokenToXcx',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        let body = JSON.parse(res.data.body.body)
        _this.setData({access_token: body.access_token});
      }
    })

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(res)
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
