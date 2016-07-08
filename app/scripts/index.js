'use strict';

$(() => {
  const hostAddress = 'https://wall.cgcgbcbc.com/';
  let oldData = [];

  $.ajax({
    url: 'https://wall.cgcgbcbc.com/api/messages?num=3',
    type: 'get',
    async: false,
    success: (data) => {
      data.forEach((element, index) => {
        data[index].nickname = twemoji.parse(data[index].nickname);
        data[index].content = twemoji.parse(data[index].content);
      });
      Array.prototype.push.apply(oldData, data);
    }
  });

  $('img.lazy').lazyload({
    effect: 'fadeIn'
  });

  const nomMsg = new Vue({
    el: '#container',
    data: {
      items: oldData.reverse()
    }
  });

  const admMsg = new Vue({
    el: '#admin',
    data: {
      item: ''
    }
  });

  let timeID = 0;
  $('#admin').bind('DOMSubtreeModified', () => {
    clearTimeout(timeID);
    $('#admin').css('display', 'flex');
    timeID = setTimeout(() => {
      $('#admin').css('display', 'none');
    }, 10000);
  });

  const socket = io.connect(hostAddress);

  socket.on('connect', () => {
    console.log('Connected!');
  });

  socket.on('new message', (data) => {
    let item = {
      content: twemoji.parse(data.content) || '未接收到消息',
      nickname: twemoji.parse(data.nickname) || '匿名用户',
      headimgurl: data.headimgurl || '/images/anonymous.jpg'
    };
    console.log(item);
    nomMsg.items.push(item);
    if (nomMsg.items.length > 3) {
      nomMsg.items.shift();
    }
  });

  socket.on('admin', (data) => {
    admMsg.item = twemoji.parse(data.content);
    console.log(admMsg.item);
  });
});
