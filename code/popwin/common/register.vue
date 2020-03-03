<template>
  <div id="register">
    <div id="input-data" v-show="needInput">
      <div>
        <p v-html = "tip"></p>
      </div>
      <div>
        <div><span>{{this.$t('register.email')}}: </span><input type="text" :placeholder="this.$t('register.email-placeholder')" /></div>
        <div><span>{{this.$t('register.code')}}: </span><input type="text" :placeholder="this.$t('register.code-placeholder')" /></div>
      </div>
      <div>
        <button :disabled="btnLeftDisabled">{{btnLeft}}</button><button>{{btnRight}}</button>
      </div> 
    </div>
    <div id="show-data" v-show="!needInput">
      <div>
        <p><span>{{this.$t('register.userid')}}:</span><span> {{userId}}</span></p>
        <p><span>{{this.$t('register.licenseplan')}}:</span><span> {{licensePlan}}</span></p>
        <p><span>{{this.$t('register.expirationdate')}}:</span><span> {{expirationDate}}</span></p>
        <p><span>{{this.$t('register.useddevice')}}:</span><span> {{usedDevice}} {{this.$t('register.device')}} / {{totalDevice}} {{this.$t("register.devices")}}</span></p>
      </div>
      <div>
        <button>{{this.$t('register.changeaccount')}}</button>
        <button>{{this.$t('register.changeplan')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { RegisterStatus } from '../../object/config/register'
export default {
  data () {
    return {
      tip: '',
      btnLeft: '',
      btnRight: '',
      btnLeftDisabled: true,
      needInput: true,
      userId: '1@1',
      licensePlan: '1-Year license',
      expirationDate: '2020.12.17',
      totalDevice: 6,
      usedDevice: 0
    }
  },
  methods: {
    setStatus: function (status) {
      switch (status) {
        case RegisterStatus.Unregistered:
          this.tip = this.$t('register.unregistered-tip')
          this.btnLeft = this.$t('register.buynow')
          this.btnRight = this.$t('register.unregistered-title')
          this.needInput = true
          break
        case RegisterStatus.RegisteredChangeAccount:
          this.tip = this.$t('register.registeredchangeaccount-tip')
          this.btnLeft = this.$t('common.confirm')
          this.btnRight = this.$t('common.cancel')
          this.needInput = true
          break
        case RegisterStatus.Registered:
          this.needInput = false
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  * {
    border: 0;
    padding: 0;
  }
  #register {
    height: 300px;
    padding: 0 40px;
    #input-data {
      height: 100%;
      display: flex;
      flex-direction: column;
      >div:first-child {
        flex-basis: 80px;
        border-bottom: $borderLine;
        padding: 0;
        p {
          font-size:14px;
          color: $grayFontColor;
          margin-top: 20px;
          a {
            color: $commonFontColor;
          }
        }

      }
      >div:nth-child(2) {
        flex-grow: 1;
        padding-top: 20px;
        div {
          color: $grayFontColor;
          font-size: 14px;
          display: flex;
          align-items: center;
          span {
            flex-basis: 140px;
          }
          input[type="text"] {
            width: 200px;
            height: 30px;
            border: $borderLine;
            background-color: #f6f6f6;
            border-radius: 5px;
            flex-grow: 1;
            outline: 0;
            padding:0 5px;
          }
          input[type="text"]::-webkit-input-placeholder {
            color: $placeholderColor;
          }
        }
        div:last-child {
          margin-top: 30px;
        }
      }
      >div:last-child {
        flex-basis: 50px;
        display: flex;
        justify-content: space-evenly;
        button {
          width: 120px;
          height: 30px;
          border-radius: 5px;
          font-size: 14px;
          color: white;
          cursor: pointer;
        }
        >button:first-child {
          background-color: $no-normalBtnBackgroundColor;
        }
        >button:first-child:hover {
          background-color: $no-hoverBtnBackgroundColor;
        }
        >button:first-child:disabled {
          background-color: $disabledBtnBackgroundColor;
        }
        >button:last-child {
          background-color: $normalBtnBackgroundColor;
        }
        >button:last-child:hover {
          background-color: $hoverBtnBackgroundColor;
        }
      }
    }
    #show-data {
      height:80%;
      width:100%;
      display: flex;
      padding-top: 20px;
      >div:first-child {
        flex-grow: 1;
        font-size: 14px;
        >p {
          display: flex;
          // margin-top: 30px;
          margin:25px 0;
          >span:first-child {
            flex-basis: 140px;
            text-align: right;
          }
          >span:last-child {
            margin-left: 10px;
          }
        }
      }
      >div:last-child {
        flex-basis: 140px;
        margin-top: 20px;
        button {
          width: 140px;
          height: 30px;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          font-size:14px;
          margin:5px 0;
          background-color: $normalBtnBackgroundColor;
        }
        button:hover {
          background-color: $hoverBtnBackgroundColor;
        }
        button:disabled {
          background-color: $disabledBtnBackgroundColor;
        }
      }
    }
  }
</style>