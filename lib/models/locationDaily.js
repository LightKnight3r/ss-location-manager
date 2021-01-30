const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash')
const mongoConnections = require('../connections/mongo')

var LocationDaily = new mongoose.Schema({
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

LocationDaily.index({updatedAt: 1});
LocationDaily.index({member: 1, updatedAt:1});
LocationDaily.index({location: '2dsphere'});

module.exports = mongoConnections('master').model('LocationDaily', LocationDaily);
