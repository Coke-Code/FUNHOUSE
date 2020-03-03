'use strict'
const remote = require('electron').remote
class winClass {
  private mainWin:number = 0
  private popWin:number = 0
  private taskWin:number = 0
  constructor(){
    this.mainWin = remote.getGlobal('winHwnd').main
    this.popWin = remote.getGlobal('winHwnd').pop
    this.taskWin = remote.getGlobal('winHwnd').task
  }
  public Main():number{
    return this.mainWin
  }
  public Pop():number{
    return this.popWin
  }
  public Task():number{
    return this.taskWin
  }
}

export const winObject = new winClass