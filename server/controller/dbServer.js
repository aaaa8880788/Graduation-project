const dbModel = require('../lib/db')
const config = require('../config/default')
// 用这个包来加密字符串
const bcrypt = require("bcryptjs")
// 用这个包来生成 Token 字符串
const jwt = require("jsonwebtoken");

// 1.管理员注册
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

// 2.管理员登录
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

// 3.管理员查询
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

// 4.管理员删除(超级管理员不允许删除)
exports.deleteManager = async (req,res) => {
  const { type,id } = req.body
  if(type === 0){
    res.send({
      message:"超级管理员不支持删除"
    })
  }else if(type === 1){
    const result = await dbModel.deleteManager(id)
    console.log(result);
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