// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (args, context) => {
  // const wxContext = cloud.getWXContext()
  console.log(args)
  const obj = args.articleId ? {_id: args.articleId} : {}

  const db = cloud.database()

  // 获取文章点赞数据
  var getArticleList = await db.collection('article').where({
    _id: args.articleId
  }).get({})

  let likes = getArticleList.data[0].likes
  if (likes.includes(args.openid)) {  // 是否已经点赞
    // 取消点赞
    // 1.找到要删除元素的下标
    var index = null
    for (let i = 0; i < likes.length; i++) {
      if (likes[i] === args.openid) {
        index = i
        break
      }
    }
    likes.splice(index, 1)
    console.log(likes)
    const updateResult = await db.collection('article').where({
      _id: args.articleId
    })
    .update({
      data: {
        likes: likes
      }
    })
    return {
      ...updateResult,
      msg: '取消点赞成功'
    }
  } else {
    // 点赞
    likes.push(args.openid)
    const updateResult = await db.collection('article').where({
      _id: args.articleId
    })
    .update({
      data: {
        likes: likes
      }
    })
    return {
      ...updateResult,
      msg: '点赞成功'
    }
  }
  
  // return {
  //   updateResult
  // }
}