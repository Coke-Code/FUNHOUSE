import { ipcRenderer } from 'electron'
import { productObject } from './product'
import { winObject } from '../winObject'
const nodemailer = require('nodemailer')
class EmailClass {
  // constructor () {}
  verifyEmail (val) {
    var reg = /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (reg.test(val) && val.length < 129) {
      return true
    } else {
      return false
    }
  }
  trim (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }
  async sendMail (isCrash, msg, attachments) {
    let strReceiver = 'support@imyfone.com'
    let subject = `${productObject.getProductName()} Feedback`
    if (isCrash) {
      strReceiver = 'feedback@imyfone.com'
      subject = `${productObject.getProductName()} Crash Feedback`
    }

    const smtpTransport = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 25,
      auth: {
        user: 'd-back@imyfone.com',
        pass: 'Mf#kj$85^25*G'
      }
    })

    const mailOptions = {
      from: 'd-back@imyfone.com',
      to: strReceiver,
      subject: subject,
      text: msg,
      attachments: attachments
    }

    smtpTransport.sendMail(mailOptions, function (err, info) {
      if (err) {
        ipcRenderer.sendTo(winObject.Pop(), 'sendFeedbackFailed', err.toString())
      } else {
        ipcRenderer.sendTo(winObject.Pop(), 'sendFeedbackSuccess')
      }
    })
  }
}
export const emailObject = new EmailClass()
