<template>
  <div  id="dropdownmenu" :style="menuStyle">
    <div id="dropdownmenubody">
      <ul>
        <li><a @click="onClick('userguide')">{{this.$t('dropdownmenu.userguide')}}</a></li>
        <li><a @click="onClick('review')">{{this.$t('dropdownmenu.review')}}</a></li>
        <li><a @click="onClick('faq')">{{this.$t('dropdownmenu.faq')}}</a></li>
        <div class="line"><p></p></div>
        <li><a>{{this.$t('dropdownmenu.language')}}</a></li>
        <div class="line"><p></p></div>
        <li><a @click="onClick('support')">{{this.$t('dropdownmenu.support')}}</a></li>
        <li><a @click="onClick('facebook')">{{this.$t('dropdownmenu.facebook')}}</a></li>
        <li><a @click="onClick('twitter')">{{this.$t('dropdownmenu.twitter')}}</a></li>
        <div class="line"><p></p></div>
        <li><a @click="onClick('update')">{{this.$t('dropdownmenu.update')}}</a></li>
        <li><a @click="onClick('about')">{{this.$t('dropdownmenu.about')}}</a></li>
        <li><a @click="onClick('exit')">{{this.$t('dropdownmenu.exit')}}</a></li>
      </ul>
    </div>
  </div>
</template>
<script>
import { linkObject } from '../../../object/config/link'
import { winObject } from '../../../object/winObject'
import { PopType } from '../../../object/popTypeObject'
import { ipcRenderer } from 'electron'
function createMenuClickListener (fn) {
  let isListening = false
  return {
    get
    isListening () { return isListening },
    start (cb) {
      window.addEventListener('click', _onclick, true)
      window.addEventListener('keyup', _onescape, true)
      isListening = true
      if (typeof cb === 'function') cb()
    },
    stop (cb) {
      window.removeEventListener('click', _onclick, true)
      window.removeEventListener('keyup', _onescape, true)
      isListening = false
      if (typeof cb === 'function') cb()
    }
  }
  function _onclick (e) { e.preventDefault(); if (typeof fn === 'function') { fn(e) } }
  function _onescape (e) { if (e.keyCode === 27) _onclick(e) }
};
export default {
  data () {
    return {
      top: 0,
      left: 0,
      visible: false,
      BodyClickListener: createMenuClickListener(
        e => {
          let isOpen = !!this.visible
          let outsideClick = isOpen && !this.$el.contains(e.target)

          if (outsideClick) {
            if (e.which !== 1) {
              e.preventDefault()
              e.stopPropagation()
              return false
            } else {
              this.visible = false
              e.stopPropagation()
            }
          } else { this.visible = false }
        }
      )
    }
  },
  methods: {
    setPositionFromEvent (e) {
      e = e || window.event
      const scrollingElement = document.scrollingElement || document.documentElement

      if (e.pageX || e.pageY) {
        this.left = e.pageX - 80
        this.top = e.pageY - scrollingElement.scrollTop + 13
      } else if (e.clientX || e.clientY) {
        this.left = e.clientX + scrollingElement.scrollLeft - 80
        this.top = e.clientY + scrollingElement.scrollTop + 13
      }

      this.$nextTick(() => {
        const menu = this.$el
        const minHeight = (menu.style.minHeight || menu.style.height).replace('px', '') || 32
        const scrollHeight = menu.scrollHeight || minHeight

        const largestHeight = window.innerHeight - scrollHeight - 25
        if (this.top > largestHeight) this.top = largestHeight
      })
      return e
    },
    open (e) {
      if (this.visible) this.visible = false
      this.visible = true // 主要刷新位置
      this.setPositionFromEvent(e)
      this.$el.setAttribute('tab-index', -1)
      this.BodyClickListener.start()
      return this
    },
    close (e) {
      this.visible = false
      this.BodyClickListener.stop(e)
    },
    onClick: function (str) {
      switch (str) {
        case 'userguide': linkObject.openUserGuide(); break
        case 'review': linkObject.openReview(); break
        case 'faq': linkObject.openFAQ(); break
        case 'support': linkObject.openSupport(); break
        case 'facebook': linkObject.openiMyFoneFacebook(); break
        case 'twitter': linkObject.openiMyFoneTwitter(); break
        case 'update': break
        case 'about': ipcRenderer.sendTo(winObject.Pop(), 'Pop', {type: PopType.About, title: this.$t('about.title')}); break
        case 'exit': break
      }
    }
  },
  watch: {
    visible (newVal, oldVal) { if (oldVal === true && newVal === false) { this.BodyClickListener.stop((e) => {}) } }
  },
  computed: {
    menuStyle () {
      return {
        'display': this.visible ? 'block' : 'none',
        'top': (this.top || 0) + 'px',
        'left': (this.left || 0) + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#dropdownmenu{
  position: fixed;
  z-index: 999;
  background-color: #fff;
  box-shadow:$menuShodow;
  border-radius: 5px;
  #dropdownmenubody{
    ul{
      text-align: left;
      list-style: none;
      width: 163px;
      padding: 0px;
      border-radius: 5px;
    }
    ul>li{
      height:22x;
      line-height: 22px;
      font-size:12px;
      cursor:pointer;
      color:$grayFontColor;
    }
    ul>li>a{
      display:block; //占据整行
      font-family: $fontfamily;
      padding-left:25px;
    }
    ul>li>a:hover{
      background-color:$hoverbackgroundcolor;
      color:#fff;
    }
    div{
      height:10px;
      line-height:10px;
      display:flex; 
      justify-content:center;
      align-items:center; 
    }
    div>p{
      height:1px;
      background-color:#e0e0e0;
      width:114px;
    }
  }
  #dropdownmenubody:after{  //处理三角箭头
    content:'';
    position:absolute;
    border:10px solid transparent;
    border-bottom-color:#fff;
    bottom:99%;
    left:70px;
    z-index: 500;
  }
}
#dropdownmenu::after{  //处理三角箭头
  content:'';
  position:absolute;
  border:10px solid transparent;
  border-bottom-color:#ddd;
  bottom:100%;
  left:70px;
  z-index: 400;
}
</style>