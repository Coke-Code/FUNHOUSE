export const styleObject = {
  titlebarbtnstyle: {
    min: {
      normal: {backgroundImage: `url(${require('@../../../static/skin/titlebar/minimize.jpg')})`, right: '60px'},
      hover: {backgroundImage: `url(${require('@../../../static/skin/titlebar/minimize_hover.jpg')})`, right: '60px'}
    },
    close: {
      normal: {backgroundImage: `url(${require('@../../../static/skin/titlebar/close.jpg')})`, right: '20px'},
      hover: {backgroundImage: `url(${require('@../../../static/skin/titlebar/close_hover.jpg')})`, right: '20px'}
    },
    menu: {
      normal: {backgroundImage: `url(${require('@../../../static/skin/titlebar/menu.jpg')})`, right: '100px'},
      hover: {backgroundImage: `url(${require('@../../../static/skin/titlebar/menu_hover.jpg')})`, right: '100px'}
    },
    feedback: {
      normal: {backgroundImage: `url(${require('@../../../static/skin/titlebar/feedback.jpg')})`, right: '140px'},
      hover: {backgroundImage: `url(${require('@../../../static/skin/titlebar/feedback_hover.jpg')})`, right: '140px'}
    },
    line: {
      normal: {width: '1px', height: '20px', right: '180px', backgroundColor: '#ddd'}
    },
    register: {
      normal: {backgroundImage: `url(${require('@../../../static/skin/titlebar/register.png')})`, width: '25px', height: '25px', right: '200px'},
      hover: {backgroundImage: `url(${require('@../../../static/skin/titlebar/register_hover.png')})`, width: '25px', height: '25px', right: '200px'},
      disabled: {backgroundImage: `url(${require('@../../../static/skin/titlebar/unregister.png')})`, width: '25px', height: '25px', right: '200px'}
    },
    buy: {
      normal: {backgroundImage: `url(${require('@../../../static/skin/titlebar/buy.png')})`, right: '245px', width: '90px', height: '30px', lineHeight: '30px'},
      hover: {backgroundImage: `url(${require('@../../../static/skin/titlebar/buy_hover.png')})`, right: '245px', width: '90px', height: '30px', lineHeight: '30px'}
    }
  },
  msgboxstyle: {
    success: require('@../../../static/skin/msgbox/success.png'),
    question: require('@../../../static/skin/msgbox/question.png'),
    error: require('@../../../static/skin/msgbox/error.png')
  },
  checkboxstyle: {
    unselect: {backgroundImage: `url(${require('@../../../static/skin/app/checkbox-unselect.png')})`},
    select: {backgroundImage: `url(${require('@../../../static/skin/app/checkbox-select.png')})`}
  },
  feedbacksubmitresultstyle: {
    success: require('@../../../static/skin/feedback/success.png'),
    failed: require('@../../../static/skin/feedback/failed.png')
  },
  droplistfoldstyle: {
    fold: require('@../../../static/skin/feedback/fold.png'),
    unfold: require('@../../../static/skin/feedback/unfold.png')
  }
}
