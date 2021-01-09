const _ = require('lodash')
const config = require('config')
const validator = require('validator')
const rp = require('request-promise')
const async = require('async')
const utils = require('../../util/utils')
const OrderTypeModel = require('../../models/orderType');
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')

module.exports = (req, res) => {
    const distance = _.get(req, 'body.distance', 0);
    const orderType = _.get(req, 'body.orderType', '');
    let orderTypeInf;

    const checkParams = (next) => {
      if(!validator.isMongoId(orderType) || !_.isNumber(distance)) {
        return next({
          code: CONSTANTS.CODE.WRONG_PARAMS,
          message: MESSAGES.SYSTEM.ERROR
        });
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

    const calculateMoney = (next) => {
      return next({
        code: CONSTANTS.CODE.SUCCESS,
        data: calculateMoneyHelper(distance, orderTypeInf.moneyStrategy)
      })
    }

    async.waterfall([
      checkParams,
      getOrderTypeInfo,
      calculateMoney
    ], (err, data) => {
      err && _.isError(err) && (data = {
          code: CONSTANTS.CODE.SYSTEM_ERROR,
          message: MESSAGES.SYSTEM.ERROR
      });

      res.json(data || err);
    });
}

function calculateMoneyHelper (distance, strategy) {
  return 20.5;
}
