// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  console.log(event)
  const value = await db.collection('article')
  .add({
    data: {
      ...event,
      createTime: db.serverDate(),
      timestamp: +new Date()
    }
  })
}