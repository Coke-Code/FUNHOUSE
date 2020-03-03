const shell = require('electron').shell
export const linkObject = {
  FAQ: 'https://www.baidu.com',
  UserGuide: 'https://www.baidu.com',
  Review: 'https://www.baidu.com',
  TechnicalSupport: 'https://www.baidu.com',
  iMyFoneFacebook: 'https://www.facebook.com/imyfone',
  iMyFoneTwitter: 'https://twitter.com/iMyfone',
  appPackageLink: 'https://www.baidu.com',
  buyLink: 'https://www.baidu.com',
  support: 'https://www.imyfone.com/support/',
  home: 'https://www.baidu.com',
  openHome: function () { shell.openExternal(this.home) },
  openSupport: function () { shell.openExternal(this.support) },
  openFAQ: function () { shell.openExternal(this.FAQ) },
  openUserGuide: function () { shell.openExternal(this.UserGuide) },
  openReview: function () { shell.openExternal(this.Review) },
  openTechnicalSupport: function () { shell.openExternal(this.TechnicalSupport) },
  openiMyFoneFacebook: function () { shell.openExternal(this.iMyFoneFacebook) },
  openiMyFoneTwitter: function () { shell.openExternal(this.iMyFoneTwitter) },
  openAppPackageLink: function () { shell.openExternal(this.appPackageLink) },
  openbuyLink: function () { shell.openExternal(this.buyLink) }
}
