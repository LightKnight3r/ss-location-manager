module.exports = {
  CODE: {
    SUCCESS: 200,
    FAIL: 300,
    WRONG_PARAMS: 400,
    SYSTEM_ERROR: 500,
    TOKEN_EXPIRE: 1993,
    ORDER_EXPIRE: 1999
  },
  ORDER_STATUS: {
    LOOKING_SHIPPER: 0,
    FOUND_SHIPPER: 1,
    SHIPPING: 2,
    DONE: 3,
    CAN_NOT_FIND_SHIPPER: 4,
    REJECT: 5
  },
  CONFIG_TYPE: {
    RANKING: 10
  }
}
