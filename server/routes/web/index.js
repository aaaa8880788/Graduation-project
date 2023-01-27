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
  // 前台登录接口
  app.get("/web/api/getArticlesList",controller.getArticlesList)
  // 前台获取个人信息
  app.get("/web/api/getUserInfo",controller.getUserInfo)
  // 前台获取视频列表
  app.get("/web/api/getVedioesList",controller.getVedioesList)
  // 前台获取文章详情
  app.get("/web/api/getArticleDetail",controller.getArticleDetail)
}

module.exports = routes