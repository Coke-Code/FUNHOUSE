<template>
  <div id="msgbox">
    <div>
      <img :src="msgboxIcon" /><p>{{infomation}}</p>
    </div>
    <div>
      <button v-show="yes" @click="yesBtnClick">{{this.$t("common.yes")}}</button><button v-show="no" id="btnno" @click="noBtnClick">{{this.$t("common.no")}}</button><button v-show="ok">{{this.$t("common.ok")}}</button>
    </div>
  </div>
</template>
<script>
import { styleObject } from '../../style/picStyle'
import { MsgboxBtnType, MsgBoxType } from '../../object/popTypeObject'
import { ipcRenderer } from 'electron'
export default {
  data () {
    return {
      infomation: '这是一个测试弹框',
      ok: false,
      yes: true,
      no: true,
      type: '',
      msgboxtype: 0
    }
  },
  methods: {
    yesBtnClick () {
      switch (this.msgboxtype) {
        case MsgBoxType.close: ipcRenderer.send('close'); break
      }
    },
    noBtnClick () {
      this.$emit('hide')
    },
    setMsgBoxType (msgboxtype) {
      this.msgboxtype = msgboxtype
    },
    setContent (content) {
      this.infomation = content
    },
    setButtonType (btnType) {
      switch (btnType) {
        case MsgboxBtnType.YesNo:
          this.yes = true
          this.no = true
          this.ok = false
          break
        case MsgboxBtnType.OK:
          this.yes = false
          this.no = false
          this.ok = true
          break
      }
    },
    SetIconType (iconType) {
      switch (iconType) {
        case 0: this.type = 'success'; break
        case 1: this.type = 'question'; break
        case 2: this.type = 'error'; break
      }
    }
  },
  computed: {
    msgboxIcon: function () {
      return styleObject.msgboxstyle[this.type]
    }
  }
}
</script>
<style lang="scss" scoped>
#msgbox{
  font-family: $fontfamily;
  display:flex;
  height: 175px;
  flex-direction: column;
  >div:first-child {
    flex-grow: 1;
    display: flex;
    align-items: center;
    img{
      width:44px;
      height:44px;
      margin: 0 20px;
      -webkit-user-drag: none;
    }
    p{
      max-width:310px;
      word-wrap: break-word;
      word-break: break-all;
      font-size: 14px;
    }
  }
  >div:last-child{
    flex-basis: 50px;
    display: flex;
    justify-content: flex-end;
    button{
      color:white;
      font-size: 16px;
      width: 120px;
      height: 30px;
      border-radius: 5px;
      border: 0;
      outline: 0;
      margin-right: 20px;
      cursor: pointer;
      background-color: $normalBtnBackgroundColor;
    }
    button:hover{
      background-color: $hoverBtnBackgroundColor;
    }
    #btnno{
      background-color: $no-normalBtnBackgroundColor;
    }
    #btnno:hover{
      background-color: $no-hoverBtnBackgroundColor;
    }
  }
}
</style>