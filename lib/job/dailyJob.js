const _ = require('lodash');
const Location = require('../models/location')
const LocationDaily = require('../models/locationDaily')
const CONSTANTS = require('../const');
const config  = require('config')
const async = require('async')
const moment = require('moment')
const ms = require('ms')
var schedule = require('node-schedule');
const mongoConnections = require('../connections/mongo')
const MailUtil = require('../util/mail');


class DailyJobManager {
  constructor() {
    this.init();
  }

  init() {
    console.log(' Daily job was init');
    schedule.scheduleJob('00 10 0 * * *', () => {
      const date = new Date();
      console.log(moment(date).format("DD/MM hh:mm:ss"))
      this.runExport();
    });
  }
  runExport() {

    const date = new Date();
    const endDate = date.setHours(0,0,0,0);
    const startDate = endDate - ms('1d');

    const dropColection = (next) => {
      mongoConnections('master').dropCollection('locationdailies', function(err, result) {
        if(err) {
          return next(err)
        }
        next()
      });
    }

    const createNewCollection = (next) => {
      mongoConnections('master')
        .createCollection("locationdailies")
        .then((result) => {

          LocationDaily.collection
            .createIndex({location: '2dsphere'})
            .then((result) => {
              next();
            })
            .catch((err) => {
              return next(err);
            })

          LocationDaily.collection
            .createIndex({member: 1, updatedAt:1})
        })
        .catch((err) => {
          return next(err)
        })
    }

    const fillNewColection = (next) => {
      let done = false;
      let fromTime = startDate;
      const STEP = ms('2m');
      async.doUntil((cb) => {
        if(fromTime >= endDate) {
          done = true;
          return cb();
        }

        const toTime = fromTime + STEP;

        Location
          .find({
            updatedAt: {
              $gte: fromTime,
              $lt: toTime
            }
          },{},{timeout: true})
          .lean()
          .exec((err, results) => {
            fromTime = toTime;

            if(results) {
              console.log('    Total location:', results.length);
            }
            if(err) {
              console.log('   Location err:', err);
              return cb();
            }
            if(!results || !results.length) {
              return cb();
            }
            LocationDaily
              .insertMany(results,() =>{
                results = null
                cb();
              })
          })
      }, () => {
        return done;
      }, (err) => {
        if(err) {
          throw err;
        }
        next(null,'successfully');
      });
    }
    async.waterfall([
      dropColection,
      createNewCollection,
      fillNewColection
    ], (err, data) => {
      if(err) {
        MailUtil.sendMail(`[dailyJob error]`,err);
        console.log('[dailyJob error]',err);
      }
      if(data) {
        MailUtil.sendMail(`[dailyJob successfully] ${data}`);

        console.log('[dailyJob successfully]', data);
      }
    })
  }
}

module.exports = new DailyJobManager;
