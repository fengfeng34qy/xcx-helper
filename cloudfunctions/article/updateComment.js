// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const db = cloud.database()
  console.log(event)

  // 获取文章
  var articleItem = await db.collection('article').where({
    _id: event.articleId
  }).get({})
  console.log(articleItem)
  var comments = articleItem.data[0].comments
  if (event.type === 'addComment') {
    let obj = {}
    obj.openid = event.openid
    obj.articleId = event.articleId
    obj.userName = event.userName
    obj.avatarUrl = event.avatarUrl
    obj.content = event.content
    obj.like = []
    obj.reply = []
    obj.createTime = db.serverDate()
    obj.timestamp = +new Date()
    comments.push(obj)
    // 添加评论
    const addCommentResult = await db.collection('article').where({
      _id: event.articleId
    })
    .update({
      data: {
        comments: comments
      }
    })
    return {
      ...addCommentResult,
      msg: '评论成功'
    }
  } else {
    var index = 0;
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].timestamp === event.timestamp) {
        index = i
        break;
      }
    }
    comments.splice(index, 1)
    // 删除评论
    const addCommentResult = await db.collection('article').where({
      _id: event.articleId
    })
    .update({
      data: {
        comments: comments
      }
    })
    return {
      ...addCommentResult,
      msg: '删除评论成功'
    }
  }
  
}