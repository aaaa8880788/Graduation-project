const express = require("express")
const path = require("path")
// 基本变量
const config = require('./config/default')

const app = express()
// 解决跨域
app.use(require("cors")());
// 解析json
app.use(express.json());

// 使用 `express.static()` 中间件，将 `uploads` 目录中的图片托管为静态资源
// 托管静态资源文件
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));




// 引入服务端路由
require('./routes/admin/index')(app)

// 定义错误级别中间件
app.use((err, req, res, next) => {
  // 捕获身份认证失败的错误
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({
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



