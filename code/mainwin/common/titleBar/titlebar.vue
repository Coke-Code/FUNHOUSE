<template>
    <div id="titlebar">
        <img src="../../../../static/skin/logo/logo.png" />
        <TitleBarBtn type="close" />
        <TitleBarBtn type="min" />
        <TitleBarBtn type="menu" @clickmenu="onClickMenu" />
        <TitleBarBtn type="feedback" />
        <TitleBarBtn type="line" />
        <TitleBarBtn type="register" />
        <TitleBarBtn type="buy" :content='this.$t("titlebar.buy")' />
        <DropDownMenu ref="DropDwonMenuRef" />
    </div>
</template>
<script>
import TitleBarBtn from './titlebarbtn'
import DropDownMenu from './dropdownmenu'
export default {
  components: {TitleBarBtn, DropDownMenu},
  methods: {
    onClickMenu: function (e) {
      this.$refs.DropDwonMenuRef.open(e)
    }
  }
}
</script>

<style lang="scss" scoped>
    #titlebar{
        position: relative;
        width: 100%;
        height: 48px;
        -webkit-app-region: drag;
        border-bottom: $borderLine;
        align-items:center;
        display:flex; 
        img{
            width:30px;
            height:30px;
            margin-left:20px;
            -webkit-app-region: no-drag;
            -webkit-user-drag: none;
        }
    }
</style>