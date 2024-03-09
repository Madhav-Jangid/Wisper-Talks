const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('../Client/env');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  },
});

module.exports = transporter;
