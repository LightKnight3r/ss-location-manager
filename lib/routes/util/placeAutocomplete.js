const _ = require('lodash')
const config = require('config')
const rp = require('request-promise')
const async = require('async')
const utils = require('../../util/utils')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')

module.exports = (req, res) => {
  const input = _.get(req, 'body.input', '');

  if(!input) {
    return res.json({
      predictions: [
        
      ],
      status: 'OK'
    })
  }

  const options = {
    method: 'POST',
    uri: `${config.proxyRequestServer.google}/api/v1.0/google/place-autocomplete`,
    body: {
        input: input
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
  // googleMapsClient.placesAutoComplete({
  //   input: input,
  //   language: 'vi',
  //   types: 'address',
  //   location: [21.0227431, 105.8194541],
  //   components: {country: 'vn'}
  // }, (err, response) => {
  //   res.json(response.json);
  // });
}
