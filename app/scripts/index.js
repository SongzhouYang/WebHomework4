'use strict';

$(() => {
  const hostAddress = 'https://wall.cgcgbcbc.com/';
  let oldData = [];

  $.ajax({
    url: 'https://wall.cgcgbcbc.com/api/messages?num=3',
    type: 'get',
    async: false,
    success: (data) => {
      Array.prototype.push.apply(oldData, data);
    }
  });

  const nomMsg = new Vue({
    el: '#container',
    data: {
      items: oldData
    }
  });

  const admMsg = new Vue({
    
  });

  Vue.transition('animate', {
    enterClass: 'slideInRight',
    leaveClass: 'slideOutLeft'
  });

  const socket = io.connect(hostAddress);

  socket.on('connect', () => {
    console.log('Connected!');
  });

  socket.on('new message', (data) => {
    let item = {
      content: data.content || '未接收到消息',
      nickname: data.nickname || '匿名用户',
      headimgurl: data.headimgurl || '/images/anonymous.jpg'
    };
    console.log(item);
    nomMsg.items.push(item);
    if (nomMsg.items.length > 3) {
      nomMsg.items.shift();
    }
  });

  socket.on('admin', (data) => {
    console.log(data);
  });
});
