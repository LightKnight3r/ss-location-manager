const gcm = require('node-gcm')
const _ = require('lodash')
const config = require('config')
const async = require('async')

const Sender = new gcm.Sender(_.get(config, 'google.fcm.apiKey', ''))

class AndroidPush {
  push(token, title, description, data) {
    return new Promise((resolve, reject) => {
      const dataSent = _.merge({}, {title, description}, data);
      const message = new gcm.Message({
        priority: 'high',
        data: dataSent,
        sound: 'default'
      });

      Sender.send(message, { registrationTokens: [token] }, _.get(config, 'google.fcm.retry', 2), (err, result) => {
        if(err) {
          return reject(err);
        }

        resolve(result);
      })
    })
  }
}

module.exports = new AndroidPush
