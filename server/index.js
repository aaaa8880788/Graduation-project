const express = require("express")
const path = require("path")
// 基本变量
const config = require('./config/default')

const app = express()

// 使用 `express.static()` 中间件，将 `uploads` 目录中的图片托管为静态资源
// 托管静态资源文件
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
// 解析json
app.use(express.json());

// 设置允许跨域访问改服务
app.all('*',function(req,res,next){
  res.header("Access-Control-Allow-Origin","*")
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Credentials",true)
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By",'3.2.1')
  // 这段仅仅为了方便返回json而已
  res.header("Content-Type","application/json;charset=utf-8")
  if(req.method === 'OPTIONS'){
    // 让options请求快速返回
    res.sentStatus(200)
  }else{
    next()
  }
})

// 引入服务端路由
require('./routes/admin/index')(app)

// 定义错误级别中间件
app.use((err, req, res, next) => {
  // 捕获身份认证失败的错误
  if (err.name === "UnauthorizedError") {
    return res.send({
      code:401,
      message:"无效token"
    })
  }
  // 未知错误
  res.send(err);
});

app.listen(config.port,()=>{
  console.log(`服务已开启：http://localhost:${config.port}`);
})



