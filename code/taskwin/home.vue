<template>
  <div id="taskWin">
    <button @click="test">测试</button>
  </div>
</template>
<script>
// import { interfaceObject } from './interface/interface'
var addon = require('./interface/hello')
export default {
  methods: {
    test () {
      alert('1111')
      addon.sayHello()
      alert('2222')
    }
  }
}
</script>
<style lang="scss" scoped>
  #taskWin {
    button{
      width:150px;
      height:30px;
      outline: none;
      background-color: gray;
      color: white;
      font-size:14px;
      border:0;
      cursor: pointer;
    }
  }
</style>