<template>
  <div id="about">
    <div>
      <img src="../../../static/skin/app/logo50.png">
      <div>
        <p>{{this.$t('common.product')}}</p>
        <p>{{this.$t('about.product-description')}}</p>
      </div>
    </div>
    <div>
      <div>
        <p>{{this.$t('about.version')}}:{{version}}</p>
        <p>{{this.$t('about.company-description')}}</p>
      </div>
      <div>
        <p>{{this.$t('common.support')}}: <span @click="onSupport">{{support}}</span></p>
        <p>{{this.$t('common.home')}}: <span @click="onHome">{{home}}</span></p>
        <div><p></p><span> {{this.$t('about.copyright')}} </span><p></p></div>
      </div>
    </div>
  </div>
</template>
<script>
const shell = require('electron').shell
export default {
  data () {
    return {
      support: 'https://www.imyfone.com/support/',
      home: 'https://android.imyfone.com/',
      version: '2.0.0'
    }
  },
  methods: {
    onSupport: function () {
      shell.openExternal(this.support)
    },
    onHome: function () {
      shell.openExternal(this.home)
    }
  }
}
</script>

<style lang="scss" scoped>
  * {
    margin: 0;
    padding: 0;
  }
  #about {
    height: 330px;
    display: flex;
    padding: 0 40px;
    flex-direction: column;
    >div:first-child {
      flex-basis: 100px;
      border-bottom: $borderLine;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      >img {
        width: 50px;
        height: 50px;
      }
      >div {
        margin-left: 20px;
        color:$grayFontColor;
        >p:first-child {
          font-size: 18px;
        }
        >p:last-child {
          font-size: 14px;
          margin-top: 10px;
        }
      }
    }
    >div:last-child {
      flex-grow: 1;
      display:flex;
      flex-direction: column;
      flex-flow: row wrap;
      align-content: space-between;
      color:$grayFontColor;
      font-size:14px;
      >div:first-child {
        margin-top: 20px;
        >p:last-child{
          margin-top:10px;
        } 
      }
      >div:last-child {
        width: 100%;
        >p {
          span {
            color: $normalBtnBackgroundColor;
          }
          span:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }
        >div {
          margin:20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          p {
            flex-grow: 1;
            background-color: #e0e0e0;
            height: 1px;
          }
        }
      }
    }
  }
</style>