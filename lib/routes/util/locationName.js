const _ = require('lodash')
const rp = require('request-promise')
const config = require('config')
const async = require('async')
const utils = require('../../util/utils')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')

module.exports = (req, res) => {
  const lat = _.get(req, 'body.lat', '');
  const lng = _.get(req, 'body.lng', '');

  const checkParams = (next) => {
    if(!lat || !lng) {
      return next({
        code: CONSTANTS.CODE.SUCCESS,
        data: 'Unnamed Road'
      });
    }

    next();
  }

  const getLocationName = (next) => {
    const options = {
      method: 'POST',
      uri: `${config.proxyRequestServer.google}/api/v1.0/google/get-location-name`,
      body: {
          lat: lat,
          lng: lng
      },
      json: true // Automatically stringifies the body to JSON
    };

    rp(options)
      .then((result) => {
        next(null, result);
      })
      .catch((err) => {
        next(err);
      });
  //   googleMapsClient.reverseGeocode({
  //    latlng: [lat, lng],
  //  }, (err, data) => {
  //    if(err || !data) {
  //      return next(err || new Error(`No reponse from Google`));
  //    }
   //
  //    data = data.json;
  //    if(data.status !== 'OK') {
  //      return next({
  //        code: CONSTANTS.CODE.SUCCESS,
  //        data: 'Unnamed Road'
  //      });
  //    }
   //
  //    next(null, {
  //      code: CONSTANTS.CODE.SUCCESS,
  //      data: data.results[0] ? data.results[0].formatted_address :'Unnamed Road'
  //    });
  //  });
  }

  async.waterfall([
    checkParams,
    getLocationName
  ], (err, data) => {
    logger.logInfo(err, data);

    err && _.isError(err) && (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: message.SYSTEM.ERROR
    });

    res.json(data || err);
  })
}
