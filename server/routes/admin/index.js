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
      // 这里的解析不包括路径为"/admin/api/register","/admin/api/login","/web/api/"的接口
      path: ["/admin/api/register","/admin/api/login",/^\/web\/api/],
    })
  );

  // 1.管理员注册
  app.post("/admin/api/register",controller.registerAdmin)
  // 2.管理员登录
  app.post("/admin/api/login",controller.loginAdmin);
  // 3.管理员查询
  app.get("/admin/api/findMangers",controller.findManagers)
  // 4.管理员删除
  app.delete("/admin/api/deleteManger",controller.deleteManager)
}

module.exports = routes