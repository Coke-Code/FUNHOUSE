<template>
  <div id="parentWin">
      <div>
        <span>{{title}}</span>
        <span @click="hideWin"></span>
      </div>
      <MsgBox ref="MsgBoxRef" v-show="pageIndex===MsgBox.pageIndex" @hide="hideWin" />
      <About ref="AboutRef" v-show="pageIndex==About.pageIndex" />
      <Feedback ref="FeedbackRef" v-show="pageIndex==Feedback.pageIndex" />
      <Register ref="registerRef" v-show="pageIndex==Register.pageIndex" />
    </div>
</template>
<script>
import MsgBox from './common/msgbox'
import About from './common/about'
import Feedback from './common/feedback'
import Register from './common/register'
import { ipcRenderer } from 'electron'
import { PopType } from '../object/popTypeObject'
import { RegisterStatus, registerObject } from '../object/config/register'
const remote = require('electron').remote
const win = remote.getCurrentWindow()
export default {
  components: {MsgBox, About, Feedback, Register},
  data () {
    return {
      pageIndex: 4,
      title: '弹窗',
      MsgBox: {pageIndex: 1},
      About: {pageIndex: 2},
      Feedback: {pageIndex: 3},
      Register: {pageIndex: 4}
    }
  },
  methods: {
    hideWin: function () {
      win.hide()
    },
    handleMsgBox: function (data) {
      this.pageIndex = this.MsgBox.pageIndex
      this.title = data.title
      this.$refs.MsgBoxRef.setMsgBoxType(data.msgboxtype)
      this.$refs.MsgBoxRef.setContent(data.content)
      this.$refs.MsgBoxRef.setButtonType(data.btntype)
      this.$refs.MsgBoxRef.SetIconType(data.iconType)
      win.setSize(460, 250)
      win.show()
    },
    handleAbout: function (data) {
      this.pageIndex = this.About.pageIndex
      this.title = data.title
      win.setSize(600, 390)
      win.show()
    },
    handleFeedback: function (data) {
      this.pageIndex = this.Feedback.pageIndex
      this.title = data.title
      win.setSize(600, 570)
      win.show()
    },
    handleRegister: function (data) {
      this.pageIndex = this.Register.pageIndex
      let register = registerObject.GetStatus()
      switch (register) {
        case RegisterStatus.Unregistered: this.title = this.$t('register.unregistered-title'); break
        case RegisterStatus.RegisteredChangeAccount: this.title = this.$t('register.registeredchangeaccount-title'); break
        case RegisterStatus.Registered: this.title = this.$t('register.registered-title'); break
      }
      this.$refs.registerRef.setStatus(register)
      win.setSize(580, 360)
      win.show()
    }
  },
  created () {
    ipcRenderer.on('Pop', (event, data) => {
      win.setResizable(true)
      switch (data.type) {
        case PopType.MsgBox: this.handleMsgBox(data); break
        case PopType.About: this.handleAbout(data); break
        case PopType.Feedback: this.handleFeedback(data); break
        case PopType.Register: this.handleRegister(data); break
      }
      win.setResizable(false)
    })
  }
}
</script>
<style lang="scss" scoped>
*{
    user-select: none;
}
#parentWin{
  background: white;
  box-shadow: $boxShadow;
  border-radius: 5px;
  font-family: $fontfamily;
  >div:first-child{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    -webkit-app-region: drag;
    border-bottom: $borderLine;
    >span:first-child {
      margin-left: 20px;
      -webkit-app-region: no-drag;
    }
    >span:last-child {
      width: 20px;
      height: 20px;
      margin-right: 20px;
      cursor: pointer;
      -webkit-app-region: no-drag;
      background-image: url('../../static/skin/app/close.jpg');
    }
    >span:last-child:hover {
      background-image: url('../../static/skin/app/close_hover.jpg');
    }
  }
}

</style>