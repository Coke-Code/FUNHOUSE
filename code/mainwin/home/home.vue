<template>
    <div id="home">
        <MainWinTitleBar />
        <div @click="test2">{{test}}</div>
    </div>
</template>

<script>
import MainWinTitleBar from '../common/titleBar/titlebar'
const remote = require('electron').remote
const win = remote.getCurrentWindow()
export default {
  components: { MainWinTitleBar },
  data () {
    return {
      test: '121212'
    }
  },
  methods: {
    test2 () {
      win.loadURL('https://accounts.google.com')
    }
  }
}
</script>

<style lang="scss" scoped>
    *{
        user-select: none;
    }
    #home {
        width: 1080px;
        height: 680px;
        border:0px;
        border-radius: 5px;
        box-shadow: $boxShadow;
        margin-left:10px;
        margin-top:10px;
        background:#fff;
        overflow: auto;
    }
</style>