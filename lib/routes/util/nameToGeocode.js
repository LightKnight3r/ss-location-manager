const _ = require('lodash')
const config = require('config')
const rp = require('request-promise')
const async = require('async')
const utils = require('../../util/utils')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')

module.exports = (req, res) => {
  const text = _.get(req, 'body.text', '');

  const options = {
    method: 'POST',
    uri: `${config.proxyRequestServer.google}/api/v1.0/google/name-to-location`,
    body: {
        text: text
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

  // googleMapsClient.geocode({
  //   address: `${text}`,
  //   language: 'vi',
  //   components: {
  //     country: 'VN',
  //   }
  // }, (err, response) => {
  //   response = response.json ? response.json : {};
  //   if(response.status !== 'OK') {
  //     return res.json({
  //       code: CONSTANTS.CODE.FAIL
  //     })
  //   }
  //
  //   res.json({
  //     code: CONSTANTS.CODE.SUCCESS,
  //     data: response.results[0].geometry.location,
  //     name: response.results[0].formatted_address
  //   })
  // });
}
