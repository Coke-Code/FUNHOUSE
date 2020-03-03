<template>
    <div class="titlebarbtn" :style="titleBarBtnStyle" @mouseenter="mouseEnter" @mouseleave="mouseLeave" @click="onClick">{{content}}</div> 
</template>
<script>
import { styleObject } from '../../../style/picStyle'
import { winObject } from '../../../object/winObject'
import { PopType, MsgboxBtnType, MsgboxIconType, MsgBoxType } from '../../../object/popTypeObject'
const ipcRenderer = require('electron').ipcRenderer
export default {
  data () {
    return {
      status: {close: 'normal', min: 'normal', feedback: 'normal', menu: 'normal', line: 'normal', register: 'disabled', buy: 'normal'}
    }
  },
  props: ['type', 'content'],
  methods: {
    mouseEnter: function () {
      switch (this.type) {
        case 'close': this.status.close = 'hover'; break
        case 'min': this.status.min = 'hover'; break
        case 'feedback': this.status.feedback = 'hover'; break
        case 'menu': this.status.menu = 'hover'; break
        case 'disabled':
          if (this.status.register !== 'disabled') {
            this.status.register = 'hover'
          }
          break
        case 'buy': this.status.buy = 'hover'; break
      }
    },
    mouseLeave: function () {
      switch (this.type) {
        case 'close': this.status.close = 'normal'; break
        case 'min': this.status.min = 'normal'; break
        case 'feedback': this.status.feedback = 'normal'; break
        case 'menu': this.status.menu = 'normal'; break
        case 'register':
          if (this.status.register !== 'disabled') {
            this.status.register = 'normal'
          }
          break
        case 'buy': this.status.buy = 'normal'; break
      }
    },
    onClick: function (e) {
      switch (this.type) {
        case 'close': ipcRenderer.sendTo(winObject.Pop(), 'Pop', {type: PopType.MsgBox, msgboxtype: MsgBoxType.close, title: this.$t('msgbox.exit-title'), content: this.$t('msgbox.exit-content'), btntype: MsgboxBtnType.YesNo, iconType: MsgboxIconType.Question}); break
        case 'min': ipcRenderer.send('min'); break
        case 'feedback': ipcRenderer.sendTo(winObject.Pop(), 'Pop', {type: PopType.Feedback, title: this.$t('feedback.title')}); break
        case 'menu': this.$emit('clickmenu', e); break
        case 'register': ipcRenderer.sendTo(winObject.Pop(), 'Pop', {type: PopType.Register}); break
        case 'buy': break
      }
    }
  },
  computed: {
    titleBarBtnStyle: function () {
      switch (this.type) {
        case 'close': return styleObject.titlebarbtnstyle[this.type][this.status.close]
        case 'min': return styleObject.titlebarbtnstyle[this.type][this.status.min]
        case 'feedback': return styleObject.titlebarbtnstyle[this.type][this.status.feedback]
        case 'menu': return styleObject.titlebarbtnstyle[this.type][this.status.menu]
        case 'line': return styleObject.titlebarbtnstyle[this.type][this.status.line]
        case 'register': return styleObject.titlebarbtnstyle[this.type][this.status.register]
        case 'buy': return styleObject.titlebarbtnstyle[this.type][this.status.buy]
      }
    }
  }
}
</script>

<style scoped>
    .titlebarbtn{
        position: absolute;
        width: 20px;
        height: 20px;
        cursor: pointer;
        -webkit-app-region: no-drag;
        text-align: center;
        color: #fff;
    }
</style>