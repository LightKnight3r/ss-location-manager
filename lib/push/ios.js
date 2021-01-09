const apn = require('apn')
const async = require('async')
const _ = require('lodash')
const config = require('config')
const ApnManager = require('../connections/apn')

class IOSPush {
  push(token, title, description, data) {
    return new Promise((resolve, reject) => {
      const notiObj = new apn.Notification()
      notiObj.badge = 1
      notiObj.title = title
      notiObj.sound = "default"
      notiObj.body = description
      notiObj.topic = _.get(config, 'ios.apn.bundleId', '')
      notiObj.payload = data || {}

      ApnManager
        .getConnection()
        .then((connection) => {
          return connection.send(notiObj, token)
        })
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          ApnManager.destroyConnection();
          reject(err);
        })

      // async.retry({times: _.get(config, 'ios.apn.retry', 2)}, (done) => {
      //   ApnManager
      //     .getConnection()
      //     .then((connection) => {
      //       return connection.send(notiObj, token)
      //     })
      //     .then((result) => {
      //       done(null, result)
      //     })
      //     .catch((err) => {
      //       ApnManager.destroyConnection();
      //       done(err);
      //     })
      // }, (err, result) => {
      //   if(err) {
      //     return reject(err);
      //   }
      //
      //   resolve(result);
      // })
    })
  }
}


module.exports = new IOSPush
