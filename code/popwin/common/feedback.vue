<template>
  <div id="feedback">
    <div>
      <p>{{this.$t('feedback.tip')}}</p>
      <div><span>{{this.$t('feedback.email')}}:</span><span>*</span> <input type="text" v-model="emailValue" placeholder="1@1" :readonly="submitStatus!='uncommitted'" /><span v-show="emailInvalid"> {{this.$t('feedback.invalidtip')}}!</span></div>
      <p>{{this.$t('feedback.contenttip')}}:</p>
      <textarea :placeholder="this.$t('feedback.content')" v-model="contentValue" :readonly="submitStatus!='uncommitted'"></textarea>
      <div>
        <div>
          <div>
            <input type="text" :placeholder="this.$t('feedback.brand')" :readonly="submitStatus!='uncommitted'" v-model="brandValue" />
          </div>
          <div>
            <input type="text" :placeholder="this.$t('feedback.model')" :readonly="submitStatus!='uncommitted'" v-model="modelValue"  />
          </div>
        </div>
        <div>
          <div>
            <p @click="onDropList()"><span>{{androidVersion[chooseAndroidVersionIndex]}}</span><img :src="DropListFoldStatus" /></p>
            <ul v-show="foldStatus==='fold'">
              <li v-for="(item,index) in androidVersion" @click="onSelectAndroidVersion(index)">{{item}}</li>
            </ul>
          </div>
          <div style="background-color:#eee;" >
            <input type="text" style="background-color:#eee;"  readonly v-model="osVersion" />
          </div>
        </div>
      </div>
      <div>
        <span :style="CheckStatus" @click="onCheck"></span><span> {{this.$t('feedback.attach')}}</span>
      </div>
    </div>
    <div>
      <div v-if="submitStatus=='uncommitted'" id="uncommitted">
        <button :disabled="submitDisabled" @click="onSubmit">{{this.$t('feedback.submit')}}</button>
      </div>
      <div v-else-if="submitStatus=='committing'" id="committing">
        <img src="../../../static/skin/feedback/loading.gif" /><span> {{this.$t('feedback.committing')}}...</span>
      </div>
      <div v-else id="committed">
        <img :src="SubmitResultIcon" />
        <div v-if="submitResult=='success'">
          <p>{{this.$t('feedback.successtitle')}}!</p>
          <p><span>{{this.$t('feedback.successcontent')}}</span><span class="spanlink"> {{this.$t('feedback.feedbackback')}}>></span></p>
        </div>
        <div v-else>
          <p>{{this.$t('feedback.failedtitle')}}!</p>
          <p v-html="this.$t('feedback.failedcontent')"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { styleObject } from '../../style/picStyle'
import { getOSVersion } from '../../object/config/osversion'
import { emailObject } from '../../object/common/email'
import { ipcRenderer } from 'electron'
const AdmZip = require('adm-zip')
export default {
  data () {
    return {
      emailInvalid: false,
      isCrash: false,
      emailValue: '',
      contentValue: '',
      brandValue: '',
      modelValue: '',
      checkStauts: 'unselect',
      submitStatus: 'uncommitted',
      submitDisabled: true,
      submitResult: 'success',
      osVersion: getOSVersion(),
      foldStatus: 'unfold',
      androidVersion: [this.$t('feedback.androidversion'), 'Android 10.0', 'Android 9.0', 'Android 8.1', 'Android 8.0', 'Android 7.1.2', 'Android 7.1.1', 'Android 7.1', 'Android 7.0', 'Android 6.0.1', 'Android 6.0', 'Android 5.1.1',
        'Android 5.1', 'Android 5.0.2', 'Android 5.0.1', 'Android 4.4W.2', 'Android 4.4W.1', 'Android 4.4W', 'Android 4.4.4', 'Android 4.4.3', 'Android 4.4.2', 'Android 4.4.1', 'Android 4.4', 'Android 4.3.1',
        'Android 4.3', 'Android 4.2.2', 'Android 4.2.1', 'Android 4.2', 'Android 4.1.2', 'Android 4.1', 'Android 4.0.4', 'Android 4.0.3', 'Android 4.0.2', 'Android 4.0.1', 'Android 4.0', 'Android 5.0', 'Other'
      ],
      chooseAndroidVersionIndex: 0
    }
  },
  methods: {
    onCheck: function () {
      if (this.submitStatus === 'uncommitted') {
        this.checkStauts = (this.checkStauts === 'unselect') ? 'select' : 'unselect'
      }
    },
    onSubmit: function () {
      this.submitStatus = 'committing'
      let emailContent = `客户邮箱: ${this.emailValue}\n
                          注册邮箱: \n
                          产品名称: \n
                          产品版本号: \n
                          手机厂商: ${this.brandValue}\n
                          手机型号: ${this.modelValue}\n
                          安卓版本: ${this.androidVersion[this.chooseAndroidVersionIndex]}\n
                          PC系统版本: ${this.osVersion}\n
                          邮件内容: ${this.contentValue}`
      if (this.checkStauts === 'unselect') {
        let attachments = []
        emailObject.sendMail(this.isCrash, emailContent, attachments)
      } else {
        var zip = new AdmZip()
        zip.addLocalFolder('./Log')
        if (this.isCrash) {
          zip.addLocalFolder('./temp')
        }
        zip.writeZip('./log.zip', function (err, msg) {
          console.log(`error: ${err} msg ${msg}`)
        })
        let attachments = [
          {
            filename: 'log.zip',
            path: './log.zip'
          }
        ]
        emailObject.sendMail(this.isCrash, emailContent, attachments)
      }
    },
    onDropList: function () {
      if (this.submitStatus === 'uncommitted') {
        this.foldStatus = (this.foldStatus === 'fold') ? 'unfold' : 'fold'
      }
    },
    onSelectAndroidVersion: function (index) {
      this.chooseAndroidVersionIndex = index
      this.foldStatus = 'unfold'
    }
  },
  computed: {
    CheckStatus: function () {
      return styleObject.checkboxstyle[this.checkStauts]
    },
    SubmitResultIcon: function () {
      return styleObject.feedbacksubmitresultstyle[this.submitResult]
    },
    DropListFoldStatus: function () {
      return styleObject.droplistfoldstyle[this.foldStatus]
    }
  },
  watch: {
    emailValue: function (newval, oldval) {
      if (newval === '') {
        this.submitDisabled = true
        this.emailInvalid = false
      } else if (!emailObject.verifyEmail(newval)) {
        this.submitDisabled = true
        this.emailInvalid = true
      } else {
        this.submitDisabled = false
        this.emailInvalid = false
      }
    }
  },
  created () {
    ipcRenderer.on('sendFeedbackFailed', (event, data) => {
    })
  }
}
</script>

<style src="../../style/scroll.css"></style>
<style lang="scss" scoped>
  *{
    margin: 0;
    padding: 0;
  }
  #feedback {
    height: 510px;
    display: flex;
    flex-direction: column;
    font-family: $fontfamily;
    >div:first-child {
      margin:0 40px;
      margin-top: 20px;
      flex-grow: 1;
      color: $grayFontColor;
      font-size: 14px;
      >p:first-child {
        color: $grayFontColor;
        font-size: 14px;
        min-height: 60px;
      }
      >div:nth-child(2) {
        >span:nth-child(2n) {
          color: red;
          font-size:12px;
        }
        >input {
          height: 30px;
          width: 210px;
          border: $grayBorderLine;
          border-radius: 2px;
          outline: 0;
          padding-left: 5px;
        }
      }
      >p:nth-child(3) {
        margin:5px 0;
      }
      >textarea {
        height: 100px;
        outline: 0;
        width: calc(100% - 12px);
        padding: 0;
        padding:0 5px;
        font-size: 12px;
        font-family: $fontfamily;
        border: $grayBorderLine;
        border-radius: 2px;
        overflow-x: hidden;
        resize : none;
      }
      >div:nth-child(5){
        display: flex;
        align-content: space-between;
        flex-flow: row wrap;
        margin: 20px 0;
        height: 70px;
        >div {
          height:30px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          >div { 
            width:47%;
            height: 30px;
            color: $grayFontColor;
            margin: 0;
            border: $grayBorderLine;
          >input {
            width: calc(100% - 10px);
            height: 100%;
            outline: 0;
            padding: 0 5px;
            border: none;
            color: $grayFontColor;
          }
          >input::-webkit-input-placeholder {
            color: $placeholderColor;
          }
          >p {
            height: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding:0 5px;
            cursor: pointer;
            img {
              width: 10px;
              height: 8px;
            }
          }
          ul {
              background-color: white;
              border:$borderLine;
              width: 100%;
              max-height: 150px;
              overflow-y: auto;
              list-style: none;
              box-shadow: $dropListBoxShadow;
              li {
                height: 25px;
                line-height: 25px;
                padding: 0 5px;
                cursor: pointer;
              }
              li:hover{
                  background-color: rgba(204, 237, 224, 1)
              }
            }
          }
        }
      }
      >div:nth-child(6) {
        border-top: $borderLine;
        padding-top: 20px;
        >span:first-child {
          width: 14px;
          height: 14px;
          display: inline-block;
          cursor: pointer;
        }
      }
    }
    >div:last-child {
      flex-basis: 70px;
      #uncommitted {
        text-align: center;
        button {
          width:150px;
          height: 30px;
          color: white;
          border: 0;
          outline: 0;
          background-color:$normalBtnBackgroundColor;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: $hoverBtnBackgroundColor;
        }
        button:disabled {
          background-color: $disabledBtnBackgroundColor;
        }
      }
      #committing{
        height:100%;
        border-top: $greenBorderLine;
        background-color:#eef8ee;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: 20px;
          height: 20px;
        }
        span {
          margin-left: 10px;
          color: $commonFontColor;
        }
      }
      #committed {
        border-top: $greenBorderLine;
        background-color:#eef8ee;
        height:100%;
        border-radius: 0 0 5px 5px;
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          margin-left:40px;
          margin-right:20px;
        }
        >div {
          >p:first-child{
            color: $commonFontColor;
          }
          >p:last-child {
            font-size:12px;
            .spanlink {
              color:#00a464;
              cursor: pointer;
            }
            .spanlink:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
</style>
