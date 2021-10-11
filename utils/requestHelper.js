let BASECONF = require('./baseConfig.js')
let requestHelper = {
  async sendAsync({method='post', timeout=30000, data='', url} = {}) {
    return new Promise((reslove, reject) => {
      wx.request({
        method: method,
        url: BASECONF.baseUrl + url,
        timeout: timeout,
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          reslove({ReturnCode: "000000", ReturnMessage: "成功", data: res.data})
        },
        fail(error) {
          reslove({ReturnCode: "999999", ReturnMessage: "通讯失败"})
        },
        complete: (s)=> {
          console.log(s)
          // wx.hideLoading()
        }
      })
    })
  },
  async sendNonMaskAsync({method='post', timeout=30000, data='', url} = {}) {
    return new Promise((reslove, reject) => {
      wx.request({
        method: method,
        url: BASECONF.baseUrl + url,
        timeout: timeout,
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          reslove({ReturnCode: "000000", ReturnMessage: "成功", data: res.data})
        },
        fail(error) {
          reslove({ReturnCode: "999999", ReturnMessage: "通讯失败"})
        },
        complete: ()=> {}
      })
    })
  }
}
module.exports = requestHelper