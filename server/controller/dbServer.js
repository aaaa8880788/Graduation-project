const dbModel = require('../lib/db')
const config = require('../config/default')
// 用这个包来加密字符串
const bcrypt = require("bcryptjs")
// 用这个包来生成 Token 字符串
const jwt = require("jsonwebtoken");
// 导入解析 formadata 格式表单数据的包
const multer = require("multer");
// 导入路径
const path = require("path");
// 导入工具函数
const utils = require('../utils/utils');
const e = require('express');

// 后台接口部分
// 传统接口部分
// 超级管理员注册
exports.registerAdmin = async (req, res) => {
  const data = req.body;
  let { name,password,type,title,avatar } = data
  if (!name || !password) {
    return res.send({
      message: "name && password字段不可为空",
    });
  }
  if (type !== 0) {
    return res.send({
      message: "type必传，且为0：超级管理员",
    });
  }
  const reg = /^[A-Za-z]+$/;
  if (!reg.test(name) || !reg.test(password)) {
    return res.send({
      message: "超级管理员账号和密码只能由字母组成!",
    });
  }
  // 根据用户名查找用户
  const userCount = await dbModel.registerAdmin(1,[name])
  if (userCount[0].count) {
    return res.send({
      message: "用户已存在",
    });
  }
  const powerIdData = await dbModel.registerAdmin(3)
  let powerId
  if(powerIdData.length){
    const arr = []
    powerIdData.forEach(item=>{
      arr.push(item.id)
    })
    powerId = arr
  }
  title = title ?? name
  powerId = powerId.length ? JSON.stringify(powerId) : []
  let moment = new Date()
  // 进行密码加密
  const newPassword = bcrypt.hashSync(password, 10);
  const result = await dbModel.registerAdmin(2,[name,newPassword,type,powerId,title,avatar,moment])
  res.send({
    code:200,
    message:"注册成功",
  });
}

// 管理员添加
exports.addManager = async (req, res) => {
  const data = req.body;
  let { name,password,type,powerId,title,avatar } = data
  if (!name || !password) {
    return res.send({
      message: "name && password字段不可为空",
    });
  }
  if(![null,undefined].includes(powerId) && !Array.isArray(powerId)){
    return res.send({
      message: "powerId必传且powerId格式为：[{id:xxx}]",
    });
  }
  if ( type !== 1 ) {
    return res.send({
      message: "type必传，且为1：教师",
    });
  }
  const reg = /^[0-9]{12}$/;
  if(!reg.test(name) ){
    return res.send({
      message: "账号只能由12位数字的工号组成",
    });
  }
  // 根据用户名查找用户
  const userCount = await dbModel.registerAdmin(1,[name])
  if (userCount[0].count) {
    return res.send({
      message: "用户已存在，请重新输入用户名",
    });
  }
  title = title ? title : name
  powerId = powerId ? JSON.stringify(powerId) : JSON.stringify([])
  let moment = new Date()
  // 进行密码加密
  const newPassword = bcrypt.hashSync(password, 10);
  const result = await dbModel.registerAdmin(2,[name,newPassword,type,powerId,title,avatar,moment])
  res.send({
    code:200,
    message:"成功",
  });
}

// 管理员登录
exports.loginAdmin = async (req, res) => {
  let { name, password } = req.body;

  // 根据用户名找用户
  const user = await dbModel.loginAdmin(1,[name])
  // 如果查询到结果为空，说明该用户不存在
  if (!user[0].count) {
    return res.send({
      message: "用户不存在！",
    });
  }

  // 校验密码
  const data = await dbModel.loginAdmin(2,[name])
  const oldPassword = data[0]?.password
  const id = data[0].id
  const isValid = bcrypt.compareSync(password, oldPassword);

  if (!isValid) {
    return res.send({
      message: "用户名或密码错误！",
    });
  }

  // 返回token
  // 生成 Token 字符串
  const tokenStr = jwt.sign({id}, config.jwt.jwtSecretKey, {
    expiresIn: "10h", // token 有效期为 10 个小时
  });
  res.send({
    code: 200,
    message: "登录成功！",
    token: tokenStr,
    data:{
      id:data[0]?.id,
    }
  });
}

// 管理员查询
exports.findManagers = async (req,res) => {
  const params = req.query
  let {page,pageSize,name,type,title,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  name = name ? name : null
  type = type ? type : null
  title = title ? title : null
  moment = moment ? moment : null
  const result = await dbModel.findManagers(1,[page,pageSize,name,type,title,moment])
  result.forEach(item=>{
    item.powerId = JSON.parse(item.powerId)
  })
  const total = (await dbModel.findManagers(2,[name,type,title,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 管理员查询通过id
exports.findManagerById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findManagerById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findManagerById(1,id)
  result.forEach(item=>{
    item.powerId = JSON.parse(item.powerId)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}
// 管理员修改
exports.updateManager = async(req,res) => {
  const data = req.body
  const params = req.query
  let {type,name,password,powerId,title,avatar} = data
  let {id} = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateManager(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateManager(3,[id])
  type = type ? type : originData[0].type
  name = name ? name : originData[0].name
  password = password ? password : originData[0].password
  powerId = powerId ? JSON.stringify(powerId) : originData[0].powerId
  title = title ? title : originData[0].title
  avatar = avatar ? avatar : originData[0].avatar
  const result = await dbModel.updateManager(1,[type,name,password,powerId,title,avatar,id])
  res.send({
    code:200,
    message:'更新成功'
  })
}

// 管理员删除(超级管理员不允许删除)
exports.deleteManager = async (req,res) => {
  const { type,id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteManager(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  if(type === 0){
    res.send({
      message:"超级管理员不支持删除"
    })
  }else if(type === 1){
    const result = await dbModel.deleteManager(1,id)
    res.send({
      code:200,
      message:"删除成功"
    })
  }else{
    res.send({
      message:"type字段必传：值为0|1"
    })
  }
}

// 动态路由菜单获取
exports.getMenuList = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.getMenuList(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.getMenuList(1,id)
  let powerId = JSON.parse(result[0].powerId)
  // 先筛选出后台数据，因为这是要后台的菜单
  powerId = powerId.filter(item => item.type === 1)
  // 首先找出拥有查询权限的，有查询权限才有资格注册菜单，否则就算有其他权限，都不会注册这个菜单
  const menuList =  powerId.filter(item => item.powerName === 'find').map(item=>{
    return {
      id:item.id,
      name:item.name,
      path:`/${item.name}`
    }
  })
  // 从已有菜单中找出其对应权限
  menuList.forEach(menu => {
    powerId.filter(power => menu.name === power.name).forEach(item => {
      if(menu.permission){
        menu.permission.push(item.powerName)
      }else{
        menu.permission = [item.powerName]
      }
    })
  })
  res.send({
    code:200,
    message:"查询成功",
    data:menuList
  })
}

// 权限添加
exports.addPower = async (req,res) => {
  const data = req.body
  let {name,type,powerName} = data
  if(![0,1].includes(type)){
    return res.send({
      message: "type字段（0前台-1后台）必传",
    });
  }
  if (!name) {
    return res.send({
      message: "name字段（类型名称：如文章）必传，",
    });
  }
  if (!powerName) {
    return res.send({
      message: "powerName字段（权限名称：如添加）必传，",
    });
  }
  const powerCount = await dbModel.addPower(2,[name,type,powerName])
  if(powerCount[0].count){
      return res.send({
        message:"该权限已存在，请重新选择"
      })
  }
  const result = await dbModel.addPower(1,[name,type,powerName])
  res.send({
    code:200,
    message:'权限添加成功'
  })
}

// 权限修改
exports.updatePower = async (req,res) => {
  const data = req.body
  let {name,type,powerName,id} = data
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updatePower(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updatePower(3,[id])
  name = name ?? originData[0].name
  type = type ?? originData[0].type
  powerName = powerName ?? originData[0].powerName
  const result = await dbModel.updatePower(1,[name,type,powerName,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 权限查询
exports.findPowers = async (req,res) => {
  const params = req.query
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 999
  const result = await dbModel.findPowers(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 权限删除
exports.deletePower = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deletePower(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deletePower(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 角色添加
exports.addRole = async (req,res) => {
  const data = req.body
  let {name,introduce,request} = data
  if (!name) {
    return res.send({
      message: "name字段（角色名称,如团员）必传，",
    });
  }
  const RoleCount = await dbModel.addRole(2,[name])
  if(RoleCount[0].count){
      return res.send({
        message:"该角色已存在，请重新选择"
      })
  }
  let moment = new Date()
  const result = await dbModel.addRole(1,[name,introduce,request,moment])
  res.send({
    code:200,
    message:'角色添加成功'
  })
}

// 角色修改
exports.updateRole = async (req,res) => {
  const data = req.body
  const params = req.query
  let {name,introduce,request} = data
  let {id} = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateRole(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateRole(3,[id])
  name = name ?? originData[0].name
  introduce = introduce ?? originData[0].introduce
  request = request ?? originData[0].request
  const result = await dbModel.updateRole(1,[name,introduce,request,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 角色查询
exports.findRoles = async (req,res) => {
  const params = req.query
  let {page,pageSize,name,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  name = name ? name : null
  moment = moment ? moment : null
  const result = await dbModel.findRoles(1,[page,pageSize,name,moment])
  const total = (await dbModel.findRoles(2,[name,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 角色查询通过id
exports.findRoleById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findRoleById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findRoleById(1,id)
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 角色删除
exports.deleteRole = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteRole(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteRole(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 组织添加
exports.addOrganization = async (req,res) => {
  const data = req.body
  let {name,introduce} = data
  if (!name) {
    return res.send({
      message: "name字段（支部名称：如团支部、党支部）必传，",
    });
  }
  const organitionsCount = await dbModel.addOrganization(2,[name])
  if(organitionsCount[0].count){
      return res.send({
        message:"该组织已存在，请重新选择"
      })
  }
  let moment = new Date()
  const result = await dbModel.addOrganization(1,[name,introduce,moment])
  res.send({
    code:200,
    message:'组织添加成功'
  })
}

// 组织修改
exports.updateOrganization = async (req,res) => {
  const data = req.body
  const params = req.query
  let {name,introduce} = data
  let {id} = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateOrganization(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateOrganization(3,[id])
  name = name ? name :originData[0].name
  introduce = introduce ? introduce : originData[0].introduce
  const result = await dbModel.updateOrganization(1,[name,introduce,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 组织查询
exports.findOrganizations = async (req,res) => {
  const params = req.query
  let {page,pageSize,name,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  name = name ? name : null
  moment = moment ? moment : null
  const result = await dbModel.findOrganizations(1,[page,pageSize,name,moment])
  const total = (await dbModel.findOrganizations(2,[name,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 组织查询通过id
exports.findOrganizationById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findOrganizationById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findOrganizationById(1,id)
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 组织删除
exports.deleteOrganization = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteOrganization(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteOrganization(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 学院添加
exports.addFaculty = async (req,res) => {
  const data = req.body
  let {name} = data
  if (!name) {
    return res.send({
      message: "学院名称必传，",
    });
  }
  let moment = new Date()
  const facultyCount = await dbModel.addFaculty(2,[name])
  if(facultyCount[0].count){
      return res.send({
        message:"该院系已存在，请重新选择"
      })
  }
  const result = await dbModel.addFaculty(1,[name,moment])
  res.send({
    code:200,
    message:'院系添加成功'
  })
}

// 学院修改
exports.updateFaculty = async (req,res) => {
  const data = req.body
  const params = req.query
  let {name} = data
  let {id} = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateFaculty(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateFaculty(3,[id])
  name = name ? name : originData[0].name
  const result = await dbModel.updateFaculty(1,[name,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 学院查询
exports.findFaculties = async (req,res) => {
  const params = req.query
  let {page,pageSize,name,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  name = name ? name : null
  moment = moment ? moment : null
  const result = await dbModel.findFaculties(1,[page,pageSize,name,moment])
  const total = (await dbModel.findFaculties(2,[name,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 学院查询通过id
exports.findFacultyById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findFacultyById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findFacultyById(1,id)
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 学院删除
exports.deleteFaculty = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteFaculty(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteFaculty(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 学校添加
exports.addSchool = async (req,res) => {
  const data = req.body
  let {name,logo} = data
  if (!name) {
    return res.send({
      message: "学校名字必传，",
    });
  }
  let moment = new Date()
  const schoolCount = await dbModel.addSchool(2,[name])
  if(schoolCount[0].count){
      return res.send({
        message:"该学校已存在，请重新选择"
      })
  }
  const result = await dbModel.addSchool(1,[name,logo,moment])
  res.send({
    code:200,
    message:'学校添加成功'
  })
}

// 学校修改
exports.updateSchool = async (req,res) => {
  const data = req.body
  const params = req.query
  let {name,logo} = data
  let {id} = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateSchool(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateSchool(3,[id])
  name = name ?? originData[0].name
  logo = logo ?? originData[0].logo
  const result = await dbModel.updateSchool(1,[name,logo,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 学校查询
exports.findSchools = async (req,res) => {
  const params = req.query
  let {page,pageSize,name,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  name = name ? name : null
  moment = moment ? moment : null
  const result = await dbModel.findSchools(1,[page,pageSize,name,moment])
  const total = (await dbModel.findSchools(2,[name,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 学校查询通过id
exports.findSchoolById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findSchoolById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findSchoolById(1,id)
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 学校删除
exports.deleteSchool = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteSchool(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteSchool(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 专业班级添加
exports.addClass = async (req,res) => {
  const data = req.body
  let {name,title,classData,facultyId} = data
  if (!name) {
    return res.send({
      message: "name字段（专业名：通信工程）必传，",
    });
  }
  if (!title) {
    return res.send({
      message: "title字段（专业简称：通信）必传，",
    });
  }
  if (!Array.isArray(classData)) {
    return res.send({
      message: "classData字段（班级数组如：['191班','192班']）必传，",
    });
  }
  if (!facultyId) {
    return res.send({
      message: "facultyId字段（院系id）必传，",
    });
  }
  let moment = new Date()
  classData = JSON.stringify(classData)
  const classCount = await dbModel.addClass(2,[name,facultyId])
  if(classCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addClass(1,[name,title,classData,facultyId,moment])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 专业班级修改
exports.updateClass = async (req,res) => {
  const data = req.body
  const params = req.query
  let {name,title,classData,facultyId} = data
  let {id} = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateClass(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateClass(3,[id])
  name = name ?? originData[0].name
  title = title ?? originData[0].title
  facultyId = facultyId ?? originData[0].facultyId
  if(Array.isArray(classData)){
    classData = JSON.stringify(classData)
  }else{
    classData = originData[0].classData
  }
  const result = await dbModel.updateClass(1,[name,title,classData,facultyId,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 专业班级查询
exports.findClasses = async (req,res) => {
  const params = req.query
  let {page,pageSize,name,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  name = name ? name : null
  moment = moment ? moment : null
  const result = await dbModel.findClasses(1,[page,pageSize,name,moment])
  result.forEach(async item=>{
    item.classData = JSON.parse(item.classData)
    item.facultyData = (await dbModel.findClasses(3,[item.facultyId]))[0]
  })
  const total = (await dbModel.findClasses(2,[name,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 专业班级查询通过id
exports.findClassById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findClassById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findClassById(1,id)
  result.forEach(item=>{
    item.classData = JSON.parse(item.classData)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 专业班级删除
exports.deleteClass = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteClass(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteClass(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 用户添加
exports.addUser = async (req,res) => {
  const data = req.body
  let {type,name,avatar,password,powerId,organizationId,facultyId,schoolId,classId,className,cardId,phone,score,address} = data
  if (![0,1].includes(type)) {
    return res.send({
      message: "用户类型必传（0为学生，1为教师）",
    });
  }
  if (!name) {
    return res.send({
      message: "姓名必传",
    });
  }
  if (!password) {
    return res.send({
      message: "密码必传",
    });
  }
  if (!['number'].includes(typeof facultyId)) {
    return res.send({
      message: "所属院系必传",
    });
  }
  if (!['number'].includes(typeof schoolId)) {
    return res.send({
      message: "所属学校必传",
    });
  }
  if (!cardId) {
    return res.send({
      message: "工号/学号必传",
    });
  }
  if (!/\d{9}/.test(Number(cardId))) {
    return res.send({
      message: "工号/学号必须由九位数字组成",
    });
  }
  if (!phone) {
    return res.send({
      message: "手机号必传",
    });
  }
  if (!/\d{11}/.test(Number(phone))) {
    return res.send({
      message: "手机号必传由十一位数字组成",
    });
  }
  avatar = avatar ?? null
  if(Array.isArray(powerId)){
    powerId = JSON.stringify(powerId)
  }else{
    powerId = JSON.stringify([])
  }
  organizationId = organizationId ?? null
  classId = classId ?? null
  className = className ?? null
  score = score ?? 0
  address = address ?? null
  let moment = new Date()
  const userCount = await dbModel.addUser(2,[cardId])
  if(userCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  // 进行密码加密
  const newPassword = bcrypt.hashSync(password, 10);
  const result = await dbModel.addUser(1,[type,name,newPassword,avatar,powerId,organizationId,facultyId,schoolId,classId,className,cardId,phone,score,address,moment])
  // 注册成功后添加群用户表数据
  // 1.找到该注册用户的信息
  const userData = (await dbModel.addUser(4,[cardId]))[0]
  // 2.找到群聊大厅的id
  const groupData = (await dbModel.addUser(5,['群聊大厅']))[0]
  // 3.添加群用户表
  {
    const groupId = groupData.id
    const userId = userData.id
    const name = userData.name
    const tip = 0
    const shield = 0
    const moment = new Date()
    await dbModel.addUser(6,[groupId,userId,name,tip,shield,moment])
  }
  // 注册成功后添加好友表
  // 1.搜索出全部用户的数据
  const userList = await dbModel.addUser(7)
  if(userList.length){
    for(const user of userList){
      const status = 0
      const moment = new Date()
      if(userData.id != user.id){
        await dbModel.addUser(8,[userData.id,user.id,status,moment])
        await dbModel.addUser(8,[user.id,userData.id,status,moment])
      }else{
        await dbModel.addUser(8,[userData.id,user.id,status,moment])
      }
    }
  }
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 用户修改
exports.updateUser = async (req,res) => {
  const data = req.body
  const params = req.query
  let {type,name,avatar,password,powerId,organizationId,facultyId,schoolId,classId,className,cardId,phone,score,address} = data
  let {id} = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateUser(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateUser(3,[id])
  type = type ?? originData[0].type
  name = name ?? originData[0].name
  avatar = avatar ?? originData[0].avatar
  if(password){
    // 进行密码加密
    password = bcrypt.hashSync(password, 10);
  }else{
    password = originData[0].password
  }
  if(Array.isArray(powerId)){
    powerId = JSON.stringify(powerId)
  }else{
    powerId = originData[0].powerId
  }
  organizationId = organizationId ?? originData[0].organizationId
  facultyId = facultyId ?? originData[0].facultyId
  schoolId = schoolId ?? originData[0].schoolId
  classId = classId ?? originData[0].classId
  className = className ?? originData[0].className
  cardId = cardId ?? originData[0].cardId
  phone = phone ?? originData[0].phone
  score = score ?? originData[0].score
  address = address ?? originData[0].address
  const result = await dbModel.updateUser(1,[type,name,password,avatar,powerId,organizationId,facultyId,schoolId,classId,className,cardId,phone,score,address,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 用户查询
exports.findUsers = async (req,res) => {
  const params = req.query
  let {page,pageSize,name,type,cardId,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  name = name ? name : null
  type = type ? type : null
  cardId = cardId ? cardId : null
  moment = moment ? moment : null
  const result = await dbModel.findUsers(1,[page,pageSize,name,type,cardId,moment])
  result.forEach(async item=>{
    item.powerId = JSON.parse(item.powerId)
    item.organizationData = (await dbModel.findUsers(3,[item.organizationId]))[0]
  })
  const total = (await dbModel.findUsers(2,[name,type,cardId,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 用户查询通过id
exports.findUserById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findUserById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findUserById(1,id)
  result.forEach(item=>{
    item.powerId = JSON.parse(item.powerId)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 用户删除
exports.deleteUser = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteUser(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteUser(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 文章添加
exports.addArticle = async (req,res) => {
  const data = req.body
  let {title,type,body,supportUser} = data
  if (!title) {
    return res.send({
      message: "文章标题必传",
    });
  }
  if (!([0,1,2,3,4,5].includes(type))) {
    return res.send({
      message: "文章类型（0时事要闻1新思想2党史3党建）",
    });
  }
  if (!body) {
    return res.send({
      message: "文章内容不可为空",
    });
  }
  let moment = new Date()
  if(![undefined,null].includes(supportUser)){
    supportUser = JSON.stringify(supportUser)
  }else{
    supportUser = JSON.stringify([])
  }
  const articleCount = await dbModel.addArticle(2,[title,type])
  if(articleCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addArticle(1,[title,type,body,supportUser,moment])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 文章修改
exports.updateArticle = async (req,res) => {
  const data = req.body
  const params = req.query
  let {title,type,body,supportUser} = data
  let {id} = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateArticle(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateArticle(3,[id])
  title = title ?? originData[0].title
  type = type ?? originData[0].type
  body = body ?? originData[0].body
  if(Array.isArray(supportUser)){
    supportUser = JSON.stringify(supportUser)
  }else{
    supportUser = originData[0].supportUser
  }
  const result = await dbModel.updateArticle(1,[title,type,body,supportUser,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 文章查询
exports.findArticles = async (req,res) => {
  const params = req.query
  let {page,pageSize,type,title,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  type = type ? type : null
  title = title ? title : null
  moment = moment ? moment : null
  const result = await dbModel.findArticles(1,[page,pageSize,type,title,moment])
  result.forEach(item=>{
    item.supportUser = JSON.parse(item.supportUser)
  })
  const total = (await dbModel.findArticles(2,[type,title,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 文章查询通过id
exports.findArticleById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findArticleById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findArticleById(1,id)
  result.forEach(item=>{
    item.supportUser = JSON.parse(item.supportUser)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 文章删除
exports.deleteArticle = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteArticle(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteArticle(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 视频添加
exports.addVedio = async (req,res) => {
  const data = req.body
  let {title,type,image,body,vedio,supportUser} = data
  if (!title) {
    return res.send({
      message: "视频标题必传",
    });
  }
  if (!([0,1,2,3,4,5].includes(type))) {
    return res.send({
      message: "视频类型（0时事要闻1新思想2党史3党建）必传",
    });
  }
  if (!body) {
    return res.send({
      message: "视频内容必传",
    });
  }
  if (!vedio) {
    return res.send({
      message: "视频文件必传",
    });
  }
  let moment = new Date()
  if(![undefined,null].includes(supportUser)){
    supportUser = JSON.stringify(supportUser)
  }else{
    supportUser = JSON.stringify([])
  }
  image = image ?? null
  const vedioCount = await dbModel.addVedio(2,[title,type])
  if(vedioCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addVedio(1,[title,type,image,body,vedio,supportUser,moment])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 视频修改
exports.updateVedio = async (req,res) => {
  const data = req.body
  const params = req.query
  let {title,type,image,body,vedio,supportUser} = data
  let {id} = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateVedio(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateVedio(3,[id])
  title = title ?? originData[0].title
  type = type ?? originData[0].type
  body = body ?? originData[0].body
  vedio = vedio ?? originData[0].vedio
  image = image ?? originData[0].image
  if(![undefined,null].includes(supportUser)){
    supportUser = JSON.stringify(supportUser)
  }else{
    supportUser = originData[0].supportUser
  }
  const result = await dbModel.updateVedio(1,[title,type,image,body,vedio,supportUser,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 视频查询
exports.findVedioes = async (req,res) => {
  const params = req.query
  let {page,pageSize,title,type,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  type = type ? type : null
  title = title ? title : null
  moment = moment ? moment : null
  const result = await dbModel.findVedioes(1,[page,pageSize,type,title,moment])
  result.forEach(item=>{
    item.supportUser = JSON.parse(item.supportUser)
  })
  const total = (await dbModel.findVedioes(2,[type,title,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 视频查询通过id
exports.findVedioById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findVedioById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findVedioById(1,id)
  result.forEach(item=>{
    item.supportUser = JSON.parse(item.supportUser)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}


// 视频删除
exports.deleteVedio = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteVedio(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteVedio(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 活动添加
exports.addActive = async (req,res) => {
  const data = req.body
  let {name,placeId,body,userId,score,startTime,endTime} = data
  if (!name) {
    return res.send({
      message: "name字段（活动名称）必传",
    });
  }
  if (!['number'].includes(typeof Number(placeId))) {
    return res.send({
      message: "placeId字段（活动地点）必传",
    });
  }
  if (!body) {
    return res.send({
      message: "body字段（活动内容）必传",
    });
  }
  if (!['number'].includes(typeof Number(userId))) {
    return res.send({
      message: "userId字段（活动发起人id）必传",
    });
  }
  if(!['number'].includes(typeof Number(score))){
    return res.send({
      message: "活动积分必传",
    });
  }
  if(!startTime){
    return res.send({
      message: "活动开始时间必传",
    });
  }
  if(!endTime){
    return res.send({
      message: "活动开始时间必传",
    });
  }
  const supportUser = JSON.stringify([])
  const joinUser = JSON.stringify([])
  const isPass =  1
  const moment = new Date()
  const activeCount = await dbModel.addActive(2,[name])
  if(activeCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addActive(1,[name,placeId,body,userId,supportUser,joinUser,score,isPass,startTime,endTime,moment])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 活动修改
exports.updateActive = async (req,res) => {
  const data = req.body
  const params = req.query
  let {name,placeId,body,userId,supportUser,joinUser,score,isPass,startTime,endTime} = data
  let {id} = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateActive(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateActive(3,[id])
  name = name ?? originData[0].name
  placeId = placeId ?? originData[0].placeId
  body = body ?? originData[0].body
  userId = userId ?? originData[0].userId
  if(Array.isArray(supportUser)){
    supportUser = JSON.stringify(supportUser)
  }else{
    supportUser = originData[0].supportUser
  }
  if(Array.isArray(joinUser)){
    joinUser = JSON.stringify(joinUser)
  }else{
    joinUser = originData[0].joinUser
  }
  score = score ?? originData[0].score
  isPass = isPass ?? originData[0].isPass
  startTime = startTime ?? originData[0].startTime
  endTime = endTime ?? originData[0].endTime
  const result = await dbModel.updateActive(1,[name,placeId,body,userId,supportUser,joinUser,score,isPass,startTime,endTime,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 活动查询
exports.findActives = async (req,res) => {
  const params = req.query
  let {page,pageSize,name,isPass,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  name = name ? name : null
  isPass = isPass ? isPass : null
  moment = moment ? moment : null
  const result = await dbModel.findActives(1,[page,pageSize,name,isPass,moment])
  for (const item of result){
    item.supportUser = JSON.parse(item.supportUser)
    item.joinUser = JSON.parse(item.joinUser)
    item.placeData = (await dbModel.findActives(3,[item.placeId]))[0]
    item.userData = (await dbModel.findActives(4,[item.userId]))[0]
  }
  const total = (await dbModel.findActives(2,[name,isPass,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 活动查询通过id
exports.findActiveById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findActiveById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findActiveById(1,id)
  for(const item of result){
    item.supportUser = JSON.parse(item.supportUser)
    item.joinUser = JSON.parse(item.joinUser)
    const joinUserData = []
    for(const user of item.joinUser){
      const userName = (await dbModel.findUserById(1,user))[0].name
      joinUserData.push(userName)
    }
    item.joinUserData = joinUserData.join('、')
  }
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 活动删除
exports.deleteActive = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteActive(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteActive(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 活动地点添加
exports.addPlace = async (req,res) => {
  const data = req.body
  let {name,status,volume} = data
  let moment = new Date()
  volume = Number(volume)
  status = Number(status)
  if (!name) {
    return res.send({
      message: "name字段（活动地点）必传",
    });
  }
  if (![0,1].includes(status)) {
    return res.send({
      message: "status字段（活动地点使用状态0不可使用1可使用）必传",
    });
  }
  if ([null,undefined].includes(volume) || !['number','string'].includes(typeof total)) {
    return res.send({
      message: "容纳人数必传且必须大于0",
    });
  }
  const placeCount = await dbModel.addPlace(2,[name])
  if(placeCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addPlace(1,[name,status,volume,moment])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 活动地点修改
exports.updatePlace = async (req,res) => {
  const data = req.body
  const params = req.query
  let {name,status,volume} = data
  let { id } = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updatePlace(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updatePlace(3,[id])
  name = name ?? originData[0].name
  status = status ?? originData[0].status
  volume = volume ?? originData[0].volume
  const result = await dbModel.updatePlace(1,[name,status,volume,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 活动地点查询
exports.findPlaces = async (req,res) => {
  const params = req.query
  let {page,pageSize,name,status} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  name = name ? name : null
  status = status ? status : null
  const result = await dbModel.findPlaces(1,[page,pageSize,name,status])
  const total = (await dbModel.findPlaces(2,[name,status])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 活动地点查询通过id
exports.findPlaceById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findPlaceById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findPlaceById(1,id)
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 活动地点删除
exports.deletePlace = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deletePlace(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deletePlace(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 题目添加
exports.addPractice = async (req,res) => {
  const data = req.body
  let {content,options,answer} = data
  if (!content) {
    return res.send({
      message: "题目内容必传",
    });
  }
  if (!Array.isArray(options) || options.length === 0) {
    return res.send({
      message: "题目选项必传",
    });
  }
  if (!Array.isArray(answer) || answer.length === 0) {
    return res.send({
      message: "答案必传",
    });
  }
  const isDiff = answer.some(item=>{
    let count = 0
    options.forEach(option=>{
      if(option === item){
        count++
      }
    })
    return count === 0
  })
  if(isDiff){
    return res.send({
      message: "请确保答案是否在题目选项中存在",
    });
  }
  const type = answer.length > 1 ? 1 : 0
  options = JSON.stringify(options)
  answer = JSON.stringify(answer)
  let moment = new Date()
  const practicesCount = await dbModel.addPractice(2,[content])
  if(practicesCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addPractice(1,[content,options,answer,type,moment])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 题目修改
exports.updatePractice = async (req,res) => {
  const data = req.body
  const params = req.query
  let {content,options,answer} = data
  let {id} = params
  let type
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  if(![undefined,null].includes(options) && (!Array.isArray(options) || options.length ===0)){
    return res.send({
      message: "options参数必须为Array且不为空",
    });
  }
  if(![undefined,null].includes(answer)){
    if((!Array.isArray(answer) || answer.length === 0)){
      return res.send({
        message: "answer参数必须为Array且不为空",
      });
    } 
    const isDiff = answer.some(item=>{
      let count = 0
      options.forEach(option=>{
        if(option === item){
          count++
        }
      })
      return count === 0
    })
    if(isDiff){
      return res.send({
        message: "请确保答案是否在题目选项中存在",
      });
    }
  }
  const count = await dbModel.updatePractice(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  if(answer){
    type = answer.length > 1 ? 1 : 0
  }
  options = JSON.stringify(options)
  answer = JSON.stringify(answer)
  const originData = await dbModel.updatePractice(3,[id])
  content = content ?? originData[0].content
  options = options ?? originData[0].options
  answer = answer ?? originData[0].answer
  type = type ?? originData[0].type
  const result = await dbModel.updatePractice(1,[content,options,answer,type,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 题目查询
exports.findPractices = async (req,res) => {
  const params = req.query
  let {page,pageSize,content,type,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  content = content ?? null
  type = type ?? null
  moment = moment ?? null
  const result = await dbModel.findPractices(1,[page,pageSize,content,type,moment])
  const total = (await dbModel.findPractices(2,[content,type,moment])).length
  if(result.length > 0){
    result.forEach(item=>{
      item.options = JSON.parse(item.options)
      item.answer = JSON.parse(item.answer)
    })
  }
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 题目查询通过id
exports.findPracticeById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findPracticeById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findPracticeById(1,id)
  result.forEach(item=>{
    item.answer = JSON.parse(item.answer)
    item.options = JSON.parse(item.options)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 题目删除
exports.deletePractice = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deletePractice(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deletePractice(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 礼品添加
exports.addGift = async (req,res) => {
  const data = req.body
  let {name,image,score,total} = data
  if (!name) {
    return res.send({
      message: "礼品名称必传",
    });
  }
  if ([null,undefined].includes(score) || !['number'].includes(typeof score)) {
    return res.send({
      message: "积分值必传",
    });
  }
  if ([null,undefined].includes(total) || !['number'].includes(typeof total)) {
    return res.send({
      message: "库存数量必传",
    });
  }
  const giftsCount = await dbModel.addGift(2,[name])
  if(giftsCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  let moment = new Date()
  image = image ? image : ''
  const result = await dbModel.addGift(1,[name,image,score,total,moment])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 礼品修改
exports.updateGift = async (req,res) => {
  const data = req.body
  const params = req.query
  let {name,image,score,total} = data
  let {id} = params
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateGift(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateGift(3,[id])
  name = name ?? originData[0].name
  image = image ?? originData[0].image
  score = score ?? originData[0].score
  total = total ?? originData[0].total
  const result = await dbModel.updateGift(1,[name,image,score,total,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 礼品查询
exports.findGifts = async (req,res) => {
  const params = req.query
  let {page,pageSize,name,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  name = name ? name : null
  moment = moment ? moment : null
  const result = await dbModel.findGifts(1,[page,pageSize,name,moment])
  const total = (await dbModel.findGifts(2,[name,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 礼品查询通过id
exports.findGiftById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findGiftById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findGiftById(1,id)
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 礼品删除
exports.deleteGift = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteGift(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteGift(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 评论添加
exports.addComment = async (req,res) => {
  const data = req.body
  let {content,commentType,userId,fatherId} = data
  let status = 0
  let moment = new Date()
  if (!content) {
    return res.send({
      message: "content字段（评论内容）必传",
    });
  }
  if (![0,1,2].includes(commentType)) {
    return res.send({
      message: "commentType字段（0文章1视频2活动）必传",
    });
  }
  if ([null,undefined].includes(userId) || typeof userId !== 'number') {
    return res.send({
      message: "userId字段（评论者id）必传",
    });
  }
  if ([null,undefined].includes(fatherId) || typeof fatherId !== 'number') {
    return res.send({
      message: "fatherId字段（文章||视频||活动id）必传",
    });
  }
  const commentsCount = await dbModel.addComment(2,[content])
  if(commentsCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addComment(1,[content,commentType,userId,fatherId,status,moment])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 评论修改
exports.updateComment = async (req,res) => {
  const data = req.body
  const params = req.query
  let {content,commentType,userId,fatherId,status,supportUser} = data
  let {id} = params
  if(!['number','string'].includes(typeof (Number(id)))){
    return res.send({
      message: "id字段必传",
    });
  }
  const count = await dbModel.updateComment(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateComment(3,[id])
  content = content ?? originData[0].content
  commentType = commentType ?? originData[0].commentType
  userId = userId ?? originData[0].userId
  fatherId = fatherId ?? originData[0].fatherId
  status = status ?? originData[0].status
  let moment = originData[0].moment
  if(Array.isArray(supportUser)){
    supportUser = JSON.stringify(supportUser)
  }else{
    supportUser = originData[0].supportUser
  }
  const result = await dbModel.updateComment(1,[content,commentType,userId,fatherId,status,supportUser,moment,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 评论查询
exports.findComments = async (req,res) => {
  const params = req.query
  let { page,pageSize,commentType,status,moment } = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  if(![0,1,2].includes(commentType)){
    commentType = null
  }
  if(![0,1].includes(commentType)){
    status = null
  }
  moment = moment ? moment : null
  const result = await dbModel.findComments(1,[page,pageSize,commentType,status,moment])
  result.forEach(item=>{
    item.supportUser = JSON.parse(item.supportUser)
  })
  const total = (await dbModel.findComments(2,[commentType,status,moment])).length
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 评论查询通过id
exports.findCommentById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findCommentById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findCommentById(1,id)
  result.forEach(item=>{
    item.supportUser = JSON.parse(item.supportUser)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 评论删除
exports.deleteComment = async (req,res) => {
  const { id } = req.body
  if([null,undefined].includes(id) || !['number','string'].includes(typeof id)){
    return res.send({
      message:"id必传"
    })
  }
  const count =  await dbModel.deleteComment(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteComment(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 订单编辑
exports.updateOrder = async (req,res) => {
  const data = req.body
  const params = req.query
  let {status} = data
  let {id} = params
  if(!['number'].includes(typeof Number(id))){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.updateOrder(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.updateOrder(3,[id])
  status = status ?? originData[0].status
  const result = await dbModel.updateOrder(1,[status,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 订单查询
exports.findOrders = async (req,res) => {
  const params = req.query
  let {page,pageSize,status,moment} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  status = status ? status : null
  moment = moment ? moment : null
  const result = await dbModel.findOrders(1,[page,pageSize,status,moment])
  const total = (await dbModel.findOrders(2,[status,moment])).length
  for(const item of result){
    item.giftData = (await dbModel.findOrders(3,[item.giftId]))[0]
    item.userData = (await dbModel.findOrders(4,[item.userId]))[0]
  }
  res.send({
    code:200,
    message:"查询成功",
    data:result,
    total:total
  })
}

// 订单查询通过id
exports.findOrderById = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number'].includes(typeof Number(id))){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.findOrderById(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.findOrderById(1,id)
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 订单删除
exports.deleteOrder = async (req,res) => {
  const { id } = req.body
  if(!['number'].includes(typeof Number(id))){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count =  await dbModel.deleteOrder(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，删除失败"
    })
  }
  const result = await dbModel.deleteOrder(1,id)
  res.send({
      code:200,
      message:"删除成功"
  })
}

// 图片上传接口部分
exports.uploadAvatarSingle = (type) => {
  // 上传地址
  const avatarDest = path.join(__dirname, "../uploads/avatar");
  //将图片放到服务器
  const avatarStorage = multer.diskStorage({
    // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
    destination: avatarDest,
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
      cb(null,`${new Date().getTime()}.jpg`);
    },
  });
  // 创建multer的实例对象
  const avatarUpload = multer({
    storage: avatarStorage,
  });
  // upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
  // 将文件类型的数据，解析并挂载到 req.file 属性中
  // 将文本类型的数据，解析并挂载到 req.body 属性中
  return avatarUpload.single(type)
}
exports.uploadAvatar = async (req, res) => {
  if(!req.file){
    return res.send({
      message:'请上传图片'
    })
  }
  const file = req.file;
  file.url = `http://localhost:${config.port}/uploads/avatar/${file.filename}`;
  res.send({
    code:200,
    message:'图片上传成功',
    data:file
  });
}

// 视频上传接口部分
exports.uploadVedioSingle = (type) => {
  // 上传地址
  const vedioDest = path.join(__dirname, "../uploads/vedio");
  //将视频放到服务器
  const vedioStorage = multer.diskStorage({
    // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
    destination: vedioDest,
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
      cb(null,`${new Date().getTime()}.mp4`);
    },
  });
  // 创建multer的实例对象
  const vedioUpload = multer({
    storage: vedioStorage,
  });
  // upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
  // 将文件类型的数据，解析并挂载到 req.file 属性中
  // 将文本类型的数据，解析并挂载到 req.body 属性中
  return vedioUpload.single(type)
}
exports.uploadVedio = async (req, res) => {
  if(!req.file){
    return res.send({
      message:'请上传视频'
    })
  }
  const file = req.file;
  file.url = `http://localhost:${config.port}/uploads/vedio/${file.filename}`;
  res.send({
    code:200,
    message:'视频上传成功',
    data:file
  });
}


// 前台接口部分
// 公共接口

// 前台获取组织列表
exports.getOrganizationsList = async (req,res) => {
  const result = await dbModel.getOrganizationsList()
  res.send({
    code:200,
    message:"组织列表查询成功",
    data:result,
  })
}

// 前台获取学院列表
exports.getFacultiesList = async (req,res) => {
  const result = await dbModel.getFacultiesList()
  for(const item of result){
    item.value = item.id
  }
  res.send({
    code:200,
    message:"学院列表查询成功",
    data:result,
  })
}

// 前台获取学校列表
exports.getSchoolsList = async (req,res) => {
  const result = await dbModel.getSchoolsList()
  for(const item of result){
    item.value = item.id
  }
  res.send({
    code:200,
    message:"学校列表查询成功",
    data:result,
  })
}

// 前台获取专业班级列表
exports.getClassesList = async (req,res) => {
  const result = await dbModel.getClassesList()
  for(const item of result){
    item.value = item.id
    item.classData = JSON.parse(item.classData)
  }
  res.send({
    code:200,
    message:"专业班级列表查询成功",
    data:result,
  })
}
// 前台注册接口
exports.userRegister = async (req,res) => {
  const data = req.body
  let {type,name,password,avatar,powerId,organizationId,facultyId,schoolId,classId,className,cardId,phone,score,address} = data
  if (![0,1].includes(type)) {
    return res.send({
      message: "请选择类型",
    });
  }
  if (!name) {
    return res.send({
      message: "请输入姓名",
    });
  }
  if(!password){
    return res.send({
      message: "请输入密码",
    });
  }
  if (!['number'].includes(typeof facultyId)) {
    return res.send({
      message: "请选择学院",
    });
  }
  if (!['number'].includes(typeof schoolId)) {
    return res.send({
      message: "请选择学校",
    });
  }
  if (!cardId) {
    return res.send({
      message: "请输入工号/学号",
    });
  }
  if (!/\d{9}/.test(Number(cardId))) {
    return res.send({
      message: "工号/学号必须由九位数字组成",
    });
  }
  if (!phone) {
    return res.send({
      message: "请输入手机号",
    });
  }
  if (!/\d{11}/.test(Number(phone))) {
    return res.send({
      message: "手机号必传由十一位数字组成",
    });
  }
  avatar = avatar ?? null
  if(Array.isArray(powerId)){
    powerId = JSON.stringify(powerId)
  }else{
    powerId = JSON.stringify([])
  }
  organizationId = organizationId ?? null
  classId = classId ? classId : null
  className = className ? className : null
  score = score ?? 0
  address = address ?? null
  let moment = new Date()
  const userCount = await dbModel.userRegister(2,[cardId])
  if(userCount[0].count){
      return res.send({
        message:"用户已存在"
      })
  }
  const phoneCount = await dbModel.userRegister(3,[phone])
  if(phoneCount[0].count){
      return res.send({
        message:"该手机号已被注册"
      })
  }
  // 进行密码加密
  const newPassword = bcrypt.hashSync(password, 10);
  const result = await dbModel.userRegister(1,[type,name,newPassword,avatar,powerId,organizationId,facultyId,schoolId,classId,className,cardId,phone,score,address,moment])
  // 注册成功后添加群用户表数据
  // 1.找到该注册用户的信息
  const userData = (await dbModel.userRegister(4,[cardId]))[0]
  // 2.找到群聊大厅的id
  const groupData = (await dbModel.userRegister(5,['群聊大厅']))[0]
  // 3.添加群用户表
  {
    const groupId = groupData.id
    const userId = userData.id
    const name = userData.name
    const tip = 0
    const shield = 0
    const moment = new Date()
    await dbModel.userRegister(6,[groupId,userId,name,tip,shield,moment])
  }
  // 注册成功后添加好友表
  // 1.搜索出全部用户的数据
  const userList = await dbModel.userRegister(7)
  if(userList.length){
    for(const user of userList){
      const status = 0
      const moment = new Date()
      if(userData.id != user.id){
        await dbModel.userRegister(8,[userData.id,user.id,status,moment])
        await dbModel.userRegister(8,[user.id,userData.id,status,moment])
      }else{
        await dbModel.userRegister(8,[userData.id,user.id,status,moment])
      }
    }
  }
  // 注册成功后添加群信息表(群聊大厅)
  {
    const userId = userData.id
    const targetId = groupData.id
    const type = 0
    const moment = new Date()
    await dbModel.userRegister(9,[userId,targetId,type,moment])
  }
  res.send({
    code:200,
    message:'注册成功'
  })
}

// 前台登录接口
exports.userLogin = async(req,res) => {
  let { type, cardId, phone, password } = req.body;
  if(type === 'phone'){
    // 手机登录
    // 根据手机找用户
    const user = await dbModel.userLogin(1,[phone])
    // 如果查询到结果为空，说明该用户不存在
    if (!user[0].count) {
      return res.send({
        message: "用户不存在！",
      });
    }
    // 校验密码
    const data = await dbModel.userLogin(3,[phone])
    const oldPassword = data[0]?.password
    const id = data[0].id
    const isValid = bcrypt.compareSync(password, oldPassword);
    if (!isValid) {
      return res.send({
        message: "用户名或密码错误！",
      });
    }
    // 返回token
    // 生成 Token 字符串
    const tokenStr = jwt.sign({id}, config.jwt.jwtSecretKey, {
      expiresIn: "10h", // token 有效期为 10 个小时
    });
    res.send({
      code: 200,
      message: "登录成功！",
      token: tokenStr,
      userId: id
    });
  }else{
    // 学号/工号登录
    // 根据学号/工号找用户
    const user = await dbModel.userLogin(2,[cardId])
    // 如果查询到结果为空，说明该用户不存在
    if (!user[0].count) {
      return res.send({
        message: "用户不存在！",
      });
    }
    // 校验密码
    const data = await dbModel.userLogin(4,[cardId])
    const oldPassword = data[0]?.password
    const id = data[0].id
    const isValid = bcrypt.compareSync(password, oldPassword);
    if (!isValid) {
      return res.send({
        message: "用户名或密码错误！",
      });
    }
    // 返回token
    // 生成 Token 字符串
    const tokenStr = jwt.sign({id}, config.jwt.jwtSecretKey, {
      expiresIn: "10h", // token 有效期为 10 个小时
    });
    res.send({
      code: 200,
      message: "登录成功！",
      token: tokenStr,
      userId: id
    });
  }
}

// 前台获取文章列表
exports.getArticlesList = async (req,res) => {
  const result = await dbModel.getArticlesList()
  for(const item of result){
    item.supportUser = JSON.parse(item.supportUser)
  }
  const type = [
    {
      type:0,
      name:'时事要闻'
    },
    {
      type:1,
      name:'新思想'
    },
    {
      type:2,
      name:'党史'
    },
    {
      type:3,
      name:'党建'
    },
    {
      type:4,
      name:'推荐'
    },
  ]
  let data = []
  for(const item of type){
    if(item.type === 4){
      item.data = result
    }else{
      item.data = result.filter(artItem => artItem.type === item.type)
    }
    data.push(item)
  }
  res.send({
    code:200,
    message:"文章列表查询成功",
    data:data,
  })
}

// 前台获取文章详情
exports.getArticleDetail = async (req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.getArticleDetail(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.getArticleDetail(1,id)
  result.forEach(item=>{
    item.supportUser = JSON.parse(item.supportUser)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 前台获取视频详情
exports.getVedioDetail = async (req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof id) && [null,undefined].includes(id)){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.getVedioDetail(2,id)
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.getVedioDetail(1,id)
  result.forEach(item=>{
    item.supportUser = JSON.parse(item.supportUser)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 前台获取个人信息
exports.getUserInfo = async (req,res) => {
  const params = req.query
  const { userId } = params
  if(!['number'].includes(typeof Number(userId))){
    return res.send({
      message:"用户id必传",
    })
  }
  const result = await dbModel.getUserInfo(1,[userId])
  for(const item of result){
    if(['number'].includes(typeof Number(item.powerId))){
      item.powerId = JSON.parse(item.powerId)
    }
    if(['number'].includes(typeof Number(item.classId))){
      item.classData = (await dbModel.getUserInfo(2,[item.classId]))[0]
    }else{
      item.classData = {}
    }
    if(['number'].includes(typeof Number(item.facultyId))){
      item.facultyData = (await dbModel.getUserInfo(3,[item.facultyId]))[0]
    }else{
      item.facultyData = {}
    }
    if(['number'].includes(typeof Number(item.organizationId))){
      item.organizationData = (await dbModel.getUserInfo(4,[item.organizationId]))[0]
    }else{
      item.organizationData = {}
    }
    if(['number'].includes(typeof Number(item.schoolId))){
      item.schoolData = (await dbModel.getUserInfo(5,[item.schoolId]))[0]
    }else{
      item.schoolData = {}
    }
    if(item.type === 0){
      item.typeData = '学生'
    }else{
      item.typeData = '教师'
    }
    item.address = item.address ?? ''
  }
  res.send({
    code:200,
    message:"个人信息查询成功",
    data:result[0],
  })
}

// 前台获取视频列表
exports.getVedioesList = async (req,res) => {
  const result = await dbModel.getVedioesList()
  for(const item of result){
    item.supportUser = JSON.parse(item.supportUser)
  }
  const type = [
    {
      type:0,
      name:'时事要闻'
    },
    {
      type:1,
      name:'新思想'
    },
    {
      type:2,
      name:'党史'
    },
    {
      type:3,
      name:'党建'
    },
    {
      type:4,
      name:'推荐'
    },
  ]
  let data = []
  for(const item of type){
    if(item.type === 4){
      item.data = result
    }else{
      item.data = result.filter(vedioItem => vedioItem.type === item.type)
    }
    data.push(item)
  }
  res.send({
    code:200,
    message:"视频列表查询成功",
    data:data,
  })
}

// 前台获取具体文章或视频列表评论列表接口
exports.getCommentList = async(req,res) => {
  const params = req.query
  let {fatherId} = params
  if(!['number','string'].includes(typeof fatherId) && [null,undefined].includes(fatherId)){
    return res.send({
      message:'请传入正确格式的fatherId'
    })
  }
  const result = await dbModel.getCommentList(1,[fatherId])
  for(const item of result){
    item.supportUser = JSON.parse(item.supportUser)
    item.fatherData = (await dbModel.getCommentList(2,[item.fatherId]))[0]
    item.userData = (await dbModel.getCommentList(3,[item.userId]))[0]
  }
  const data = result.filter(item => item.status === 1)
  res.send({
    code:200,
    message:"评论列表查询成功~",
    data:data,
  })
}

// 前台发布评论接口
exports.publishComment = async (req,res) => {
  const data = req.body
  const { content,commentType,userId,fatherId } = data
  if(!content){
    return res.send({
      message:"评论内容不可为空~"
    })
  }
  if(![0,1,2].includes(commentType)){
    return res.send({
      message:"评论类型不可为空~"
    })
  }
  if(!['number'].includes(typeof (Number(userId)))){
    return res.send({
      message:"评论用户id不可为空~"
    })
  }
  if(!['number'].includes(typeof (Number(fatherId)))){
    return res.send({
      message:"所评论的文章或视频id不可为空~"
    })
  }
  let status = 0
  let supportUser = JSON.stringify([])
  let moment = new Date()
  const result = await dbModel.publishComment(1,[content,commentType,userId,fatherId,status,supportUser,moment])
  res.send({
    code:200,
    message:"评论成功,待管理员评审通过~",
  })
}

// 前台评论点赞
exports.supportComment = async (req,res) => {
  const data = req.body
  let { id,userId } = data
  if(!['number'].includes(typeof (Number(id)))){
    return res.send({
      message:"评论id不可为空~"
    })
  }
  if(!['number'].includes(typeof (Number(userId)))){
    return res.send({
      message:"评论用户id不可为空~"
    })
  }
  const originData = await dbModel.supportComment(1,[id])
  let supportUser = JSON.parse(originData[0].supportUser)
  let messgae
  const index = supportUser.findIndex(item => item == userId)
  if(index === -1){
    supportUser.push(userId)
    messgae = '点赞成功~'
  }else{
    supportUser.splice(index,1)
    messgae = '取消点赞成功~'
  }
  supportUser = JSON.stringify(supportUser)
  const result = await dbModel.supportComment(2,[supportUser,id])
  res.send({
    code:200,
    message: messgae
  })
}

// 前台文章/视频/活动收藏
exports.userCollect = async (req,res) => {
  const data = req.body
  let { type,id,userId } = data
  if(![0,1,2].includes(type)){
    // 0文章1视频2活动
    return res.send({
      message:"类型type不可为空~"
    })
  }
  if(!['number'].includes(typeof (Number(id)))){
    return res.send({
      message:"评论id不可为空~"
    })
  }
  if(!['number'].includes(typeof (Number(userId)))){
    return res.send({
      message:"评论用户id不可为空~"
    })
  }
  const originData = await dbModel.userCollect([type,'select'],[id])
  let supportUser = JSON.parse(originData[0].supportUser)
  let messgae
  const index = supportUser.findIndex(item => item == userId)
  if(index === -1){
    supportUser.push(userId)
    messgae = '收藏成功~'
  }else{
    supportUser.splice(index,1)
    messgae = '取消收藏成功~'
  }
  supportUser = JSON.stringify(supportUser)
  const result = await dbModel.userCollect([type,'update'],[supportUser,id])
  res.send({
    code:200,
    message: messgae
  })
}

// 前台获取题目列表
exports.getPracticeList = async (req,res) => {
  const result = await dbModel.getPracticeList()
  for(const item of result){
    item.options = JSON.parse(item.options)
    item.answer = JSON.parse(item.answer)
  }
  const data = utils.getRandomArrayElements(result,5)
  res.send({
    code:200,
    message:"文章列表查询成功",
    data:data,
  })
}

// 前台用户数据更新接口
exports.updateUserInfo = async (req,res) => {
  const data = req.body
  const params = req.query
  let {name,password,avatar,phone,score,address,signMoment,sex,birthday} = data
  let {id} = params
  if(!['number'].includes(typeof Number(id))){
    return res.send({
      message: "id字段必传",
    });
  }
  const originData = await dbModel.updateUserInfo(2,[id])
  name = name ?? originData[0].name
  if(password){
    // 进行密码加密
    password = bcrypt.hashSync(password, 10);
  }else{
    password = originData[0].password
  }
  avatar = avatar ?? originData[0].avatar
  phone = phone ?? originData[0].phone
  address = address ?? originData[0].address
  if(score){
    score = originData[0].score + score
  }else{
    score = score ?? originData[0].score
  }
  if(signMoment){
    const isToday = utils.confirmIsToday(originData[0].signMoment)
    if(isToday){
      return res.send({
        message:'每天只能签到一次~'
      })
    }
    score = originData[0].score + 1
  }else{
    signMoment = originData[0].signMoment
  }
  sex = sex ?? originData[0].sex
  birthday = birthday ?? originData[0].birthday
  const result = await dbModel.updateUserInfo(1,[name,password,avatar,phone,score,address,signMoment,sex,birthday,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 前台获取收藏文章列表
exports.getLoveArticleList = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number'].includes(typeof Number(id))){
    return res.send({
      message: "id字段必传",
    });
  }
  const result = await dbModel.getLoveArticleList()
  result.forEach(item=>{
    item.supportUser = JSON.parse(item.supportUser)
  })
  const data = result.filter(item => {
    return item.supportUser.some(user => user == id)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:data
  })
}

// 前台获取收藏视频列表
exports.getLoveVedioList = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number'].includes(typeof Number(id))){
    return res.send({
      message: "id字段必传",
    });
  }
  const result = await dbModel.getLoveVedioList()
  result.forEach(item=>{
    item.supportUser = JSON.parse(item.supportUser)
  })
  const data = result.filter(item => {
    return item.supportUser.some(user => user == id)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:data
  })
}

// 前台获取评论列表
exports.getCommentList = async(req,res) => {
  const params = req.query
  let {id} = params
  if(!['number'].includes(typeof Number(id))){
    return res.send({
      message: "id字段必传",
    });
  }
  const result = await dbModel.getCommentList([id])
  result.forEach(item=>{
    item.supportUser = JSON.parse(item.supportUser)
  })
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 前台获取商品列表
exports.getGoodList = async(req,res) => {
  const result = await dbModel.getGoodList()
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 前台生成订单
exports.addOrder = async(req,res) => {
  const data = req.body
  let { userId,giftId,score,address } = data
  userId = Number(userId)
  giftId = Number(giftId)
  score = Number(score)
  if(!['number'].includes(typeof userId)){
    return res.send({
      message:"购买用户id不可为空~"
    })
  }
  if(!['number'].includes(typeof giftId)){
    return res.send({
      message:"兑换礼品id不可为空~"
    })
  }
  if(!['number'].includes(typeof score)){
    return res.send({
      message:"订单金额不可为空~"
    })
  }
  if(!address){
    return res.send({
      message:"地址不可为空~"
    })
  }
  // 默认为未发货状态
  let status = 0 
  let moment = new Date()

  const userData = await dbModel.addOrder(2,[userId])
  const afterScore = userData[0].score - score
  const giftData = await dbModel.addOrder(4,[giftId])
  const afterTotal = giftData[0].total - 1
  if(afterScore < 0){
    return res.send({
      message:'兑换失败，积分不足~'
    })
  }
  if(afterTotal < 0){
    return res.send({
      message:'兑换失败，商品库存不足~'
    })
  }

  // 生成订单
  const result = await dbModel.addOrder(1,[userId,giftId,score,status,address,moment])
  // 扣除用户score
  await dbModel.addOrder(3,[afterScore,userId])
  // 商品库存-1
  await dbModel.addOrder(5,[afterTotal,giftId])
  res.send({
    code:200,
    message:"订单生成成功~",
  })
}

// 前台获取订单列表
exports.getOrderList = async(req,res) => {
  const result = await dbModel.getOrderList(1)
  for(const item of result){
    item.giftData = (await dbModel.getOrderList(2,[item.giftId]))[0]
    item.userData = (await dbModel.getOrderList(3,[item.userId]))[0]
  }
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 前台删除订单
exports.deleteOrder = async(req,res) => {
  const data = req.body
  const { id } = data
  const result = await dbModel.deleteOrder(1,[id])
  res.send({
    code:200,
    message:"订单删除成功~",
    data:result
  })
}

// 前台获取活动地点
exports.getPlaceList = async(req,res) => {
  const result = await dbModel.getPlaceList(1)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 前台发布活动
exports.publishActive = async(req,res) => {
  const data = req.body
  let { name,placeId,body,userId,score,startTime,endTime } = data
  placeId = Number(placeId)
  userId = Number(userId)
  score = Number(score)
  if(!name){
    return res.send({
      message:"活动名称不可为空~"
    })
  }
  if(!body){
    return res.send({
      message:"活动内容不可为空~"
    })
  }
  if(!startTime){
    return res.send({
      message:"活动开始时间不可为空~"
    })
  }
  if(!endTime){
    return res.send({
      message:"活动结束时间不可为空~"
    })
  }
  if(!['number'].includes(typeof placeId)){
    return res.send({
      message:"活动地点不可为空~"
    })
  }
  if(!['number'].includes(typeof userId)){
    return res.send({
      message:"活动发布者不可为空~"
    })
  }
  if(!['number'].includes(typeof score)){
    return res.send({
      message:"活动积分不可为空~"
    })
  }

  let isPass = 1 
  let moment = new Date()
  let supportUser = JSON.stringify([])
  let joinUser = JSON.stringify([])

  // 前台发布活动
  const result = await dbModel.publishActive(1,[name,placeId,body,userId,supportUser,joinUser,score,isPass,startTime,endTime,moment])
  res.send({
    code:200,
    message:"发布活动成功~",
  })
}

// 前台获取活动列表
exports.getActiveList = async(req,res) => {
  const result = await dbModel.getActiveList(1)
  for(const item of result){
    item.placeData = (await dbModel.getActiveList(2,[item.placeId]))[0]
    item.userData = (await dbModel.getActiveList(3,[item.userId]))[0]
    if(item.userData && item.userData.organizationId){
      item.userData.organizationData = (await dbModel.getActiveList(4,[item.userData.organizationId]))[0]
    }
  }
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 前台获取文章详情
exports.getActiveDetail = async (req,res) => {
  const params = req.query
  let {id} = params
  if(!['number','string'].includes(typeof Number(id))){
    return res.send({
      message:'请传入正确格式的id'
    })
  }
  const count = await dbModel.getActiveDetail(2,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，查询失败"
    })
  }
  const result = await dbModel.getActiveDetail(1,[id])
  for(const item of result){
    item.joinUser = JSON.parse(item.joinUser)
    item.supportUser = JSON.parse(item.supportUser)
    item.placeData = (await dbModel.getActiveDetail(3,[item.placeId]))[0]
    item.userData = (await dbModel.getActiveDetail(4,[item.userId]))[0]
    if(item.userData && item.userData.organizationId){
      item.userData.organizationData = (await dbModel.getActiveDetail(5,[item.userData.organizationId]))[0]
    }
  }
  res.send({
    code:200,
    message:"查询成功",
    data:result[0]
  })
}

// 前台参与活动
exports.joinActive = async (req,res) => {
  const data = req.body
  let { id,userId } = data
  if(!['number'].includes(typeof Number(userId))){
    return res.send({
      message: "用户id不可为空~",
    });
  }
  if(!['number'].includes(typeof Number(id))){
    return res.send({
      message: "活动id不可为空~",
    });
  }
  const count = await dbModel.joinActive(1,[id])
  if(!count[0].count){
    return res.send({
      message:"数据不存在，修改失败"
    })
  }
  const originData = await dbModel.joinActive(2,[id])
  let joinUser = JSON.parse(originData[0].joinUser)
  const isJoin = joinUser.some(item => item === userId )
  if(isJoin){
    return res.send({
      message:'你已经参与过了，不可重复参与'
    })
  }else{
    joinUser.push(userId)
  }
  joinUser = JSON.stringify(joinUser)
  const result = await dbModel.joinActive(3,[joinUser,id])
  res.send({
    code:200,
    message:'活动参与成功~'
  })
}

// 前台获取用户参与活动
exports.getUserJoinActive = async(req,res) => {
  const params = req.query
  const { id } = params
  const result = await dbModel.getUserJoinActive(1)
  for(const item of result){
    item.joinUser = JSON.parse(item.joinUser)
    item.placeData = (await dbModel.getUserJoinActive(2,[item.placeId]))[0]
  }
  const joinActive = result.filter(item => item.joinUser.some(user => user == id))
  res.send({
    code:200,
    message:"查询成功",
    data:joinActive
  })
}

// 前台搜索文章或视频列表
exports.getSearchList = async(req,res) => {
  const params = req.query
  const { title,type } = params
  let result
  if(type == 0){
    result = await dbModel.getSearchList(1,title)
  }else{
    result = await dbModel.getSearchList(2,title)
  }
  
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 前台获取通讯录好友列表
exports.getFriendList = async(req,res) => {
  const params = req.query
  const { id } = params
  const result = await dbModel.getFriendList(1,[id])
  for(const item of result){
    item.userData = (await dbModel.getFriendList(2,[item.userId]))[0]
    item.friendData = (await dbModel.getFriendList(2,[item.friendId]))[0]
  }
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 前台获取通讯录群列表
exports.getGroupList = async(req,res) => {
  const params = req.query
  const { id } = params
  // 1.找出当前用户的所有群数据
  const result = await dbModel.getGroupList(1,[id])
  let groupList = []
  for(const item of result){
    const groupData = (await dbModel.getGroupList(2,[item.groupId]))[0]
    groupList.push(groupData)
  }
  for(const item of groupList){
    const groupUserList = await dbModel.getGroupList(3,[item.id])
    let userList = []
    for(const groupUser of groupUserList){
      const userData = (await dbModel.getGroupList(4,[groupUser.userId]))[0]
      userList.push(userData)
    }
    item.userList = userList
  }
  res.send({
    code:200,
    message:"查询成功",
    data:groupList
  })
}

// 前台创建消息列表
exports.addChatMessage = async(req,res) => {
  const data = req.body
  const { userId,targetId,type } = data
  if(!['number'].includes(typeof Number(userId))){
    return res.send({
      message: "用户id不可为空~",
    });
  }
  if(!['number'].includes(typeof Number(targetId))){
    return res.send({
      message: "目标id不可为空~",
    });
  }
  if(!['number'].includes(typeof Number(type))){
    return res.send({
      message: "类型不可为空~",
    });
  }
  // 1.先查询数据是否存在
  const count = (await dbModel.addChatMessage(1,[userId,targetId,type]))[0]
  if(!count.count){
    // 2.数据不存在,创建聊天信息数据
    let moment = new Date()
    const result = await dbModel.addChatMessage(2,[userId,targetId,type,moment])
    res.send({
      code:200,
      message:"创建成功",
    })
  }else{
    res.send({
      code:200,
      message:"已存在,无需创建",
    })
  }
}

// 前台用户获取消息列表
exports.getChatMessage = async(req,res) => {
  const params = req.query
  const { userId } = params
  if(!['number'].includes(typeof Number(userId))){
    return res.send({
      message: "用户id不可为空~",
    });
  }
  const result = await dbModel.getChatMessage(1,[userId])
  for(const chat of result){
    if(chat.type == 0){
      // 群
      chat.targetData = (await dbModel.getChatMessage(2,[chat.targetId]))[0]
    }else{
      // 好友
      chat.targetData = (await dbModel.getChatMessage(3,[chat.targetId]))[0]
      let result
      if(userId != chat.targetId){
        const userList = await dbModel.getMessageInfo(1,[userId,chat.targetId])
        const friendList = await dbModel.getMessageInfo(1,[chat.targetId,userId])
        result = [...userList,...friendList]
      }else{
        result = await dbModel.getMessageInfo(1,[userId,chat.targetId])
      }
      result.sort((a,b) => {
        const timeA = new Date(a.moment)
        const timeB = new Date(b.moment)
        return timeB - timeA
      })
      chat.lastMessageData = result[0]
    }
  }
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 前台用户获取好友聊天信息
exports.getMessageInfo = async(req,res) => {
  const params = req.query
  const { userId,friendId } = params
  if(!['number'].includes(typeof Number(userId))){
    return res.send({
      message: "用户id不可为空~",
    });
  }
  if(!['number'].includes(typeof Number(friendId))){
    return res.send({
      message: "好友id不可为空~",
    });
  }
  let result
  if(userId != friendId){
    const userList = await dbModel.getMessageInfo(1,[userId,friendId])
    const friendList = await dbModel.getMessageInfo(1,[friendId,userId])
    result = [...userList,...friendList]
  }else{
    result = await dbModel.getMessageInfo(1,[userId,friendId])
  }
  result.sort((a,b) => {
    const timeA = new Date(a.moment)
    const timeB = new Date(b.moment)
    return timeA - timeB
  })
  for(const item of result){
    item.userData = (await dbModel.getMessageInfo(2,[item.userId]))[0]
    item.friendData = (await dbModel.getMessageInfo(2,[item.friendId]))[0]
  }
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 前台用户获取群信息
exports.getGroupMessageInfo = async(req,res) => {
  const params = req.query
  const { groupId } = params
  if(!['number'].includes(typeof Number(groupId))){
    return res.send({
      message: "群id不可为空~",
    });
  }
  let result = await dbModel.getGroupMessageInfo(1,[groupId])
  result.sort((a,b) => {
    const timeA = new Date(a.moment)
    const timeB = new Date(b.moment)
    return timeA - timeB
  })
  for(const item of result){
    item.userData = (await dbModel.getGroupMessageInfo(2,[item.userId]))[0]
  }
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 前台用户发送信息
exports.sendMessage = async(req,res) => {
  const data = req.body
  let { userId,friendId,message,type } = data
  let status = 0
  let moment = new Date()
  if(type == 0){
    // 文字
    await dbModel.sendMessage(1,[userId,friendId,message,type,status,moment])
  }else if(type == 1){
    // 图片链接
  }else if(type == 2){
    // 音频链接
  }
  res.send({
    code:200,
    message:"发送信息成功",
  })
}

// 前台用户发送群信息
exports.sendGroupMessage = async(req,res) => {
  const data = req.body
  let { groupId,userId,message,type } = data
  let status = 0
  let moment = new Date()
  if(type == 0){
    // 文字
    await dbModel.sendGroupMessage(1,[groupId,userId,message,type,status,moment])
  }else if(type == 1){
    // 图片链接
  }else if(type == 2){
    // 音频链接
  }
  res.send({
    code:200,
    message:"发送信息成功",
  })
}