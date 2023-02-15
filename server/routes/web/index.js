const controller = require('../../controller/dbServer')
const config = require('../../config/default')
const routes = function(app){
  // 用这个包来解析Token
  const {expressjwt} = require("express-jwt");
  app.use(
    expressjwt({
      secret: config.jwt.jwtSecretKey,
      algorithms: config.jwt.algorithms,
    }).unless({
      // 这里的解析不包括路径为"/web/api/global","/admin/api/"的接口
      path: [/^\/admin\/api/,/^\/web\/api\/global/],
    })
  );

  // 前台获取组织列表
  app.get("/web/api/global/getOrganizationsList",controller.getOrganizationsList)
  // 前台获取学院列表
  app.get("/web/api/global/getFacultiesList",controller.getFacultiesList)
  // 前台获取学校列表
  app.get("/web/api/global/getSchoolsList",controller.getSchoolsList)
  // 前台获取专业班级列表
  app.get("/web/api/global/getClassesList",controller.getClassesList)
  // 前台注册接口
  app.post("/web/api/global/userRegister",controller.userRegister)
  // 前台登录接口
  app.post("/web/api/global/userLogin",controller.userLogin)
  // 前台获取文章列表
  app.get("/web/api/getArticlesList",controller.getArticlesList)
  // 前台获取个人信息
  app.get("/web/api/getUserInfo",controller.getUserInfo)
  // 前台获取视频列表
  app.get("/web/api/getVedioesList",controller.getVedioesList)
  // 前台获取文章详情
  app.get("/web/api/getArticleDetail",controller.getArticleDetail)
  // 前台获取视频详情
  app.get("/web/api/getVedioDetail",controller.getVedioDetail)
  // 前台获取具体文章或视频列表评论列表接口
  app.get("/web/api/getCommentList",controller.getCommentList)
  // 前台发布评论接口
  app.post("/web/api/publishComment",controller.publishComment)
  // 前台评论点赞
  app.post("/web/api/supportComment",controller.supportComment)
  // 前台文章/视频/活动收藏
  app.post("/web/api/userCollect",controller.userCollect)
  // 前台获取题目列表
  app.get("/web/api/getPracticeList",controller.getPracticeList)
  // 前台用户数据更新接口
  app.post("/web/api/updateUserInfo",controller.updateUserInfo)
  // 前台获取收藏文章列表
  app.get("/web/api/getLoveArticleList",controller.getLoveArticleList)
  // 前台获取收藏文章列表
  app.get("/web/api/getLoveVedioList",controller.getLoveVedioList)
  // 前台获取商品列表
  app.get("/web/api/getGoodList",controller.getGoodList)
  // 前台生成订单
  app.post("/web/api/addOrder",controller.addOrder)
  // 前台获取订单列表
  app.get("/web/api/getOrderList",controller.getOrderList)
  // 前台获取订单列表
  app.delete("/web/api/deleteOrder",controller.deleteOrder)
  // 前台获取活动地点
  app.get("/web/api/getPlaceList",controller.getPlaceList)
  // 前台发布活动
  app.post("/web/api/publishActive",controller.publishActive)
  // 前台获取活动列表
  app.get("/web/api/getActiveList",controller.getActiveList)
  // 前台获取文章详情
  app.get("/web/api/getActiveDetail",controller.getActiveDetail)
  // 前台用户参与活动
  app.post("/web/api/joinActive",controller.joinActive)
  // 前台获取用户参与活动
  app.get("/web/api/getUserJoinActive",controller.getUserJoinActive)
  // 前台搜索文章或视频列表
  app.get("/web/api/getSearchList",controller.getSearchList)
  // 前台获取通讯录好友列表
  app.get("/web/api/getFriendList",controller.getFriendList)
  // 前台获取通讯录群列表
  app.get("/web/api/getGroupList",controller.getGroupList)
  // 前台创建消息列表
  app.post("/web/api/addChatMessage",controller.addChatMessage)
  // 前台用户获取消息列表
  app.get("/web/api/getChatMessage",controller.getChatMessage)
  // 前台用户获取好友聊天信息
  app.get("/web/api/getMessageInfo",controller.getMessageInfo)
  // 前台用户获取群信息
  app.get("/web/api/getGroupMessageInfo",controller.getGroupMessageInfo)
  // 前台用户发送信息
  app.post("/web/api/sendMessage",controller.sendMessage)
  // 前台用户发送群信息
  app.post("/web/api/sendGroupMessage",controller.sendGroupMessage)
}

module.exports = routes