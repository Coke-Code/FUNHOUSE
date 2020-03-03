'use strict'
const remote = require('electron').remote

class WinClass {
  constructor () {
    this.main = remote.getGlobal('winHwnd').main
    this.pop = remote.getGlobal('winHwnd').pop
  }
  Main () { return this.main }
  Pop () { return this.pop }
}

export const winObject = new WinClass()
