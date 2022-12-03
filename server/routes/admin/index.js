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

  // 管理员注册
  app.post("/admin/api/register",controller.registerAdmin)
  // 管理员登录
  app.post("/admin/api/login",controller.loginAdmin);
  // 管理员查询
  app.get("/admin/api/findMangers",controller.findManagers)
  // 管理员删除
  app.delete("/admin/api/deleteManger",controller.deleteManager)

  // 权限添加
  app.post("/admin/api/addPower",controller.addPower)
  // 权限修改
  app.post("/admin/api/updatePower",controller.updatePower)
  // 权限查询
  app.get("/admin/api/findPowers",controller.findPowers)
  // 权限删除
  app.delete("/admin/api/deletePower",controller.deletePower)

  // 角色添加
  app.post("/admin/api/addRole",controller.addRole)
  // 角色修改
  app.post("/admin/api/updateRole",controller.updateRole)
  // 角色查询
  app.get("/admin/api/findRoles",controller.findRoles)
  // 角色删除
  app.delete("/admin/api/deleteRole",controller.deleteRole)

  // 组织添加
  app.post("/admin/api/addOrganization",controller.addOrganization)
  // 组织修改
  app.post("/admin/api/updateOrganization",controller.updateOrganization)
  // 组织查询
  app.get("/admin/api/findOrganizations",controller.findOrganizations)
  // 组织删除
  app.delete("/admin/api/deleteOrganization",controller.deleteOrganization)

  // 学院添加
  app.post("/admin/api/addFaculty",controller.addFaculty)
  // 学院修改
  app.post("/admin/api/updateFaculty",controller.updateFaculty)
  // 学院查询
  app.get("/admin/api/findFaculties",controller.findFaculties)
  // 学院删除
  app.delete("/admin/api/deleteFaculty",controller.deleteFaculty)

  // 学校添加
  app.post("/admin/api/addSchool",controller.addSchool)
  // 学校修改
  app.post("/admin/api/updateSchool",controller.updateSchool)
  // 学校查询
  app.get("/admin/api/findSchools",controller.findSchools)
  // 学校删除
  app.delete("/admin/api/deleteSchool",controller.deleteSchool)


  // 专业班级添加
  app.post("/admin/api/addClass",controller.addClass)
  // 专业班级修改
  app.post("/admin/api/updateClass",controller.updateClass)
  // 专业班级查询
  app.get("/admin/api/findClasses",controller.findClasses)
  // 专业班级删除
  app.delete("/admin/api/deleteClass",controller.deleteClass)

  // 用户添加
  app.post("/admin/api/addUser",controller.addUser)
  // 用户修改
  app.post("/admin/api/updateUser",controller.updateUser)
  // 用户查询
  app.get("/admin/api/findUsers",controller.findUsers)
  // 用户删除
  app.delete("/admin/api/deleteUser",controller.deleteUser)

  // 文章添加
  app.post("/admin/api/addArticle",controller.addArticle)
  // 文章修改
  app.post("/admin/api/updateArticle",controller.updateArticle)
  // 文章查询
  app.get("/admin/api/findArticles",controller.findArticles)
  // 文章删除
  app.delete("/admin/api/deleteArticle",controller.deleteArticle)

  // 视频添加
  app.post("/admin/api/addVedio",controller.addVedio)
  // 视频修改
  app.post("/admin/api/updateVedio",controller.updateVedio)
  // 视频查询
  app.get("/admin/api/findVedioes",controller.findVedioes)
  // 视频删除
  app.delete("/admin/api/deleteVedio",controller.deleteVedio)

  // 活动添加
  app.post("/admin/api/addActive",controller.addActive)
  // 活动修改
  app.post("/admin/api/updateActive",controller.updateActive)
  // 活动查询
  app.get("/admin/api/findActives",controller.findActives)
  // 活动删除
  app.delete("/admin/api/deleteActive",controller.deleteActive)

  // 活动地点添加
  app.post("/admin/api/addPlace",controller.addPlace)
  // 活动地点修改
  app.post("/admin/api/updatePlace",controller.updatePlace)
  // 活动地点查询
  app.get("/admin/api/findPlaces",controller.findPlaces)
  // 活动地点删除
  app.delete("/admin/api/deletePlace",controller.deletePlace)

  // 题目添加
  app.post("/admin/api/addPractice",controller.addPractice)
  // 题目修改
  app.post("/admin/api/updatePractice",controller.updatePractice)
  // 题目查询
  app.get("/admin/api/findPractices",controller.findPractices)
  // 题目删除
  app.delete("/admin/api/deletePractice",controller.deletePractice)

  // 礼物添加
  app.post("/admin/api/addGift",controller.addGift)
  // 礼物修改
  app.post("/admin/api/updateGift",controller.updateGift)
  // 礼物查询
  app.get("/admin/api/findGifts",controller.findGifts)
  // 礼物删除
  app.delete("/admin/api/deleteGift",controller.deleteGift)

  // 评论添加
  app.post("/admin/api/addComment",controller.addComment)
  // 评论修改
  app.post("/admin/api/updateComment",controller.updateComment)
  // 评论查询
  app.get("/admin/api/findComments",controller.findComments)
  // 评论删除
  app.delete("/admin/api/deleteComment",controller.deleteComment)
}

module.exports = routes