
//引入chat函数对象
const {ChatModel} = require('../db/models')
module.exports = function (server) {

  // 创建io对象(管理对象, 管理所有浏览器与服务器的连接)
  const io = require('socket.io')(server)
  //绑定监听是否有浏览器连接

  io.on('connection',function (socket) {
    console.log('有一个浏览器连接上了');

    //接受浏览器发送消息
    socket.on('sendMsg',function ({content, from, to}) {
      console.log('服务器收到消息', {content, from, to})

      // 保存到数据库chats集合
      //拿到创建时间
      const create_time = Date.now();

     const chat_id = [from, to].sort().join("-") // 保证2个人相互聊天结果一样

      //拿到chatmsg
     const chatMsg = {content, from, to, create_time, chat_id}


      new ChatModel(chatMsg).save(function (error,chatMsgDoc) {

        //群发消息
        io.emit('receiveMsg', chatMsgDoc)
      })

      // 发送给所有连接上的浏览器


    })

  })


}