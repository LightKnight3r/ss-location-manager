const apn = require('apn')
const config = require('config')
const _ = require('lodash')
const ms = require('ms')

class ApnConnection {
  constructor() {
    this.connectInfo = null // connection, lastUsed
    this.init()
  }

  init() {
    // const expireTime = ms(_.get(config, 'ios.apn.expireTime'))
    // setInterval(this.watchConnection, expireTime)
  }

  getConnection() {
    if(this.connectInfo) {
      this.connectInfo.lastUsed = Date.now()
      return Promise.resolve(this.connectInfo.connection)
    }

    return this.createConnection()
  }

  createConnection() {
    logger.logInfo(`createConnection`)

    return new Promise((resolve, reject) => {
      const options = _.get(config, 'ios.apn.options', {})
      const connection = new apn.Provider(options)
      this.connectInfo = {
        connection,
        lastUsed: Date.now()
      }

      return resolve(connection)
    })
  }

  destroyConnection() {
    logger.logInfo('destroyConnection')

    if(this.connectInfo) {
      this.connectInfo.connection.shutdown()
    }

    this.connectInfo = null
  }

  watchConnection() {
    // globalVariables.get('logger').logInfo('watchConnection')
    //
    // if(this.connectInfo) {
    //   const expireTime = ms(_.get(config, 'ios.apn.expireTime'))
    //   if((Date.now() - this.connectInfo.lastUsed) > expireTime) {
    //     this.destroyConnection()
    //   }
    // }
  }
}

module.exports = new ApnConnection
