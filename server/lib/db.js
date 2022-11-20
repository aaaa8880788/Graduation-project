const mysql = require('mysql')
const config = require('../config/default')

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
  type INT NOT NULL COMMENT '类型-超级管理员-1老师',
  name VARCHAR(100) NOT NULL COMMENT '用户名',
  password VARCHAR(100) NOT NULL COMMENT '密码',
  powerId VARCHAR(100) COMMENT '拥有权限id',
  PRIMARY KEY (id) 
)`

// 留言反馈
// let feedbacks = `create table if not exists feedbacks(
//   id INT NOT NULL AUTO_INCREMENT,
//   wallId INT NOT NULL COMMENT '墙留言ID',
//   userId VARCHAR(100) NOT NULL COMMENT '反馈者ID',
//   type INT NOT NULL COMMENT '类型-0喜欢1举报2撤销',
//   moment VARCHAR(100) NOT NULL COMMENT '时间',
//   PRIMARY KEY (id)
// )`

// 留言评论
// let comments = `create table if not exists comments(
//   id INT NOT NULL AUTO_INCREMENT,
//   wallId INT NOT NULL COMMENT '墙留言ID',
//   userId VARCHAR(100) NOT NULL COMMENT '评论者ID',
//   imageUrl VARCHAR(1000) COMMENT '头像路径',
//   comment VARCHAR(100) COMMENT '评论内容',
//   name VARCHAR(100) NOT NULL COMMENT '用户名',
//   moment VARCHAR(100) NOT NULL COMMENT '时间',
//   PRIMARY KEY (ID)
// )`
// 创建数据表函数
let createTable = (sql)=>{
  return query(sql,[])
}

// 先创建数据库再创建表
async function create(){
  await createDatabase(partyTable)
  createTable(managers)
}
create()

// 1.管理员注册
// 默认管理账号密码admin
exports.registerAdmin = (type,value) => {
  if(type === 1){
    const _sql = "select count(*) as count from managers where name=?"
    return query(_sql,value)
  }else if (type === 2){
    const _sql = "insert into managers set name=?,password=?,type=?,powerId=?"
    return query(_sql,value)
  }
}

// 2.管理员登录
exports.loginAdmin = (type,value) => {
  if(type === 1){
    const _sql = `select count(*) as count from managers where name=?`
    return query(_sql,value)
  }else if (type === 2){
    const _sql = `select * from managers where name=?`
    return query(_sql,value)
  }
}

// 3.管理员查询
exports.findManagers = (page,pageSize) => {
  const _sql = `select * from managers order by id desc limit ${(page-1)*pageSize},${page*pageSize}`
  return query(_sql)
}

// 4.管理员删除
exports.deleteManager = (id) => {
  const _sql = `delete from managers where id="${id}"`
  return query(_sql)
}
