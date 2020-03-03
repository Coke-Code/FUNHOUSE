'use strict'

export const RegisterStatus = {
  Unregistered: 1,
  RegisteredChangeAccount: 2,
  Registered: 3
}

class RegisterClass {
  constructor () {
    this.registerStatus = RegisterStatus.Registered
  }
  GetStatus () {
    return this.registerStatus
  }
}

export const registerObject = new RegisterClass()
