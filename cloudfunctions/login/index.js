// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  console.log(event)

  const db = cloud.database()

  var tips = []
  var tipsResult = await db.collection('tips').get()
  tipsResult.data.forEach(function(item) {
    tips.push(item.value)
  })

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  console.log(wxContext)
  const userinfo = await db.collection('userManager').get()
  for(let i = 0; i < userinfo.data.length; i++) {
    if (userinfo.data[i].openid === wxContext.OPENID) {
      return {
        code: '9',
        tips,
        openid: userinfo.data[i].openid,
        message: '用户已经存在'
      }
    }
  }
  const value = await db.collection('userManager')
  .add({
    data: {
      ...event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      createTime: db.serverDate(),
      timestamp: +new Date()
    }
  })

  

  return {
    code: 0,
    tips,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  }
}

