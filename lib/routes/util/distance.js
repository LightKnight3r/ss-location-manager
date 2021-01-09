const _ = require('lodash')
const config = require('config')
const Joi = require('joi')
const rp = require('request-promise')
const async = require('async')
const utils = require('../../util/utils')
const OrderTypeModel = require('../../models/orderType');
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')

const schemaInput = {
  "origin": Joi.object().keys({
    "lat": Joi.number().required(),
    "lng": Joi.number().required()
  }).required(),
  "destination": Joi.array().items(Joi.object().keys({
    "lat": Joi.number().required(),
    "lng": Joi.number().required()
  }).required()).required()
}

module.exports = (req, res) => {
  !_.isArray(req.body.destination) && (req.body.destination = [req.body.destination]); // make sure req.body.destination always is array

  const checkParams = (next) => {
    const result = Joi.validate(req.body, schemaInput);

    if(result.error) {
      return next({
        code: CONSTANTS.CODE.WRONG_PARAMS,
        message: MESSAGES.SYSTEM.ERROR
      })
    }

    next(null);
  }

  const getDistance = (next) => {
    const options = {
      method: 'POST',
      uri: `${config.proxyRequestServer.google}/api/v1.0/google/get-distance`,
      body: {
          origin: req.body.origin,
          destination: req.body.destination
      },
      json: true // Automatically stringifies the body to JSON
    };

    rp(options)
      .then((result) => {
        if(result.code === CONSTANTS.CODE.SUCCESS) {
          return next({
            code: CONSTANTS.CODE.SUCCESS,
            data: result.data
          })

          return next({
            code: CONSTANTS.CODE.FAIL,
            message: MESSAGES.SYSTEM.ERROR
          })
        }
      })
      .catch((err) => {
        return res.json({
          code: CONSTANTS.CODE.SYSTEM_ERROR,
          message: MESSAGES.SYSTEM.ERROR
        });
      });
  }

  async.waterfall([
    checkParams,
    getDistance
  ], (err, data) => {
    err && _.isError(err) && (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: MESSAGES.SYSTEM.ERROR
    });

    res.json(data || err);
  });


}
