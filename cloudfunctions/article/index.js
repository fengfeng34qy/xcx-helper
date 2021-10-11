// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  const api = {
    addArticle: require('./addArticle.js').main,
    getArticle: require('./getArticle.js').main,
    updateArticleLike: require('./updateArticleLike.js').main,
    updateComment: require('./updateComment.js').main,
    deleteArticle: require('./deleteArticle.js').main
  }
  return {
    code: 0,
    data: await api[event.api](event.parmes)
  }
}