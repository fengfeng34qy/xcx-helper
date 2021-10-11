// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (args, context) => {
  // const wxContext = cloud.getWXContext()
  console.log(args)
  const obj = args.articleId ? {_id: args.articleId} : {}

  const db = cloud.database() 
  const articleList = await db.collection('article').where(obj).orderBy('timestamp', 'desc').get()
  return {
    articleList
  }
}