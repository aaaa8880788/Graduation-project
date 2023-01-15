
const mysql = require('mysql')
const config = require('../config/default')
// 用这个包来加密字符串
const bcrypt = require("bcryptjs")
// 导入工具函数
const utils = require('../utils/generateWhereStr')
const db = mysql.createConnection({
  host:config.database.HOST,
  port:config.database.PORT,
  user:config.database.USER,
  password:config.database.PASSWORD
})

// 连接指定数据库
const pool = mysql.createPool({
  host:config.database.HOST,
  user:config.database.USER,
  password:config.database.PASSWORD,
  database:config.database.PARTYTABLE
})

let bdbs = (sql,values)=>{
  return new Promise((resolve,reject)=>{
    db.query(sql,values,(err,res)=>{
      if(err){
        reject(err)
      }else{
        resolve(res)
      }
    })
  })
}

let query = (sql,values=[])=>{
  return new Promise((resolve,reject)=>{
    pool.getConnection((error,connection)=>{
      if(error){
        reject(error)
      }else{
        connection.query(sql,values,(err,res)=>{
          if(err){
            reject(err)
          }else{
            resolve(res)
          }
          connection.release()
        })
      }
    })
  })
}

// 创建数据库语句
let partyTable = 'create database if not exists partyTable default charset utf8 collate utf8_general_ci'
// 创建数据库函数
let createDatabase = (sql)=>{
  return bdbs(sql,[])
}

// 创建数据表语句
// 后台管理员列表
let managers = `create table if not exists managers(
  id INT NOT NULL AUTO_INCREMENT,
  type INT NOT NULL COMMENT '类型-0超级管理员-1老师',
  name VARCHAR(100) NOT NULL COMMENT '用户名',
  password VARCHAR(100) NOT NULL COMMENT '密码',
  powerId VARCHAR(10000) COMMENT '拥有权限id数组',
  title VARCHAR(100) COMMENT '名字',
  avatar VARCHAR(1000) COMMENT '头像',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 管理员数据初始化
const managerInit = (type,value)=>{
  if(type === 1){
    const _sql = "select count(*) as count from managers where name=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "insert into managers set name=?,password=?,type=?,powerId=?,title=?,avatar=?,moment=?"
    return query(_sql,value)
  }else if (type === 3){
    const _sql = "select * from powers"
    return query(_sql)
  }
}

// 权限列表
let powers = `create table if not exists powers(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '类型名称：如文章',
  type INT NOT NULL COMMENT '类型-0前台-1后台',
  powerName VARCHAR(100) NOT NULL COMMENT '权限名称：如添加',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 权限数据初始化
const powerInit = (type,value) => {
  if(type === 0){
    const _sql = `insert into powers set name=?,type=?,powerName=?,moment=?`
    return query(_sql,value)
  }else if (type === 1){
    const _sql = "select count(*) as count from powers where name=? and type=? and powerName=?"
    return query(_sql,value)
  }
}
const powerData = [
    /*
    *
    * 后台部分
    *  
    */
    // 活动
    {
      name: "active",
      type: 1,
      powerName: "add",
      moment:new Date().getTime()
    },
    {
      name: "active",
      type: 1,
      powerName: "delete",
      moment:new Date().getTime()
    },
    {
      name: "active",
      type: 1,
      powerName: "modify",
      moment:new Date().getTime()
    },
    {
      name: "active",
      type: 1,
      powerName: "find",
      moment:new Date().getTime()
    },
  // 文章
  {
    name: "article",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "article",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "article",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "article",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  // 班级
  {
    name: "class",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "class",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "class",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "class",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  // 评论
  {
    name: "comment",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "comment",
    type: 1,
    // 审核
    powerName: "audit",
    moment:new Date().getTime()
  },
  {
    name: "comment",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  // 学院
  {
    name: "faculty",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "faculty",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "faculty",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "faculty",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  // 奖品
  {
    name: "gift",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "gift",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "gift",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "gift",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  // 管理员
  {
    name: "manager",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "manager",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "manager",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "manager",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  {
    name: "manager",
    type: 1,
    powerName: "power",
    moment:new Date().getTime()
  },
  // 组织
  {
    name: "organization",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "organization",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "organization",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "organization",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  // 地点
  {
    name: "place",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "place",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "place",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "place",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  // 题目
  {
    name: "practice",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "practice",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "practice",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "practice",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  // 角色
  {
    name: "role",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "role",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "role",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "role",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  // 学校
  {
    name: "school",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "school",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "school",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "school",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  // 用户
  {
    name: "user",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "user",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "user",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "user",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  {
    name: "user",
    type: 1,
    powerName: "power",
    moment:new Date().getTime()
  },
  // 视频
  {
    name: "vedio",
    type: 1,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "vedio",
    type: 1,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "vedio",
    type: 1,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "vedio",
    type: 1,
    powerName: "find",
    moment:new Date().getTime()
  },
  /*
    *
    * 前台部分
    *  
    */
  // 活动
  {
    name: "active",
    type: 0,
    powerName: "add",
    moment:new Date().getTime()
  },
  {
    name: "active",
    type: 0,
    powerName: "delete",
    moment:new Date().getTime()
  },
  {
    name: "active",
    type: 0,
    powerName: "modify",
    moment:new Date().getTime()
  },
  {
    name: "active",
    type: 0,
    powerName: "find",
    moment:new Date().getTime()
  },
]


// 角色列表
let roles = `create table if not exists roles(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '角色名称,如团员',
  introduce VARCHAR(1000) COMMENT '角色介绍',
  request VARCHAR(1000) COMMENT '申请要求',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 组织列表
let organizations = `create table if not exists organizations(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '支部名称：如团支部、党支部',
  introduce VARCHAR(1000) COMMENT '支部介绍',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 学院列表
let faculties = `create table if not exists faculties(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '院系名称例如：信息科学与技术学院',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 学校列表
let schools = `create table if not exists schools(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '学校名字：仲恺农业工程学院',
  logo VARCHAR(1000) COMMENT '学校logo',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 专业班级列表
let classes = `create table if not exists classes(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '专业名：通信工程',
  title VARCHAR(100) COMMENT '专业简称：通信',
  classData VARCHAR(1000) COMMENT '班级数组如：[192,202]',
  facultyId INT NOT NULL COMMENT '院系id',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 用户列表
let users = `create table if not exists users(
  id INT NOT NULL AUTO_INCREMENT,
  type INT NOT NULL COMMENT '0学生1教师',
  name VARCHAR(1000) NOT NULL COMMENT '姓名',
  avatar VARCHAR(1000) COMMENT '头像',
  powerId VARCHAR(1000) COMMENT '权限id数组',
  organizationId INT COMMENT '组织id',
  facultyId INT NOT NULL COMMENT '院系id',
  schoolId INT NOT NULL COMMENT '学校id',
  classId INT COMMENT '专业id',
  className VARCHAR(1000) COMMENT '班级如：192班',
  cardId VARCHAR(1000) NOT NULL COMMENT '学号、工号',
  phone VARCHAR(1000) NOT NULL COMMENT '手机号',
  score INT COMMENT '积分值',
  address VARCHAR(1000) COMMENT '收货地址',
  moment varchar(1000) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 文章列表
let articles = `create table if not exists articles(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL COMMENT '文章标题',
  type INT NOT NULL COMMENT '文章类型0时事要闻1新思想2党史3党建',
  body LONGTEXT NOT NULL COMMENT '文章内容',
  supportUser VARCHAR(1000) COMMENT '收藏用户id数组',
  moment VARCHAR(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 视频列表
let vedioes = `create table if not exists vedioes(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL COMMENT '视频标题',
  type INT NOT NULL COMMENT '视频类型0时事要闻1新思想2党史3党建',
  body VARCHAR(1000) NOT NULL COMMENT '视频内容',
  vedio VARCHAR(1000) NOT NULL COMMENT '视频文件',
  supportUser VARCHAR(1000) COMMENT '收藏用户id数组',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 活动列表
let actives = `create table if not exists actives(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '活动名称',
  placeId INT NOT NULL COMMENT '活动地点',
  body VARCHAR(1000) NOT NULL COMMENT '活动内容',
  userId INT NOT NULL COMMENT '活动发起人id',
  supportUser VARCHAR(1000) COMMENT '收藏用户id数组',
  joinUser VARCHAR(1000) COMMENT '参与用户id数组',
  score INT COMMENT '活动奖励积分',
  isPass INT NOT NULL COMMENT '审核状态0不通过1通过',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 地点列表
let places = `create table if not exists places(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '活动地点',
  status INT NOT NULL COMMENT '使用状态0不可使用1可使用',
  volume INT NOT NULL COMMENT '容纳人数',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 题目列表
let practices = `create table if not exists practices(
  id INT NOT NULL AUTO_INCREMENT,
  content VARCHAR(1000) NOT NULL COMMENT '题目内容',
  options VARCHAR(1000) NOT NULL COMMENT '题目选项（Array）',
  answer VARCHAR(1000) NOT NULL COMMENT '答案（Array）',
  type INT NOT NULL COMMENT '0单选1多选',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 礼物列表
let gifts = `create table if not exists gifts(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '礼物名称',
  image VARCHAR(1000) COMMENT '礼物图片',
  score INT NOT NULL COMMENT '所需兑换积分值',
  total INT NOT NULL COMMENT '库存数量',
  moment varchar(100) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id) 
)`

// 评论列表
let comments = `create table if not exists comments(
  id INT NOT NULL AUTO_INCREMENT,
  content VARCHAR(1000) NOT NULL COMMENT '评论内容',
  commentType INT NOT NULL COMMENT '0文章1视频2活动',
  userId INT NOT NULL COMMENT '评论者id',
  fatherId INT NOT NULL COMMENT '文章||视频||活动id',
  status INT NOT NULL COMMENT '0审核不通过1审核通过',
  moment varchar(100) NOT NULL COMMENT '评论时间',
  PRIMARY KEY (id) 
)`

// TODO
// 反馈列表
let feedbacks = `create table if not exists feedbacks(
  id INT NOT NULL AUTO_INCREMENT,
  commentId INT NOT NULL COMMENT '评论id',
  userId VARCHAR(1000) NOT NULL COMMENT '评论反馈者数组id',
  type INT NOT NULL COMMENT '0喜欢1不喜欢',
  moment varchar(100) NOT NULL COMMENT '反馈时间',
  PRIMARY KEY (id) 
)`

// TODO
// 订单列表

// 创建数据表函数
let createTable = (sql)=>{
  return query(sql,[])
}

// 先创建数据库再创建表
async function create(){
  await createDatabase(partyTable)
  createTable(managers)
  createTable(powers)
  createTable(roles)
  createTable(organizations)
  createTable(faculties)
  createTable(schools)
  createTable(classes)
  createTable(users)
  createTable(articles)
  createTable(vedioes)
  createTable(actives)
  createTable(places)
  createTable(practices)
  createTable(gifts)
  createTable(comments)

  // 初始化权限数据
  for(let i = 0; i<powerData.length; i++){
    const count =  await powerInit(1,[powerData[i].name,powerData[i].type,powerData[i].powerName])
    if(!count[0].count){
      await powerInit(0,[powerData[i].name,powerData[i].type,powerData[i].powerName,powerData[i].moment])
    }
  }
  // 初始化超级管理员数据
  const managerCount = await managerInit(1,'admin')
  if(!managerCount[0].count){
    let name = 'admin'
    let password = '123456'
    let type = 0
    let powerId
    let title = '超级管理员'
    let moment = new Date()
    const powerIdData = await managerInit(3)
    if(powerIdData.length){
      const arr = []
      powerIdData.forEach(item=>{
        arr.push(item)
      })
      powerId = JSON.stringify(arr)
    }
    // 进行密码加密
    const newPassword = bcrypt.hashSync(password, 10);
    await managerInit(2,[name,newPassword,type,powerId,title,null,moment])
  }
}
create()

// 超级管理员注册
exports.registerAdmin = (type,value) => {
  if(type === 1){
    const _sql = "select count(*) as count from managers where name=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "insert into managers set name=?,password=?,type=?,powerId=?,title=?,avatar=?,moment=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from powers"
    return query(_sql)
  }
}

// 管理员登录
exports.loginAdmin = (type,value) => {
  if(type === 1){
    const _sql = `select count(*) as count from managers where name=?`
    return query(_sql,value)
  }else if (type === 2){
    const _sql = `select * from managers where name=?`
    return query(_sql,value)
  }
}

// 管理员查询
exports.findManagers = (type,value) => {
  if(type === 1){
    const [page,pageSize,name,type,title,moment] = value
    const newArr = [{name},{type},{title},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from managers ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if (type === 2){
    const [name,type,title,moment] = value
    const newArr = [{name},{type},{title},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from managers ${whereStr}`
    return query(_sql)
  }
}

// 管理员查询通过id
exports.findManagerById = (type,id) => {
  if(type === 1){
    const _sql = `select * from managers where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from managers where id="${id}"`
    return query(_sql)
  }
}

// 管理员删除
exports.deleteManager = (type,id) => {
  if(type === 1){
    const _sql = `delete from managers where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from managers where id="${id}"`
    return query(_sql)
  }
}

// 管理员修改
exports.updateManager = (type,value) => {
  if(type === 1){
    const _sql = "UPDATE managers set type=?,name=?,password=?,powerId=?,title=?,avatar=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from managers where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from managers where id=?"
    return query(_sql,value)
  }
}

exports.getMenuList = (type,id) => {
  if(type === 1){
    const _sql = `select * from managers where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from managers where id="${id}"`
    return query(_sql)
  }
}

// 权限添加
exports.addPower = (type,value) => {
  if(type === 1){
    const _sql = "insert into powers set name=?,type=?,powerName=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from powers where name=? and type=? and powerName=?"
    return query(_sql,value)
  }
}

// 权限修改
exports.updatePower = (type,value) => {
  if(type === 1){
    const _sql = "UPDATE powers set name=?,type=?,powerName=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from powers where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from powers where id=?"
    return query(_sql,value)
  }
}

// 权限查询
exports.findPowers = (page,pageSize) => {
  const _sql = `select * from powers order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
  return query(_sql)
}

// 权限删除
exports.deletePower = (type,id) => {
  if(type === 1){
    const _sql = `delete from powers where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from powers where id="${id}"`
    return query(_sql)
  }
}

// 角色添加
exports.addRole = (type,value) => {
  if(type === 1){
    const _sql = "insert into roles set name=?,introduce=?,request=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from roles where name=?"
    return query(_sql,value)
  }
}

// 角色修改
exports.updateRole= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE roles set name=?,introduce=?,request=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from roles where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from roles where id=?"
    return query(_sql,value)
  }
}

// 角色查询
exports.findRoles = (type,value) => {
  if(type === 1){
    const [page,pageSize,name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from roles ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if (type === 2){
    const [name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from roles ${whereStr}`
    return query(_sql)
  }
}

// 角色查询通过id
exports.findRoleById = (type,id) => {
  if(type === 1){
    const _sql = `select * from roles where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from roles where id="${id}"`
    return query(_sql)
  }
}

// 角色删除
exports.deleteRole = (type,id) => {
  if(type === 1){
    const _sql = `delete from roles where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from roles where id="${id}"`
    return query(_sql)
  }
}

// 组织添加
exports.addOrganization = (type,value) => {
  if(type === 1){
    const _sql = "insert into organizations set name=?,introduce=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from organizations where name=?"
    return query(_sql,value)
  }
}

// 组织修改
exports.updateOrganization= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE organizations set name=?,introduce=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from organizations where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from organizations where id=?"
    return query(_sql,value)
  }
}

// 组织查询
exports.findOrganizations = (type,value) => {
  if(type === 1){
    const [page,pageSize,name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from organizations ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if (type === 2){
    const [name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from organizations ${whereStr}`
    return query(_sql)
  }
}

// 组织查询通过id
exports.findOrganizationById = (type,id) => {
  if(type === 1){
    const _sql = `select * from organizations where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from organizations where id="${id}"`
    return query(_sql)
  }
}

// 组织删除
exports.deleteOrganization = (type,id) => {
  if(type === 1){
    const _sql = `delete from organizations where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from organizations where id="${id}"`
    return query(_sql)
  }
}

// 学院添加
exports.addFaculty = (type,value) => {
  if(type === 1){
    const _sql = "insert into faculties set name=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from faculties where name=?"
    return query(_sql,value)
  }
}

// 学院修改
exports.updateFaculty= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE faculties set name=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from faculties where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from faculties where id=?"
    return query(_sql,value)
  }
}

// 学院查询
exports.findFaculties = (type,value) => {
  if(type === 1){
    const [page,pageSize,name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from faculties ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if (type === 2){
    const [name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from faculties ${whereStr}`
    return query(_sql)
  }
}

// 学院查询通过id
exports.findFacultyById = (type,id) => {
  if(type === 1){
    const _sql = `select * from faculties where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from faculties where id="${id}"`
    return query(_sql)
  }
}

// 学院删除
exports.deleteFaculty = (type,id) => {
  if(type === 1){
    const _sql = `delete from faculties where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from faculties where id="${id}"`
    return query(_sql)
  }
}

// 学校添加
exports.addSchool = (type,value) => {
  if(type === 1){
    const _sql = "insert into schools set name=?,logo=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from schools where name=?"
    return query(_sql,value)
  }
}

// 学校修改
exports.updateSchool= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE schools set name=?,logo=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from schools where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from schools where id=?"
    return query(_sql,value)
  }
}

// 学校查询
exports.findSchools = (type,value) => {
  if(type === 1){
    const [page,pageSize,name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from schools ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if (type === 2){
    const [name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from schools ${whereStr}`
    return query(_sql)
  }
}

// 学校查询通过id
exports.findSchoolById = (type,id) => {
  if(type === 1){
    const _sql = `select * from schools where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from schools where id="${id}"`
    return query(_sql)
  }
}

// 学校删除
exports.deleteSchool = (type,id) => {
  if(type === 1){
    const _sql = `delete from schools where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from schools where id="${id}"`
    return query(_sql)
  }
}

// 专业班级添加
exports.addClass = (type,value) => {
  if(type === 1){
    const _sql = "insert into classes set name=?,title=?,classData=?,facultyId=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from classes where name=? and facultyId=?"
    return query(_sql,value)
  }
}

// 专业班级修改
exports.updateClass= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE classes set name=?,title=?,classData=?,facultyId=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from classes where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from classes where id=?"
    return query(_sql,value)
  }
}

// 专业班级查询
exports.findClasses = (type,value) => {
  if(type === 1){
    const [page,pageSize,name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from classes ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if (type === 2){
    const [name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from classes ${whereStr}`
    return query(_sql)
  }else if (type ===3){
    const [facultyId] = value
    const _sql = `select * from faculties where id=${facultyId}`
    return query(_sql)
  }
}

// 专业班级查询通过id
exports.findClassById = (type,id) => {
  if(type === 1){
    const _sql = `select * from classes where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from classes where id="${id}"`
    return query(_sql)
  }
}

// 专业班级删除
exports.deleteClass = (type,id) => {
  if(type === 1){
    const _sql = `delete from classes where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from classes where id="${id}"`
    return query(_sql)
  }
}

// 用户添加
exports.addUser = (type,value) => {
  if(type === 1){
    const _sql = "insert into users set type=?,name=?,avatar=?,powerId=?,organizationId=?,facultyId=?,schoolId=?,classId=?,className=?,cardId=?,phone=?,score=?,address=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from users where cardId=?"
    return query(_sql,value)
  }
}

// 用户修改
exports.updateUser= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE users set type=?,name=?,avatar=?,powerId=?,organizationId=?,facultyId=?,schoolId=?,classId=?,className=?,cardId=?,phone=?,score=?,address=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from users where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from users where id=?"
    return query(_sql,value)
  }
}

// 用户查询
exports.findUsers = (type,value) => {
  if(type === 1){
    const [page,pageSize,name,type,cardId,moment] = value
    const newArr = [{name},{type},{cardId},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from users ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if (type === 2){
    const [name,type,cardId,moment] = value
    const newArr = [{name},{type},{cardId},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from users ${whereStr}`
    return query(_sql)
  }else if (type ===3){
    const [organizationId] = value
    const _sql = `select * from faculties where id=${organizationId}`
    return query(_sql)
  }
}

// 用户查询通过id
exports.findUserById = (type,id) => {
  if(type === 1){
    const _sql = `select * from users where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from users where id="${id}"`
    return query(_sql)
  }
}

// 用户删除
exports.deleteUser = (type,id) => {
  if(type === 1){
    const _sql = `delete from users where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from users where id="${id}"`
    return query(_sql)
  }
}

// 文章添加
exports.addArticle = (type,value) => {
  if(type === 1){
    const _sql = "insert into articles set title=?,type=?,body=?,supportUser=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from articles where title=? and type=?"
    return query(_sql,value)
  }
}

// 文章修改
exports.updateArticle= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE articles set title=?,type=?,body=?,supportUser=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from articles where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from articles where id=?"
    return query(_sql,value)
  }
}

// 文章查询
exports.findArticles = (type,value) => {
  if(type === 1){
    const [page,pageSize,type,title,moment] = value
    const newArr = [{type},{title},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from articles ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if (type === 2){
    const [type,title,moment] = value
    const newArr = [{type},{title},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from articles ${whereStr}`
    return query(_sql)
  }
}

// 文章查询通过id
exports.findArticleById = (type,id) => {
  if(type === 1){
    const _sql = `select * from articles where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from articles where id="${id}"`
    return query(_sql)
  }
}

// 文章删除
exports.deleteArticle = (type,id) => {
  if(type === 1){
    const _sql = `delete from articles where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from articles where id="${id}"`
    return query(_sql)
  }
}

// 视频添加
exports.addVedio = (type,value) => {
  if(type === 1){
    const _sql = "insert into vedioes set title=?,type=?,body=?,vedio=?,supportUser=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from vedioes where title=? and type=?"
    return query(_sql,value)
  }
}

// 视频修改
exports.updateVedio= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE vedioes set title=?,type=?,body=?,vedio=?,supportUser=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from vedioes where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from vedioes where id=?"
    return query(_sql,value)
  }
}

// 视频查询
exports.findVedioes = (type,value) => {
  if(type === 1){
    const [page,pageSize,type,title,moment] = value
    const newArr = [{type},{title},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from vedioes ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if (type === 2){
    const [type,title,moment] = value
    const newArr = [{type},{title},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from vedioes ${whereStr}`
    return query(_sql)
  }
}

// 视频查询通过id
exports.findVedioById = (type,id) => {
  if(type === 1){
    const _sql = `select * from vedioes where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from vedioes where id="${id}"`
    return query(_sql)
  }
}

// 视频删除
exports.deleteVedio = (type,id) => {
  if(type === 1){
    const _sql = `delete from vedioes where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from vedioes where id="${id}"`
    return query(_sql)
  }
}

// 活动添加
exports.addActive = (type,value) => {
  if(type === 1){
    const _sql = "insert into actives set name=?,placeId=?,body=?,userId=?,supportUser=?,joinUser=?,score=?,isPass=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from actives where name=?"
    return query(_sql,value)
  }
}

// 活动修改
exports.updateActive= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE actives set name=?,placeId=?,body=?,userId=?,supportUser=?,joinUser=?,score=?,isPass=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from actives where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from actives where id=?"
    return query(_sql,value)
  }
}

// 活动查询
exports.findActives = (page,pageSize) => {
  const _sql = `select * from actives order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
  return query(_sql)
}

// 活动删除
exports.deleteActive = (type,id) => {
  if(type === 1){
    const _sql = `delete from actives where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from actives where id="${id}"`
    return query(_sql)
  }
}

// 活动地点添加
exports.addPlace = (type,value) => {
  if(type === 1){
    const _sql = "insert into places set name=?,status=?,volume=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from places where name=?"
    return query(_sql,value)
  }
}

// 活动地点修改
exports.updatePlace= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE places set name=?,status=?,volume=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from places where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from places where id=?"
    return query(_sql,value)
  }
}

// 活动地点查询
exports.findPlaces = (type,value) => {
  if(type === 1){
    const [ page,pageSize,name,status ] = value
    const newArr = [{name},{status}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from places ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if(type === 2){
    const [ name,status ] = value
    const newArr = [{name},{status}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from places ${whereStr}`
    return query(_sql)
  }
}

// 活动地点查询通过id
exports.findPlaceById = (type,id) => {
  if(type === 1){
    const _sql = `select * from places where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from places where id="${id}"`
    return query(_sql)
  }
}

// 活动地点删除
exports.deletePlace = (type,id) => {
  if(type === 1){
    const _sql = `delete from places where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from places where id="${id}"`
    return query(_sql)
  }
}

// 题目添加
exports.addPractice = (type,value) => {
  if(type === 1){
    const _sql = "insert into practices set content=?,options=?,answer=?,type=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from practices where content=?"
    return query(_sql,value)
  }
}

// 题目修改
exports.updatePractice= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE practices set content=?,options=?,answer=?,type=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from practices where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from practices where id=?"
    return query(_sql,value)
  }
}

// 题目查询
exports.findPractices = (type,value) => {
  if(type === 1){
    const [page,pageSize,content,type,moment] = value
    const newArr = [{content},{type},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from practices ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if (type === 2){
    const [content,type,moment] = value
    const newArr = [{content},{type},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from practices ${whereStr}`
    return query(_sql)
  }
}

// 题目查询通过id
exports.findPracticeById = (type,id) => {
  if(type === 1){
    const _sql = `select * from practices where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from practices where id="${id}"`
    return query(_sql)
  }
}

// 题目删除
exports.deletePractice = (type,id) => {
  if(type === 1){
    const _sql = `delete from practices where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from practices where id="${id}"`
    return query(_sql)
  }
}

// 礼品添加
exports.addGift = (type,value) => {
  if(type === 1){
    const _sql = "insert into gifts set name=?,image=?,score=?,total=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from gifts where name=?"
    return query(_sql,value)
  }
}

// 礼品修改
exports.updateGift= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE gifts set name=?,image=?,score=?,total=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from gifts where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from gifts where id=?"
    return query(_sql,value)
  }
}

// 礼品查询
exports.findGifts = (type,value) => {
  if(type === 1){
    const [page,pageSize,name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from gifts ${whereStr} order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
    return query(_sql)
  }else if (type === 2){
    const [name,moment] = value
    const newArr = [{name},{moment}].filter(item=>{
      for(const key in item){
        return item[key] !== null
      }
    })
    const whereStr = utils.generateWhere(newArr)
    const _sql = `select * from gifts ${whereStr}`
    return query(_sql)
  }
}

// 礼品查询通过id
exports.findGiftById = (type,id) => {
  if(type === 1){
    const _sql = `select * from gifts where id="${id}"`
    return query(_sql)
  }else if(type ===2){
    const _sql = `select count(*) as count from gifts where id="${id}"`
    return query(_sql)
  }
}

// 礼品删除
exports.deleteGift = (type,id) => {
  if(type === 1){
    const _sql = `delete from gifts where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from gifts where id="${id}"`
    return query(_sql)
  }
}

// 评论添加
exports.addComment = (type,value) => {
  if(type === 1){
    const _sql = "insert into comments set content=?,commentType=?,userId=?,fatherId=?,status=?,moment=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from comments where content=?"
    return query(_sql,value)
  }
}

// 评论修改
exports.updateComment= (type,value) => {
  if(type === 1){
    const _sql = "UPDATE comments set content=?,commentType=?,userId=?,fatherId=?,status=?,moment=? where id=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "select count(*) as count from comments where id=?"
    return query(_sql,value)
  }else if (type ===3){
    const _sql = "select * from comments where id=?"
    return query(_sql,value)
  }
}

// 评论查询
exports.findComments = (page,pageSize) => {
  const _sql = `select * from comments order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
  return query(_sql)
}

// 评论删除
exports.deleteComment = (type,id) => {
  if(type === 1){
    const _sql = `delete from comments where id="${id}"`
    return query(_sql)
  }else if(type === 2){
    const _sql = `select count(*) as count from comments where id="${id}"`
    return query(_sql)
  }
}
