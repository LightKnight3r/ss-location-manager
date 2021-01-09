const _ = require('lodash')
const config = require('config')
const rp = require('request-promise')
const async = require('async')
const Joi = require('joi')
const utils = require('../../util/utils')
const OrderTypeModel = require('../../models/orderType');
const orderHelper = require('../../util/order');
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
  let orderType = _.get(req, 'body.orderType', '');
  orderType = orderType || "594b351ed177170872f2b257";

  let orderTypeInf;
  let distance;
  let polylines;

  const checkParams = (next) => {
    const result = Joi.validate(req.body, schemaInput, {allowUnknown: true, convert: true});

    if(result.error) {
      return next({
        code: CONSTANTS.CODE.WRONG_PARAMS,
        message: MESSAGES.SYSTEM.ERROR
      })
    }

    next(null);
  }

  const getOrderTypeInfo = (next) => {
    const query = {
      _id: orderType,
      status: 1
    }

    OrderTypeModel
      .get(query, "moneyStrategy", (err, result) => {
        if(err) {
          return next(err);
        }

        if(!result) {
          return next({
            code: CONSTANTS.CODE.ORDER_EXPIRE,
            message: MESSAGES.ORDER.ORDER_EXPIRE
          });
        }

        orderTypeInf = result;
        next(null);
      })
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
        if(result.code === 200) {
          distance = result.data;
          polylines = result.polylines;
          return next(null);
        }

        return next(new Error(`St wrong with google service`))
      })
      .catch((err) => {
        return next(err);
      });
  }

  const calculateMoney = (next) => {
    // depend on orderTypeInf and distane, below is just a demo
    let money = orderHelper.calculateMoney(distance, orderTypeInf.moneyStrategy);
    if(req.body.destination.length > 1) {
        money += (req.body.destination.length - 1)*5
    }

    next(null, {
      code: 200,
      data: {
        distance: distance,
        money: money,
        polylines: polylines
      }
    })
  }

  async.waterfall([
    checkParams,
    getOrderTypeInfo,
    getDistance,
    calculateMoney
  ], (err, data) => {
    err && _.isError(err) && (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: MESSAGES.SYSTEM.ERROR
    });

    res.json(data || err);
  })
}
