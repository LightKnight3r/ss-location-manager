const rp = require('request-promise')

class SocketManager {
  constructor(io) {
    this.socket = null;
    this.map = {}; // userId => socket
  }

  setSocket(io) {
    this.io = io;
    this.setUpEvent();
  }

  getSocket() {
    return this.io;
  }

  isConnect(userId) {
    if(this.map[userId]) {
      return true;
    }

    return false;
  }

  sendToMember(userId, eventName, data, cb) {
    this.map[userId].emit(eventName, data, cb);
  }

  setUpEvent() {
    const self = this;
    // Socket
    this.io.on('connection', (socket) => {
      socket.on('login', (data, cb) => {
        cb = cb || function () {};
        console.log('login', data);

        const memberToken = data.memberToken;
        const options = {
          method: 'POST',
          uri: `https://api.sanship.vn/api/v2.0/member/get-user-id`,
          body: {
            memberToken: memberToken
          },
          json: true // Automatically stringifies the body to JSON
        };

        rp(options)
        .then((result) => {
          if(result.code !== 200) {
            return cb({
              code: 300
            });
          }

          const userId = result.data.userId;
          socket.userId = userId;
          this.map[userId] = socket;

          cb({
            code: 200
          })
        })
        .catch((err) => {
          cb({
            code: 300
          })
        });
      });

      socket.on('disconnect', (reason) => {
        console.log('disconnect');
        if(socket.userId) {
          delete this.map[socket.userId];
        }
      });
    });
  }
}

module.exports = new SocketManager;
