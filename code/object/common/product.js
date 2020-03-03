const shell = require('electron').shell
class ProductClass {
  getProductName () {
    return shell.app.getProductName()
  }
}
export const productObject = new ProductClass()
