const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash')
const mongoConnections = require('../connections/mongo')

var Location = new mongoose.Schema({
    member : {
      type: Schema.Types.ObjectId
    },
    location: {
       type: mongoose.Schema.Types.Mixed
    },
    bearing:{type:Number},
    speed:{type:Number},
    sync:{type:Number},
    updatedAt: {
      type: Number
    }
}, {id: false, versionKey: false})

module.exports = mongoConnections('master').model('Location', Location);
