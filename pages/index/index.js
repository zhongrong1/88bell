//index.js
var app = getApp();
Page({
  data: {
    user: {},
    encryptedData: "",//
    content: "",//想说的话
    money: "",//赏金
    count: "",//数量
    openid:"",
    serviceCharge:"",//费率
    serviceChargeShow:"0.01",//费率实际金额
    disabled:false,//按钮禁用开关
    endtimes:[],//有效时间数组
    endTimeType: true,//是否显示有效时间
    logo: "http://v.6le.com/static/login/images/banner_slide_06.jpg",//顶部logo
    btName: "生成语音口令"
  },
  onShow: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          user: userInfo
        })
        wx.login({
          success: function (res) {
            if (res.code) {
              var NICKNAME = userInfo.nickName;
              var GENDER = userInfo.gender == 1 ? "男" : "女";
              var ADDRESS = userInfo.province + userInfo.city + userInfo.country;
              var AVATARURL = userInfo.avatarUrl;
              //发起网络请求
              wx.request({
                url: app.globalData.bathpath + '/MiniProgram/onLogin',
                data: {
                  code: res.code,
                  NICKNAME: NICKNAME,
                  GENDER: GENDER,
                  ADDRESS: ADDRESS,
                  AVATARURL: AVATARURL,
                  pageType: "index"
                },
                method: 'POST',
                success: function (res) {
                  if (res.data == "0") {
                    var page = getCurrentPages().pop();
                    page.onLoad();
                    return;
                  }
                  var json = res.data
                  var OPENID = json.openid
                  var serviceCharge = json.serviceCharge
                  var times = json.times
                  var endTimeType = json.endTimeType
                  var logo = json.logo
                  var btName = json.btName
                  that.setData({
                    openid: OPENID,
                    serviceCharge: serviceCharge,
                    endtimes: times,
                    endTimeType: endTimeType,
                    logo: logo,
                    btName: btName
                  })
                },
                fail: function (res) {

                },
                complete: function (res) {

                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
      }
    })
  },
  textinput: function (event) {
    var type = event.currentTarget.dataset.type;
    if (type == 1) {
      this.setData({
        content: event.detail.value
      })
    } else if (type == 2) {
      this.setData({
        money: event.detail.value,
        serviceChargeShow: this.data.serviceCharge * event.detail.value
      })
    } else if (type == 3) {
      this.setData({
        count: event.detail.value
      })
    }
  },
  sendRed: function (e) {
    var that = this;
    var dataValue = e.detail.value
    var openid = that.data.openid;
    var content = that.data.content
    var money = that.data.money
    var count = that.data.count
    var endtime_result = dataValue.radio
    var formId = e.detail.formId
    console.log()
    that.setData({
      disabled: true
    })
    wx.showLoading({
      title: '请稍候...',
    })
    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/sendRed',
      data: {
        content: content,
        money: money,
        count: count,
        openid: openid,
        endtime_result: endtime_result,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        var json = res.data;
        var status = json.status
        if(status == "1"){
          that.pay(res.data, formId)
        }else{
          app.okcash("提示", json.content);
        }
      },
      fail: function () {
        that.setData({
          disabled: false
        })
      },
      complete: function () {
        wx.hideLoading()
        that.setData({
          disabled: false
        })
      }
    })
  },

  pay: function (obj, formId) {
    var that = this;
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': 'MD5',
      'paySign': obj.paySign,
      'success': function (res) {
        that.updateState(obj.redTask_id, '1')
        that.sendTemplateMessage(obj.redTask_id, '1', formId)
      },
      fail: function () {
        wx.showToast({ title: '支付失败', image: '/images/no.png', duration: 4000 })
        that.sendTemplateMessage(obj.redTask_id, '2', formId)
      },
      complete: function () {
        // complete
      }
    })
  },
  sendTemplateMessage: function(id,state,formId){
    var that = this
    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/sendTemplateMessage',
      data: {
        REDTASK_ID: id,
        state: state,
        formId: formId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        
      },
      fail: function () {

      },
      complete: function () {

      }
    })
  },
  updateState: function (ID, TASKSTATE) {
    var that = this;
    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/updateState',
      data: {
        REDTASK_ID: ID,
        TASKSTATE: TASKSTATE

      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        that.setData({
          content: "",
          money: "",
          count: "",
        })
        console.log(res.data)
        if (res.data == 1) {
          wx.navigateTo({ url: "/pages/share/share?REDTASK_ID=" + ID});
        } else {
          wx.showToast({ title: '系统异常,请联系管理员', image: '/images/no.png', duration: 4000 })
        }
      },
      fail: function () {

      },
      complete: function () {
        
      }
    })
  },
  radioChange: function (e) {
    var endtime_result = e.detail.value
  },
  onPullDownRefresh: function () {
    this.setData({
      content: "",
      money: "",
      count: "",
    })
    var page = getCurrentPages().pop();
    page.onLoad();
    wx.stopPullDownRefresh()
  }
});
