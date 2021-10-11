// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  console.log(event)

  const db = cloud.database()
  const articleRemoveResult = await db.collection('article').where({
    _id: event.articleId
  })
  .remove()
  return {
    articleRemoveResult
  }
}