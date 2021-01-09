const _ = require('lodash')
const config = require('config')
const rp = require('request-promise')
const async = require('async')
const utils = require('../../util/utils')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')

module.exports = (req, res) => {
  const placeid = _.get(req, 'body.placeid', '');

  const options = {
    method: 'POST',
    uri: `${config.proxyRequestServer.google}/api/v1.0/google/place-detail`,
    body: {
        placeid: placeid
    },
    json: true // Automatically stringifies the body to JSON
  };

  rp(options)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: MESSAGES.SYSTEM.ERROR
      })
    });
  // googleMapsClient.place({
  //   placeid: placeid,
  //   language: 'vi'
  // }, (err, response) => {
  //   res.json(response.json);
  // });
}
