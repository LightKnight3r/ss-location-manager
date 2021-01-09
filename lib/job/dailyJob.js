const _ = require('lodash');
const Location = require('../models/location')
const LocationDaily = require('../models/LocationDaily')
const CONSTANTS = require('../const');
const config  = require('config')
const async = require('async')
const moment = require('moment')
const ms = require('ms')
var schedule = require('node-schedule');
const mongoConnections = require('../connections/mongo')


class DailyJobManager {
  constructor() {
    this.init();
  }

  init() {
    console.log(' Daily job was init');
    schedule.scheduleJob('30 0 0 * * *', () => {
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

    const fillNewColection = (next) => {
      let done = false;
      let fromTime = startDate;
      const STEP = ms('15m');
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
          })
          .lean()
          .exec((err, results) => {
            console.log('    Total location:', err, results.length);
            if(err) {
              return cb(err);
            }
            async.eachSeries(results, (result, swap) => {
              LocationDaily
                .create(result,(err,res) => {
                  if(err) {
                    return swap(err)
                  }
                  swap()
                })
            }, (err, results) => {
              if(err) {
                return cb(err)
              }
              fromTime = toTime;
              cb();
            })
          })
      }, () => {
        return done;
      }, (err) => {
        if(err) {
          throw err;
        }
        next();
      });
    }
    async.parallel([
      dropColection,
      fillNewColection
    ], (err, data) => {
      if(err) {
        console.log('[dailyJob error]',err);
      }
      if(data) {
        console.log('[dailyJob successfully]');
      }
    })
  }
}

module.exports = new DailyJobManager;
