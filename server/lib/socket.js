const controller = require('../controller/dbServer')
const { Server } = require('socket.io')
const io = new Server(3001,{
  cors: true
});
const users = {} // 用户id缓存区
io.on('connection', (socket) => {
  
  // 接收-用户登陆
  socket.on('userLogin', id => {
    // socket.emit('login', id)// 发送-回复客户端
    socket.name = id      // 以用户id为socket连接名称
    users[id] = socket.id // 每次生成唯一 socket id
    console.log('userLogin---',users);
  })

  // 接收-私聊消息
  socket.on('userMessage', async(data) => {
    const { userId,friendId } = data
    // 存储私聊消息到数据库
    const reuslt = await controller.sendMessageSocket(data)
    // 发送-to好友
    if(userId != friendId && users[friendId]){
      socket.to(users[friendId]).emit('userMessage', reuslt)
    }
    // 发送-to自己
    socket.emit('userMessage', reuslt)
  }) 

  // 接收-群聊消息
  socket.on('groupMessage', async(data) => {
    console.log('data----',data);
    console.log('users----',users);
    const { userId } = data
    // 存储私聊消息到数据库
    const reuslt = await controller.sendGroupMessage(data)
    console.log('reuslt.groupUser---',reuslt.groupUser);
    // 广播-to所有群友(除了自己)
    for(const item of reuslt.groupUser){
      if(item.userId != userId && users[item.userId]){
        socket.to(users[item.userId]).emit('groupMessage', reuslt.groupMessage)
      }
    }
    // 发送-to自己
    socket.emit('groupMessage', reuslt.groupMessage)
  }) 

  // 接收-用户断开
  socket.on('disconnect', () => {
    if(users.hasOwnProperty(socket.name)){  // 每次进入时看是否有重复名称
      delete users[socket.name]
    }
  })
})