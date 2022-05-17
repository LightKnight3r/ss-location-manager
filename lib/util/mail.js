const nodemailer = require('nodemailer');
const _ = require('lodash');
const config = require('config');

transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sanshipsystem@gmail.com',
        pass: '123456aA@'
    }
})

module.exports = {
  sendMail: (body, listEmailAlert) => {
    console.log('ahihi sendMail',body,listEmailAlert);
    if(!listEmailAlert) {
      listEmailAlert = _.get(config, 'listEmailAlert', []).join(',');
    }

    const mailOptions = {
      from:'"Săn Ship System" <sanshipsystem@gmail.com>', // sender address
      to: listEmailAlert, // list of receivers
      subject: 'HEYU - Location - Manager', // Subject line
      text: `Report Location Inf:\n\n${body}\n\nBest regards,\nHeyU Team`, // plain text body
    }

    transporter.sendMail(mailOptions, (error, info) => {});
  }
}
