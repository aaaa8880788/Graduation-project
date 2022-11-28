const dbModel = require('../lib/db')
const config = require('../config/default')
// 用这个包来加密字符串
const bcrypt = require("bcryptjs")
// 用这个包来生成 Token 字符串
const jwt = require("jsonwebtoken");

// 管理员注册
exports.registerAdmin = async (req, res) => {
  const data = req.body;
  let { name,password,type,powerId } = data
  if (!name || !password) {
    return res.send({
      message: "name && password字段不可为空",
    });
  }
  if (![0,1].includes(type)) {
    return res.send({
      message: "type必传，0为超级管理员1为教师",
    });
  }
  if(type === 0){
    const reg = /^[A-Za-z]+$/;
    if (!reg.test(name) || !reg.test(password)) {
      return res.send({
        message: "超级管理员账号和密码只能由字母组成!",
      });
    }
  }else if (type === 1){
    const reg = /^[0-9]{12}$/;
    if(!reg.test(name) ){
      return res.send({
        message: "账号只能由12位数字的工号组成",
      });
    }
  }
  // 根据用户名查找用户
  const userCount = await dbModel.registerAdmin(1,[name])
  if (userCount[0].count) {
    return res.send({
      message: "用户已存在，请重新输入用户名",
    });
  }
  // 进行密码加密
  const newPassword = bcrypt.hashSync(password, 10);
  const result = await dbModel.registerAdmin(2,[name,newPassword,type,powerId])
  res.send({
    code:200,
    message:"注册成功",
  });
}

// 管理员登录
exports.loginAdmin = async (req, res) => {
  let { name, password } = req.body;

  // 1.根据用户名找用户
  const user = await dbModel.loginAdmin(1,[name])
  if (!user[0].count) {
    // 如果查询到结果为空，说明该用户不存在
    return res.send({
      message: "用户不存在！",
    });
  }

  // 2.校验密码
  const data = await dbModel.loginAdmin(2,[name])
  const oldPassword = data[0].password
  const id = data[0].id
  const isValid = bcrypt.compareSync(password, oldPassword);

  if (!isValid) {
    return res.send({
      message: "用户名或密码错误！",
    });
  }

  // 3.返回token
  // 生成 Token 字符串
  const tokenStr = jwt.sign({id}, config.jwt.jwtSecretKey, {
    expiresIn: "10h", // token 有效期为 10 个小时
  });
  res.send({
    message: "登录成功！",
    status: "Ok",
    token: tokenStr,
  });
}

// 管理员查询
exports.findManagers = async (req,res) => {
  const params = req.query
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  const result = await dbModel.findManagers(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 管理员删除(超级管理员不允许删除)
exports.deleteManager = async (req,res) => {
  const { type,id } = req.body
  if(!id){
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
  if(!id){
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
  pageSize = pageSize ?? 10
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
  if(!id){
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
  const result = await dbModel.addRole(1,[name,introduce,request])
  res.send({
    code:200,
    message:'角色添加成功'
  })
}

// 角色修改
exports.updateRole = async (req,res) => {
  const data = req.body
  let {name,introduce,request,id} = data
  if(!id){
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
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  const result = await dbModel.findRoles(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 角色删除
exports.deleteRole = async (req,res) => {
  const { id } = req.body
  if(!id){
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
  const result = await dbModel.addOrganization(1,[name,introduce])
  res.send({
    code:200,
    message:'组织添加成功'
  })
}

// 组织修改
exports.updateOrganization = async (req,res) => {
  const data = req.body
  let {name,introduce,id} = data
  if(!id){
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
  name = name ?? originData[0].name
  introduce = introduce ?? originData[0].introduce
  console.log(name,introduce);
  const result = await dbModel.updateOrganization(1,[name,introduce,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 组织查询
exports.findOrganizations = async (req,res) => {
  const params = req.query
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  const result = await dbModel.findOrganizations(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 组织删除
exports.deleteOrganization = async (req,res) => {
  const { id } = req.body
  if(!id){
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
      message: "name字段（院系名称例如：信息科学与技术学院）必传，",
    });
  }
  const facultyCount = await dbModel.addFaculty(2,[name])
  if(facultyCount[0].count){
      return res.send({
        message:"该院系已存在，请重新选择"
      })
  }
  const result = await dbModel.addFaculty(1,[name])
  res.send({
    code:200,
    message:'院系添加成功'
  })
}

// 学院修改
exports.updateFaculty = async (req,res) => {
  const data = req.body
  let {name,id} = data
  if(!id){
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
  name = name ?? originData[0].name
  const result = await dbModel.updateFaculty(1,[name,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 学院查询
exports.findFaculties = async (req,res) => {
  const params = req.query
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  const result = await dbModel.findFaculties(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 学院删除
exports.deleteFaculty = async (req,res) => {
  const { id } = req.body
  if(!id){
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
      message: "name字段（学校名字：仲恺农业工程学院）必传，",
    });
  }
  const facultyCount = await dbModel.addSchool(2,[name])
  if(facultyCount[0].count){
      return res.send({
        message:"该学校已存在，请重新选择"
      })
  }
  const result = await dbModel.addSchool(1,[name,logo])
  res.send({
    code:200,
    message:'学校添加成功'
  })
}

// 学校修改
exports.updateSchool = async (req,res) => {
  const data = req.body
  let {name,logo,id} = data
  if(!id){
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
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  const result = await dbModel.findSchools(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 学校删除
exports.deleteSchool = async (req,res) => {
  const { id } = req.body
  if(!id){
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
  classData = JSON.stringify(classData)
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
  if (!classData) {
    return res.send({
      message: "className字段（班级数组如：[192,202]）必传，",
    });
  }
  if (!facultyId) {
    return res.send({
      message: "facultyId字段（院系id）必传，",
    });
  }
  const classCount = await dbModel.addClass(2,[name,classData,facultyId])
  if(classCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addClass(1,[name,title,classData,facultyId])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 专业班级修改
exports.updateClass = async (req,res) => {
  const data = req.body
  let {name,title,classData,facultyId,id} = data
  classData = JSON.stringify(classData)
  if(!id){
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
  classData = classData ?? originData[0].classData
  facultyId = facultyId ?? originData[0].facultyId
  const result = await dbModel.updateClass(1,[name,title,classData,facultyId,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 专业班级查询
exports.findClasses = async (req,res) => {
  const params = req.query
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  const result = await dbModel.findClasses(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 专业班级删除
exports.deleteClass = async (req,res) => {
  const { id } = req.body
  if(!id){
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
  let {type,name,avatar,powerId,organizationId,facultyId,schoolId,classId,className,cardId,phone,score} = data
  powerId = JSON.stringify(powerId)
  score = score ?? 0
  if (!type) {
    return res.send({
      message: "type字段（0学生1教师）必传，",
    });
  }
  if (!name) {
    return res.send({
      message: "name字段（姓名）必传，",
    });
  }
  if (!facultyId) {
    return res.send({
      message: "facultyId字段（院系id）必传，",
    });
  }
  if (!schoolId) {
    return res.send({
      message: "schoolId字段（学校id）必传，",
    });
  }
  if (!classId) {
    return res.send({
      message: "classId字段（专业id）必传，",
    });
  }
  if (!className) {
    return res.send({
      message: "className字段（班级如：192）必传，",
    });
  }
  if (!cardId) {
    return res.send({
      message: "cardId字段（工号、学号）必传，",
    });
  }
  if (!phone) {
    return res.send({
      message: "phone字段（手机号）必传，",
    });
  }
  const userCount = await dbModel.addUser(2,[cardId])
  if(userCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addUser(1,[type,name,avatar,powerId,organizationId,facultyId,schoolId,classId,className,cardId,phone,score])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 用户修改
exports.updateUser = async (req,res) => {
  const data = req.body
  let {type,name,avatar,powerId,organizationId,facultyId,schoolId,classId,className,cardId,phone,score,id} = data
  powerId = JSON.stringify(powerId)
  if(!id){
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
  organizationId = organizationId ?? originData[0].organizationId
  facultyId = facultyId ?? originData[0].facultyId
  schoolId = schoolId ?? originData[0].schoolId
  classId = classId ?? originData[0].classId
  className = className ?? originData[0].className
  cardId = cardId ?? originData[0].cardId
  phone = phone ?? originData[0].phone
  score = score ?? originData[0].score
  const result = await dbModel.updateUser(1,[type,name,avatar,powerId,organizationId,facultyId,schoolId,classId,className,cardId,phone,score,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 用户查询
exports.findUsers = async (req,res) => {
  const params = req.query
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  const result = await dbModel.findUsers(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 用户删除
exports.deleteUser = async (req,res) => {
  const { id } = req.body
  if(!id){
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
  supportUser = JSON.stringify(supportUser)
  if (!title) {
    return res.send({
      message: "title字段（文章标题）必传",
    });
  }
  if (!([0,1,2,3,4,5].includes(type))) {
    return res.send({
      message: "type字段（文章类型0时事要闻1新思想2党史3党建）必传",
    });
  }
  if (!body) {
    return res.send({
      message: "body字段（文章内容）必传",
    });
  }
  const articleCount = await dbModel.addArticle(2,[title,type])
  if(articleCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addArticle(1,[title,type,body,supportUser])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 文章修改
exports.updateArticle = async (req,res) => {
  const data = req.body
  let {title,type,body,supportUser,id} = data
  supportUser = JSON.stringify(supportUser)
  if(!id){
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
  supportUser = supportUser ?? originData[0].supportUser
  const result = await dbModel.updateArticle(1,[title,type,body,supportUser,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 文章查询
exports.findArticles = async (req,res) => {
  const params = req.query
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  const result = await dbModel.findArticles(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 文章删除
exports.deleteArticle = async (req,res) => {
  const { id } = req.body
  if(!id){
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
  let {title,type,body,vedio,supportUser} = data
  supportUser = JSON.stringify(supportUser)
  if (!title) {
    return res.send({
      message: "title字段（视频标题）必传",
    });
  }
  if (!([0,1,2,3,4,5].includes(type))) {
    return res.send({
      message: "type字段（视频类型0时事要闻1新思想2党史3党建）必传",
    });
  }
  if (!body) {
    return res.send({
      message: "body字段（视频内容）必传",
    });
  }
  if (!vedio) {
    return res.send({
      message: "vedio字段（视频地址）必传",
    });
  }
  const articleCount = await dbModel.addVedio(2,[title,type])
  if(articleCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addVedio(1,[title,type,body,vedio,supportUser])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 视频修改
exports.updateVedio = async (req,res) => {
  const data = req.body
  let {title,type,body,vedio,supportUser,id} = data
  supportUser = JSON.stringify(supportUser)
  if(!id){
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
  supportUser = supportUser ?? originData[0].supportUser
  const result = await dbModel.updateVedio(1,[title,type,body,vedio,supportUser,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 视频查询
exports.findVedioes = async (req,res) => {
  const params = req.query
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  const result = await dbModel.findVedioes(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 视频删除
exports.deleteVedio = async (req,res) => {
  const { id } = req.body
  if(!id){
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
  let {name,placeId,body,userId,supportUser,joinUser,score} = data
  supportUser = JSON.stringify(supportUser)
  joinUser = JSON.stringify(joinUser)
  isPass =  1
  score = score ?? 0
  if (!name) {
    return res.send({
      message: "name字段（活动名称）必传",
    });
  }
  if (!placeId) {
    return res.send({
      message: "placeId字段（活动地点）必传",
    });
  }
  if (!body) {
    return res.send({
      message: "body字段（活动内容）必传",
    });
  }
  if (!userId) {
    return res.send({
      message: "userId字段（活动发起人id）必传",
    });
  }
  const activeCount = await dbModel.addActive(2,[name])
  if(activeCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addActive(1,[name,placeId,body,userId,supportUser,joinUser,score,isPass])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 活动修改
exports.updateActive = async (req,res) => {
  const data = req.body
  let {name,placeId,body,userId,supportUser,joinUser,score,isPass,id} = data
  supportUser = JSON.stringify(supportUser)
  joinUser = JSON.stringify(joinUser)
  if(!id){
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
  supportUser = supportUser ?? originData[0].supportUser
  joinUser = joinUser ?? originData[0].joinUser
  score = score ?? originData[0].score
  isPass = isPass ?? originData[0].isPass
  const result = await dbModel.updateActive(1,[name,placeId,body,userId,supportUser,joinUser,score,isPass,id])
  res.send({
    code:200,
    message:'修改成功'
  })
}

// 活动查询
exports.findActives = async (req,res) => {
  const params = req.query
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  const result = await dbModel.findActives(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 活动删除
exports.deleteActive = async (req,res) => {
  const { id } = req.body
  if(!id){
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
  status = status ?? 1
  if (!name) {
    return res.send({
      message: "name字段（活动地点）必传",
    });
  }
  if (!volume) {
    return res.send({
      message: "volume字段（容纳人数）必传",
    });
  }
  const placeCount = await dbModel.addPlace(2,[name])
  if(placeCount[0].count){
      return res.send({
        message:"数据已存在，请重新选择"
      })
  }
  const result = await dbModel.addPlace(1,[name,status,volume])
  res.send({
    code:200,
    message:'添加成功'
  })
}

// 活动地点修改
exports.updatePlace = async (req,res) => {
  const data = req.body
  let {name,status,volume,id} = data
  if(!id){
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
  let {page,pageSize} = params
  page = page ?? 1
  pageSize = pageSize ?? 10
  const result = await dbModel.findPlaces(page,pageSize)
  res.send({
    code:200,
    message:"查询成功",
    data:result
  })
}

// 活动地点删除
exports.deletePlace = async (req,res) => {
  const { id } = req.body
  if(!id){
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